/**
 * @author yangxiaochuan
 * 工作日报&&部门工作日报
 */
import Component from "../../../lib/component";
import template from './work-report.html';
import './work-report.scss';
import '../../../assets/scss/calendar/icon-calendar.scss';
import {PMAPI,PMENUM} from '../../../lib/postmsg';
import msgBox from '../../../lib/msgbox';
import {HTTP} from "../../../lib/http";
import TreeView from "../../../components/util/tree/tree";
import agGrid from '../../../components/dataGrid/agGrid/agGrid';
import {AutoSelect} from '../../util/autoSelect/autoSelect';
import DateControl from "../../dataGrid/data-table-toolbar/grid-data-control/grid-data-control";

/**
 * 初始化树的数据
 * @param list
 */
function formatTreeData(list) {
    let res = list.map((item) => {
        item.icon = '';
        item.selectedIcon = '';
        item.backColor = "#FFFFFF";
        item.selectable = false;
        item.state = {
            checked: false,
            disabled: false,
            expanded: true,
            selected: false,
        };
        item.tags = ['available'];
        item.nodes = item.children;
        delete item.children;
        if (item.nodes) {
            if (item.nodes.length === 0) {
                delete item.nodes;
            } else {
                item.nodes = formatTreeData(item.nodes);
            }
        }
        return item;
    });
    return res;
}

