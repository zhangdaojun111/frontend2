import Component from "../../../lib/component";
import template from './workflow-page.html';
import './workflow-page.scss';
import {HTTP} from "../../../lib/http";
import msgBox from '../../../lib/msgbox';
import {PMAPI,PMENUM} from '../../../lib/postmsg';
import agGrid from '../../../components/dataGrid/agGrid/agGrid';
import {wchService} from '../../../services/dataGrid/workflow-config-header.service';
import {dataTableService} from '../../../services/dataGrid/data-table.service';
import {dgcService} from "../../../services/dataGrid/data-table-control.service";
import {workflowService} from "../../../services/workflow/workflow.service";
import dataPagination from "../../dataGrid/data-table-toolbar/data-pagination/data-pagination";
import FloatingFilter from "../../dataGrid/data-table-toolbar/floating-filter/floating-filter";
import customColumns from "../../dataGrid/data-table-toolbar/custom-columns/custom-columns";

let config = {
    template: template,
    data: {
        tableId: '',
        columnDefs: [],
        rowData:[],
        rows: 100,
        total: 0,
        pageNum: 1,
        //pageType{0:'进展中的工作',1:'已完成的工作',2:'我的工作申请中的工作',3:'我的工作已完成的工作',4:'我的工作审批过的工作',5:'工作审批',6:'我的工作已关注的工作'}
        pageType: 5,
        tableId2pageType: {'approve-workflow':5,'approving-workflow':0,'finished-workflow':1,'my-workflow':2,'finish-workflow':3,'focus-workflow':6,'approved-workflow':4},
        //定制列（列宽）
        colWidth: {},
        //定制列（固定列）
        fixCols: {l: [], r: []},
        //定制列（列排序）
        orderFields: [],
        //定制列（隐藏列）
        ignoreFields: [],
        //是否第一次渲染agGrid
        firstRender: true,
        //可以搜索的数据
        iCanSearch: {},
        //floatingFilter搜索参数
        searchValue: [],
        //floatingFilter搜索参数
        searchOldValue: [],
        //选择的数据
        selectRows: [],
        //定制列数据
        customColumnsFields: [{name:'序号',field:'number',canhide:false,candrag:false,canFix:false}, {name:'选择',field:'mySelectAll',canhide:false,candrag:false,canFix:false}, {name:'操作',field:'myOperate',canhide:true,candrag:true,canFix:true}]
    },
    actions: {
        //创建表头
        createColumnDefs: function () {
            this.data.pageType = this.data.tableId2pageType[this.data.tableId];
            let cols = wchService.getWorkflowHeader( this.data.pageType );
            this.data.columnDefs = [dgcService.numberCol,dgcService.selectCol];
            let fixArr = this.data.fixCols.l.concat(this.data.fixCols.r);
            for( let col of cols ){
                if( col.field == 'myOperate' ){
                    col['suppressFilter'] = true;
                    this.data.columnDefs.push( col );
                    continue;
                }
                let s = this.actions.searchType(col["field"]);
                let obj = {
                    headerName: col.headerName,
                    field: col["field"],
                    enableCellChangeFlash: true,
                    suppressMenu: true,
                    suppressToolPanel: true,
                    // suppressMovable: fixArr.indexOf(data.data["field"]) == -1 ? false : true,
                    colId: col["field"],
                    tooltipField: col["field"],
                    sortingOrder: ['desc', 'asc', null],
                    hide: false,
                    minWidth: 20,
                    cellStyle: {'font-style': 'normal'},
                    floatingFilterComponent: this.floatingFilterCom.actions.createFilter(s.type , s.field, this.data.searchValue, this.data.searchOldValue),
                    floatingFilterComponentParams: {suppressFilterButton: true},
                    enableRowGroup: true,
                    suppressSorting: s.type == 'none'?true : false,
                    suppressResize: false,
                    suppressMovable: false
                }
                //定制列数据
                this.data.customColumnsFields.push( {name:col.headerName,field:col["field"],canhide:true,candrag:true,canFix:true} );
                this.data.columnDefs.push( obj );
            }
        },
        //返回搜索类型
        searchType: function ( data ) {
            let type = 'none';
            if( this.data.iCanSearch[data] ){
                type = 'text';
            }
            return {type:type,field:this.data.iCanSearch[data] || data};
        },
        //渲染
        renderGrid: function () {
            let gridData = {
                columnDefs: this.data.columnDefs,
                rowData: this.data.rowData,
                floatingFilter: true,
                onColumnResized: this.actions.onColumnResized,
                onSortChanged: this.actions.onSortChanged,
                onDragStopped: this.actions.onDragStopped,
                onCellClicked: this.actions.onCellClicked,
                onRowDoubleClicked: this.actions.onRowDoubleClicked
            }
            this.agGrid = new agGrid(gridData);
            this.append(this.agGrid , this.el.find('#workflow-agGrid'));
            this.actions.calcColumnState();
            //渲染分页
            let paginationData = {
                total: this.data.total,
                rows: this.data.rows,
                tableId: this.data.tableId
            }
            //渲染分页
            this.pagination = new dataPagination(paginationData);
            this.pagination.actions.paginationChanged = this.actions.refreshData;
            this.append(this.pagination, this.el.find('.pagination'));

            let custom = {
                gridoptions: this.agGrid.gridOptions,
                fields: this.data.customColumnsFields,
                fixCols: this.data.fixCols,
                tableId: this.data.tableId,
                agGrid: this.agGrid
            }
            //渲染定制列
            if( $('.custom-column-btn')[0] ){
                this.customColumnsCom  = new customColumns(custom);
                this.append(this.customColumnsCom, this.el.find('.custom-columns-panel'));
            }
        },
        //返回选择数据
        retureSelectData: function () {
            this.data.selectRows = [];
            let rows = this.agGrid.gridOptions.api.getSelectedRows();
            for( let r of rows ){
                if( r._id ){
                    this.data.selectRows.push( r._id );
                }
            }
        },
        //分页刷新
        refreshData: function () {

        },
        //渲染按钮
        renderBtn: function () {
            if( this.data.tableId == 'my-workflow' ){
                this.el.find( '.batch-cancel' )[0].style.display = 'inline-block';
                this.el.find( '.batch-cancel' ).on( 'click',()=>{

                } );
            }
            //floatingFilter
            let floatSearch = this.el.find( '.float-search-btn' );
            if( floatSearch[0] ){
                floatSearch.on( 'click',()=>{
                    let height = this.data.isShowFloatingFilter ? 0:30;
                    this.agGrid.gridOptions.api.setFloatingFiltersHeight(height);
                    this.data.isShowFloatingFilter = !this.data.isShowFloatingFilter;
                } )
            }
            //定制列
            let customCol = this.el.find( '.custom-column-btn' )
            if( customCol[0] ){
                customCol.on( 'click',()=>{
                    this.el.find( '.custom-columns-panel' )[0].style.display = this.data.isShowCustomPanel?'none':'block';
                    this.data.isShowCustomPanel = !this.data.isShowCustomPanel;
                    let num = 0;
                    if( this.data.isShowCustomPanel ){
                        num+=200;
                    }
                    let grid = this.el.find( '#workflow-agGrid' )
                    grid.width( 'calc(100% - ' + num + 'px)' );
                } )
            }
            //全屏
            if( this.el.find( '.grid-new-window' )[0] ){
                let obj = {
                    tableId:this.data.tableId
                }
                let url = this.actions.returnIframeUrl( '/iframe/workflowPage/',obj )
                this.el.find('.grid-new-window').attr('href', url);
            }
            //高级查询
            debugger
            if( this.el.find( '.expert-search-btn' )[0] ){
                debugger
                this.actions.renderExpertSearch();
            }
        },
        //渲染高级查询
        renderExpertSearch: function () {
            this.el.find( '.dataGrid-commonQuery' )[0].style.display = 'block';
            this.el.find( '.expert-search-btn' ).on( 'click',()=>{
                let d = {
                    tableId: this.data.tableId,
                    fieldsData: this.data.expertSearchFields,
                    commonQuery: this.data.commonQueryData,
                    commonQuerySelectLength:this.el.find('.dataGrid-commonQuery-select option').length
                    // getExpertSearchData:this.actions.getExpertSearchData,
                    // postExpertSearch:this.actions.postExpertSearch,
                    // saveTemporaryCommonQuery:this.actions.saveTemporaryCommonQuery
                }
                debugger
                PMAPI.openDialogByIframe(`/iframe/expertSearch/`,{
                    width:950,
                    height:600,
                    title:`高级查询`,
                    modal:true
                },{d}).then(res=>{
                    if(res.type == 'temporaryQuery') {
                        if(res.addNameAry.length != 0){
                            this.actions.getExpertSearchData(res.addNameAry);
                        } else {
                            this.actions.postExpertSearch(res.value,res.id,res.name);
                        }
                        this.el.find('.dataGrid-commonQuery-select').val(res.name);
                    } if(res.appendChecked) {
                        this.data.temporaryCommonQuery = res.value
                        this.actions.appendQuerySelect()
                    } if(res.saveCommonQuery || res.onlyclose == true) {
                        this.actions.getExpertSearchData(res.addNameAry)
                    }
                })
            } )
            let _this = this
            $('.dataGrid-commonQuery-select').bind('change', function() {
                if($(this).val() == '常用查询') {
                    _this.actions.postExpertSearch([],'');
                } else if($(this).val() == '临时高级查询') {
                    _this.actions.postExpertSearch(_this.data.temporaryCommonQuery,'临时高级查询','临时高级查询');
                } else {
                    // $(this).find('.Temporary').remove();
                    _this.data.commonQueryData.forEach((item) => {
                        if(item.name == $(this).val()){
                            _this.actions.postExpertSearch(JSON.parse(item.queryParams),item.id,item.name);
                        }
                    })
                }
            })
            this.actions.getExpertSearchData();
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
        //获取数据
        getData: function () {
            let json = this.actions.createPostData();
            let obj1 = {
                actions: JSON.stringify(['ignoreFields', 'fieldsOrder', 'pageSize', 'colWidth', 'pinned']),
                table_id: this.data.tableId
            }
            let gridData = dataTableService.getWorkflowData( json );
            let preferenceData = dataTableService.getPreferences(obj1);
            let arr = [gridData];
            if( this.data.firstRender ){
                arr = [gridData,preferenceData];
            }
            Promise.all(arr).then((res)=> {
                this.data.rowData = res[0].rows;
                this.data.total = res[0].total;
                if( this.data.firstRender ){
                    this.data.iCanSearch = res[0].field_mapping;
                    this.actions.renderBtn();
                    this.actions.createColumnDefs();
                    this.actions.setPreference( res[1] );
                    this.actions.renderGrid();
                }
            });
            HTTP.flush();
        },
        //创建请求数据参数
        createPostData: function () {
            let json = {
                type:this.data.pageType,rows:this.data.rows,page:this.data.pageNum
            }
            return json;
        },
        //偏好赋值
        setPreference: function (res) {
            if (res['colWidth']) {
                this.data.colWidth = res['colWidth'].colWidth;
                if (typeof ( this.data.colWidth ) == 'string') {
                    this.data.colWidth = JSON.parse(res['colWidth'].colWidth);
                }
            }
            if (res['pageSize'] && res['pageSize'].pageSize) {
                this.data.rows = res['pageSize'].pageSize;
            }
            if (res['ignoreFields']) {
                this.data.ignoreFields = JSON.parse(res['ignoreFields']['ignoreFields']);
            } else {
                // this.data.hideColumn = ['f1','f2','f3','f4']
                // let json = {
                //     action:'ignoreFields',
                //     table_id:this.pageId,
                //     ignoreFields:JSON.stringify( this.hideColumn ),
                // }
                // this.dataTableService.savePreference( json );
            }
            if (res['fieldsOrder']) {
                this.data.orderFields = JSON.parse(res['fieldsOrder']['fieldsOrder']);
            }
            if (res['pinned'] && res['pinned']['pinned']) {
                this.data.fixCols = JSON.parse(res['pinned']['pinned']);
            }
            // console.log("rows")
            // console.log(this.data.rows)
            // console.log("colWidth")
            // console.log(this.data.colWidth)
            // console.log("ignoreFields")
            // console.log(this.data.ignoreFields)
            // console.log("fixCols")
            // console.log(this.data.fixCols)
            // console.log("orderFields")
            // console.log(this.data.orderFields)
        },
        //根据偏好返回agGrid sate
        calcColumnState: function () {
            let gridState = this.agGrid.gridOptions.columnApi.getColumnState();
            let indexedGridState = {};
            for(let state of gridState) {
                indexedGridState[state['colId']] = state;
            }
            let numState = indexedGridState['number']||{};
            numState['pinned']= this.data.fixCols.l.length > 0 ? 'left' : null;
            let selectState = indexedGridState['mySelectAll']||{};
            selectState['pinned']= this.data.fixCols.l.length > 0 ? 'left' : null;
            //默认分组、序号、选择在前三个
            let arr = [ numState , selectState ];
            //左侧固定
            for( let col of this.data.fixCols.l ){
                let state = indexedGridState[col]||{};
                state['hide'] = this.data.ignoreFields.indexOf( col ) != -1;
                state['pinned'] = 'left';
                arr.push(state);
            }
            //中间不固定
            let fixArr = this.data.fixCols.l.concat( this.data.fixCols.r );
            for( let data of this.data.orderFields ){
                if( data == '_id'||data == 'group' ){
                    continue;
                }
                if( data != 0 && fixArr.indexOf( data ) == -1 ){
                    let state = indexedGridState[data]||{};
                    state['hide'] = this.data.ignoreFields.indexOf( data ) != -1;
                    state['pinned'] = null;
                    arr.push(state);
                }
            }
            if(this.data.orderFields.length == 0){
                for(let state of gridState){
                    let id = state['colId'];
                    if(id != 'number' && id != 'mySelectAll' && id != 'group'){
                        state['hide'] = this.data.ignoreFields.indexOf(id)!=-1;
                        state['pinned'] = null;
                        arr.push(state);
                    }
                }
            }
            //右侧固定
            for( let col of this.data.fixCols.r ){
                let state = indexedGridState[col]||{};
                state['hide'] = this.data.ignoreFields.indexOf( col ) != -1;
                state['pinned'] = 'right';
                arr.push(state);
            }
            //操作列宽度
            for( let d of arr ){
                if( d.colId && d.colId == 'myOperate' ){
                    d['width'] = this.data.operateColWidth;
                }
            }
            //初始化状态
            this.agGrid.gridOptions.columnApi.setColumnState( arr );
        },
        //floatingFilter
        floatingFilterPostData: function (col_field, keyWord, searchOperate) {

        },
        onColumnResized: function ($event) {
            this.customColumnsCom.actions.onColumnResized( this.customColumnsCom );
        },
        onDragStopped: function ($event) {
            this.customColumnsCom.actions.onFix();
            this.customColumnsCom.actions.dragAction();
        },
        onSortChanged: function ($event) {
            
        },
        onRowDoubleClicked: function ($event) {
        },
        onCellClicked: function ($event) {
            let type = $event["event"]["target"]["dataset"]["type"];
            let obj = {
                form_id: $event["data"]["form_id"],
                record_id: $event["data"]["id"],
                flow_id: $event["data"]["flow_id"],
                table_id: $event["data"]["table_id"]
            }
            let winTitle = '';
            if( this.data.pageType == 0 || this.data.pageType == 1 ){
                if(type === 'view'){
                    winTitle = '查看工作';
                    obj['btnType'] = 'view';
                    let url = dgcService.returnIframeUrl( '/wf/approval/',obj );
                    this.actions.openSourceDataGrid( url,winTitle );
                }else if( type === 'cancel'){
                    this.actions.approveWorkflow( $event["data"]["id"],4,'确定取消？' )
                }
            }
            if( this.data.pageType == 2||this.data.pageType == 3||this.data.pageType == 4||this.data.pageType == 6 ){
                if(type === 'view'){
                    winTitle = '查看工作';
                    obj['btnType'] = 'view';
                    let url = dgcService.returnIframeUrl( '/wf/approval/',obj );
                    this.actions.openSourceDataGrid( url,winTitle );
                }else if(type === 'cancel'){
                    this.actions.approveWorkflow( $event["data"]["id"],4,'确定取消？' )
                }else if(type === 'withdraw'){
                    this.actions.approveWorkflow( $event["data"]["id"],5,'确定撤回？' )
                }else if(type === 'edit'){
                    winTitle = '编辑工作';
                    obj['btnType'] = 'edit';
                    let url = dgcService.returnIframeUrl( '/wf/approval/',obj );
                    this.actions.openSourceDataGrid( url,winTitle );
                }else if(type === 'drawApproval'){
                    this.actions.approveWorkflow( $event["data"]["id"],7,'确定撤回？' )
                }else if( type === 'focusWorkflow' ){
                    winTitle = '查看工作';
                    obj['btnType'] = 'view';
                    let url = dgcService.returnIframeUrl( '/wf/approval/',obj );
                    this.actions.openSourceDataGrid( url,winTitle );
                }
            }
            if( this.data.pageType == 5 ){
                if(type === 'approve'){
                    winTitle = '审批工作';
                    obj['btnType'] = 'edit';
                }else if(type === 'view'){
                    winTitle = '查看工作';
                    obj['btnType'] = 'view';
                }else{
                    return false;
                }
                let url = dgcService.returnIframeUrl( '/wf/approval/',obj );
                this.actions.openSourceDataGrid( url,winTitle );
            }
        },
        //打开穿透数据弹窗
        openSourceDataGrid: function ( url,title ) {
            PMAPI.openDialogByIframe( url,{
                width: 1300,
                height: 800,
                title: title,
                modal:true
            } ).then( (data)=>{
            } )
        },
        //操作工作流
        approveWorkflow: function (id,action,mes) {
            msgBox.confirm( mes ).then((res)=>{
                if(res===true){
                    let json = {
                        record_id: id,
                        action: action
                    };
                    workflowService.approve( json )
                        .then(res => {
                            if( res.success ){
                                msgBox.showTips( '取消成功' );
                            }else {
                                msgBox.alert( '取消失败：' + res.error );
                            }
                        })
                }
            })
        }
    },
    afterRender: function (){
        this.floatingFilterCom = new FloatingFilter();
        this.floatingFilterCom.actions.floatingFilterPostData = this.actions.floatingFilterPostData;
        this.actions.getData();
    }
}

class workflowPage extends Component {
    constructor(data) {
        for( let d in data ){
            config.data[d] = data[d];
        }
        super(config);
    }
}

export default workflowPage;