let config = {
    template: template,
    data: {
        moment : require('moment'),
        weekList: [ '星期日','星期一', '星期二', '星期三', '星期四', '星期五', '星期六' ],
        selectDate:'',
        todayDate:'',
        tableName:'',
        isNewWindow: false,
        editType: false,
        formData: {},
        tableDataDict: [],
        tableDataDict: [],
        ps: {},
        //是否为部门工作日报
        department: 0,
        //部门日报选择的人
        user_id_list:[],
        userData: [],
        departmentData: [],
        choosedDepart: [],
        firstRender: true,
        tabOpen: true,
        columnDefs:[
            {headerName: '相关表名', width: 120,maxWidth:270,field:'table',tooltipField:'table',cellStyle: {'text-align': 'center'}, suppressSorting: false,suppressMenu: true,minWidth: 50},
            {headerName: '摘要', minWidth:800, field:'content',tooltipField:'content', suppressSorting: false,suppressMenu: true,minWidth: 50},
            {headerName: '客户', width: 120,maxWidth:270,field:'kh',tooltipField:'kh',cellStyle: {'text-align': 'center'}, suppressSorting: false,suppressMenu: true,minWidth: 50},
            {headerName: '工时', maxWidth:100,field:'work_time',tooltipField:'work_time',cellStyle: {'text-align': 'center'},editable:true, suppressSorting: false,suppressMenu: true,minWidth: 50},
            {headerName: '操作',maxWidth:80,field:'operation',cellStyle: {'text-align': 'center'}, suppressSorting: true,suppressMenu: true,minWidth: 50,
                cellRenderer:(param)=>{
                    return '<div><a href=javascript:void(0); class="view-report" title="查看">查看</a></div>'
                }
            }
        ],
        columnDefsDepartment:[
            {headerName: '用户', width: 120,maxWidth:270,field:'user',tooltipField:'user',cellRenderer: 'group',cellStyle: {'text-align': 'left','margin-left':'5px'},suppressSorting: false, suppressSorting: false,suppressMenu: true,minWidth: 50},
            {headerName: '备注', width: 120,maxWidth:270,field:'ps',tooltipField:'ps',cellStyle: {'text-align': 'center'}, suppressSorting: false,suppressMenu: true,suppressSorting: false,minWidth: 50},
            {headerName: '相关表名', width: 120,maxWidth:270,field:'table',tooltipField:'table',cellStyle: {'text-align': 'center'},suppressSorting: false, suppressSorting: false,suppressMenu: true,minWidth: 50},
            {headerName: '摘要', minWidth:800, field:'content',tooltipField:'content', suppressSorting: false,suppressMenu: true,suppressSorting: false,minWidth: 50},
            {headerName: '客户', width: 120,maxWidth:270,field:'kh',tooltipField:'kh',cellStyle: {'text-align': 'center'}, suppressSorting: false,suppressMenu: true,suppressSorting: false,minWidth: 50},
            {headerName: '工时', maxWidth:100,field:'work_time',tooltipField:'work_time',cellStyle: {'text-align': 'center'}, suppressSorting: false,suppressMenu: true,suppressSorting: false,minWidth: 50},
            {headerName: '操作',maxWidth:80,field:'operation',cellStyle: {'text-align': 'center'}, suppressSorting: true,suppressMenu: true,minWidth: 50,suppressSorting: false,
                cellRenderer:(param)=>{
                    if(param.data.group){return'';}
                    return '<div><a href=javascript:void(0); class="view-report" title="查看">查看</a></div>'
                }
            }
        ],
        rowData:[],
        selectFilter: [],
    },
    actions: {
        //获取当前日期
        getNowDate: function () {
            let date = this.data.moment().format('YYYY-MM-DD');
            let dateControl = new DateControl({value: '', isAgGrid: true},{changeValue:(data)=>{
                let date = data.value;
                this.data.selectDate = date;
                this.actions.setDate();
            }});
            dateControl.render(this.el.find('.date-control'));
            this.data.selectDate = date;
            this.data.todayDate = date;
            this.actions.setDate();
        },
        setDate: function () {
            if(this.data.selectDate>this.data.todayDate){
                msgBox.showTips('无法选择大于当前日期的时间。');
                this.data.selectDate = this.data.todayDate;
                this.actions.setDate();
                return;
            }
            let date = this.data.selectDate;
            let week = this.data.weekList[this.data.moment(date).day()];
            this.el.find('.ui-calendar')[0].value = date;
            this.el.find('.date-week')[0].innerHTML = '( '+week+' )';
            this.actions.getTodayData();
        },
        toggleEdit: function () {
            this.data.editType = !this.data.editType;
            this.el.find('#edit-report')[0].style.display = this.data.editType?'none':'flex';
            this.el.find('#save-report')[0].style.display = this.data.editType?'flex':'none';
            let obj = {
                columnDefs: this.data.editType?this.data.columnDefsEdit:this.data.columnDefs
            }
            this.agGrid.actions.setGridData(obj);
        },
        //获取当天的数据
        getTodayData: function (refresh) {
            this.showLoading();
            let json = {
                date:this.data.selectDate
            }
            if(this.data.department){
                json['user_id_list'] = JSON.stringify(this.data.user_id_list)
            }
            HTTP.postImmediately({
                url:'/get_data_for_daily/',
                type:"post",
                data:json
            }).then(res=>{
                if(res.success){
                    this.data.tableDict = res.table_mapping;
                    this.data.tableDataDict = res.table_data;
                    this.data.formData = res.form_data || {};
                    this.data.ps = res.ps;
                    this.actions.renderTreeView();
                    this.actions.renderTableData();
                    if(refresh){
                        msgBox.showTips('刷新成功');
                    }
                }else {
                    msgBox.alert(res.error);
                }
                try {this.hideLoading();}catch(e){}
            })
        },
        //渲染左侧列表
        renderTreeView: function () {
            let d = this.data.tableDict;
            let selectData = []
            this.data.selectFilter = [];
            for(let k in d){
                selectData.push({name:k,id:d[k]});
                this.data.selectFilter.push(k);
            }
            this.autoSelect.data.list = selectData;
            this.autoSelect.data.choosed = selectData;
            this.autoSelect.reload();
        },
        //渲染数据
        renderTableData: function () {
            this.data.rowData = [];
            if(!this.data.department){
                for(let k in this.data.tableDataDict){
                    let arr = this.data.tableDataDict[k]
                    for(let a of arr){
                        let obj = a;
                        obj['table'] = k;
                        if(obj['work_time']==undefined){
                            obj['work_time'] = '';
                        }
                        this.data.rowData.push(obj)
                    }
                }
                if(this.data.selectDate<this.data.todayDate){
                    this.el.find('.save-remark')[0].style.display = 'none';
                }else {
                    this.el.find('.save-remark')[0].style.display = 'block';
                }
            }else {
                for(let name in this.data.ps){
                    let dct = {}
                    dct['group'] = name;
                    dct['user'] = name;
                    dct['ps'] = this.data.ps[name];
                    let child = [];
                    for(let k in this.data.tableDataDict){
                        let arr = this.data.tableDataDict[k]
                        for(let a of arr){
                            let obj = a;
                            obj['table'] = k;
                            if(obj['work_time']==undefined){
                                obj['work_time'] = '';
                            }
                            if(obj.user == name){
                                child.push(obj)
                            }
                        }
                    }
                    dct['children'] = child;
                    this.data.rowData.push(dct);
                }
            }
            this.el.find('.remark-content')[0].value = this.data.ps || '';
            let json = {
                rowData: this.data.rowData
            }
            this.agGrid.actions.setGridData(json);
        },
        renderReport: function () {
            //渲染agGrid
            let gridData = {
                columnDefs: this.data.department?this.data.columnDefsDepartment:this.data.columnDefs,
                noFooter: true,
                rowData: this.data.rowData,
                // footerData: this.data.footerData,
                // fieldsData: this.data.fieldsData,
                floatingFilter: false,
                // onColumnResized: this.actions.onColumnResized,
                // onSortChanged: this.actions.onSortChanged,
                // onDragStopped: this.actions.onDragStopped,
                onCellClicked: this.actions.onCellClicked,
                // onRowDoubleClicked: this.actions.onRowDoubleClicked,
                isExternalFilterPresent: this.actions.isExternalFilterPresent,
                doesExternalFilterPass: this.actions.doesExternalFilterPass
            }
            this.agGrid = new agGrid(gridData);
            this.append(this.agGrid , this.el.find('.report-data'));
            this.agGrid.gridOptions.api.sizeColumnsToFit();
            let That = this;
            this.autoSelect = new AutoSelect({
                displayType: 'static',           // popup或者static popup为弹出的形式 static 为静态显示
                selectBoxHeight: '100%',           // select 框的高度
                width: 190,                     // 为0表示显示默认宽度240
                displayChoosed: false,
            }, {
                onSelect: function (param) {
                    That.data.selectFilter = [];
                    for(let d of param){
                        That.data.selectFilter.push(d.name);
                    }
                    try {That.agGrid.gridOptions.api.onFilterChanged();}catch(e){}
                }
            });
            this.autoSelect.render(this.el.find('.sidebar-select'));
        },
        //外部搜索
        isExternalFilterPresent: function () {
            return true;
        },
        doesExternalFilterPass: function ($event) {
            if(this.data.selectFilter.indexOf($event.data.table)!=-1){
                return true;
            }else {
                return false;
            }
        },
        onCellClicked: function ($event) {
            if($event.event.srcElement.className=='view-report'){
                let tableId = this.data.tableDict[$event.data.table];
                let rowId = $event.data._id;
                let arr = [];
                if(this.data.formData[tableId]){
                    let d = this.data.formData[tableId];
                    if(d.static_data){
                        arr.push(d.static_data)
                    }
                    for(let s of d.dynamic_data){
                        if(s.data.real_id.value == rowId){
                            arr.push(s)
                            continue
                        }
                    }
                }
                let obj = {
                    table_id: this.data.tableDict[$event.data.table],
                    real_id: $event.data._id,
                    record_id: '',
                    btnType: 'none',
                    is_view:1,
                    form_id:'',
                    flow_id:'',
                    requestFormData:arr.length==2?1:0,
                };
                let url = this.actions.returnIframeUrl( '/iframe/addWf/',obj );
                let title = '查看';
                this.actions.openSelfIframe( url,title,arr );
            }
        },
        //返回数据url
        returnIframeUrl( u,obj ){
            let str = '?';
            for( let o in obj ){
                str += (o + '=' + obj[o] + '&');
            }
            str = str.substring( 0,str.length - 1 );
            return u + str;
        },
        //打开局部的弹窗
        openSelfIframe: function ( url,title,d ) {
            let w = window.screen.width*0.8;
            let h = window.screen.height*0.6;
            PMAPI.openDialogByIframe( url,{
                width: w || 1400,
                height: h || 800,
                title: title,
                modal:true,
                defaultMax: true,
                // customSize: true
            },d ).then( (data)=>{
                if( data == 'success' || data.refresh ){
                    this.actions.timeDelayRefresh();
                }
            } )
        },
        //保存数据
        saveAllData: function () {
            msgBox.confirm( '确定提交？' ).then((r)=>{
                if(r){
                    msgBox.showLoadingSelf();
                    let data = {};
                    for(let table in this.data.tableDict){
                        data[this.data.tableDict[table]] = [];
                        for(let d of this.data.rowData){
                            if(d.table == table){
                                data[this.data.tableDict[table]].push(d)
                            }
                        }
                    }
                    let obj = {
                        data: JSON.stringify(data),
                        ps: this.el.find('.remark-content')[0].value
                    }
                    HTTP.postImmediately({
                        url:'/save_daily/',
                        type:"post",
                        data:obj
                    }).then(res=>{
                        msgBox.hideLoadingSelf();
                        if(res.success){
                            msgBox.showTips('保存成功');
                        }else {
                            msgBox.alert(res.error);
                        }
                    })
                }
            })
        },
        /**
         * 获取部门数据，并初始化部门树和人员选择组件
         */
        getDepartmentData: function () {
            HTTP.getImmediately('/get_department_tree/', {type: 'ribao'}).then((res) => {
                this.data.userData = res.data.department2user;
                this.data.departmentData = formatTreeData(res.data.department_tree)
                this.actions.initTree();
                this.actions.initChoosedUsers();
            });
        },
        /**
         * 初始化部门树
         */
        initTree: function () {
            let treeView = new TreeView(this.data.departmentData, {
                callback: (order, node) => {
                    this.actions._selectNode(order, node);
                },
                isSearch: true,
                treeType: "MULTI_SELECT",
                treeName: "post-message-depatment-tree",
            });
            let $container = this.el.find(".sidebar-tree");
            treeView.render($container);
        },
        /**
         * 初始化人员选择组件
         */
        initChoosedUsers: function () {
            let That = this;
            this.userSelect = new AutoSelect({
                displayType: 'static',           // popup或者static popup为弹出的形式 static 为静态显示
                selectBoxHeight: '100%',           // select 框的高度
                width: 230,                     // 为0表示显示默认宽度240
                displayChoosed: false,
            }, {
                onSelect: function (param) {
                    this.data.user_id_list = [];
                    for(let u of param){
                        That.data.user_id_list.push(u.id);
                    }
                    if(!That.data.firstRender){
                        That.actions.getTodayData();
                    }
                    That.data.firstRender = false;
                }
            });
            this.userSelect.render(this.el.find('.sidebar-users'));
        },
        /**
         * 内部方法，当树选中时触发此方法，根据选中的部门
         * 显示对应部门的人员
         * @param order
         * @param node
         * @param callback
         * @private
         */
        _selectNode: function (order, node, callback) {
            if (order === 'select') {
                this.data.choosedDepart.push(node.id);
            } else {
                _.remove(this.data.choosedDepart, (item) => {
                    return item === node.id;
                })
            }
            this.actions.renderUsers(this);
        },
        /**
         * 将选中的人员渲染到组件内
         */
        renderUsers: _.debounce(function (context) {
            let hash = {};
            let userData = context.data.userData;
            let choosedDepart = context.data.choosedDepart;
            choosedDepart.forEach((deptId) => {
                if (userData[deptId]) {
                    for (let userId in userData[deptId]) {
                        hash[userId] = userData[deptId][userId];
                    }
                }
            });
            let users = [];
            for (let userId in hash) {
                users.push({
                    id: userId,
                    name: hash[userId]['name'],
                    py: hash[userId]['username']
                });
            }
            this.userSelect.data.list = users;
            this.userSelect.data.choosed = users;
            this.userSelect.reload();
        }, 500),
        //开关右侧tab
        calcUserCon: function () {
            this.showLoading();
            this.data.tabOpen = !this.data.tabOpen;
            let left = this.data.department?'-590px':'-190px';
            let width = this.data.department?'calc(100% - 620px)':'calc(100% - 220px)';
            setTimeout( ()=>{
                this.el.find( '.report-sidebar' ).eq(0).animate( { 'left':this.data.tabOpen ? '0px' : left } );
                this.el.find( '.calc-sidebar' )[0].className = this.data.tabOpen ? 'calc-sidebar icon-aggrid-shouhui':'calc-sidebar icon-aggrid-quxiao';
            },this.data.tabOpen ? 0 : 0 )
            setTimeout( ()=>{
                this.el.find( '.report-main' )[0].style.width = this.data.tabOpen ? width:' calc(100% - 30px)';
            },this.data.tabOpen ? 0 : 0 )
            setTimeout(()=>{
                this.hideLoading();
            },400)
        }
    },
    binds: [
        {
            event: 'click',
            selector: '#open-new-window',
            callback: function () {
                window.open(this.data.href);
            }
        },
        {
            event: 'click',
            selector: '.pre-date',
            callback: function () {
                this.data.selectDate = this.data.moment(this.data.selectDate).add(-1,'days').format('YYYY-MM-DD');
                this.actions.setDate();
            }
        },
        {
            event: 'click',
            selector: '.next-date',
            callback: function () {
                this.data.selectDate = this.data.moment(this.data.selectDate).add(1,'days').format('YYYY-MM-DD');
                this.actions.setDate();
            }
        },
        {
            event: 'click',
            selector: '#edit-report',
            callback: function () {
                this.actions.toggleEdit();
            }
        },
        {
            event: 'click',
            selector: '#refresh',
            callback: function () {
                this.actions.getTodayData(true);
            }
        },
        {
            event: 'click',
            selector: '#save-report',
            callback: function () {
                this.actions.toggleEdit();
            }
        },
        {
            event: 'click',
            selector: '.save-remark',
            callback: function () {
                this.actions.saveAllData();
            }
        },
        {
            event: 'click',
            selector: '.calc-sidebar',
            callback: function () {
                this.actions.calcUserCon();
            }
        },
    ],
    afterRender: function (){
        if(this.data.department){
            this.el.find('.report-content')[0].className = 'report-content department';
            this.actions.getDepartmentData();
        }
        this.actions.renderReport();
        this.actions.getNowDate();
        //新窗口
        if(!this.data.isNewWindow){
            this.data.href = window.location.pathname + window.location.search+'&isNewWindow=true';
            this.el.find('#open-new-window')[0].style.display = 'flex';
        }
        let That = this;
        this.el.on('input','.search-box',_.debounce(($event)=>{
            That.agGrid.gridOptions.api.setQuickFilter($event.target.value)
        },1000))
    }
}

class workReport extends Component {
    constructor(data,newConfig){
        for (let d in data) {
            config.data[d] = data[d];
        }
        super($.extend(true,{},config,newConfig,{data:data||{}}));
    }
}

export default workReport;