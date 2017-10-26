/**
 * @author yangxiaochuan
 * 人员信息定制表
 */

import Component from "../../../lib/component";
import template from './personnel.html';
import './personnel.scss';
import {HTTP} from "../../../lib/http";
import msgBox from '../../../lib/msgbox';
import {PMAPI,PMENUM} from '../../../lib/postmsg';

import agGrid from '../../../components/dataGrid/agGrid/agGrid';
import {dataTableService} from '../../../services/dataGrid/data-table.service';
import {dgcService} from "../../../services/dataGrid/data-table-control.service";
import exportSetting from '../../dataGrid/data-table-toolbar/data-table-export/data-table-export';
import customColumns from "../../dataGrid/data-table-toolbar/custom-columns/custom-columns";
import dataPagination from "../../dataGrid/data-table-toolbar/data-pagination/data-pagination";
import FloatingFilter from "../../dataGrid/data-table-toolbar/floating-filter/floating-filter";
import {fieldTypeService} from "../../../services/dataGrid/field-type-service";
import {TabService} from "../../../services/main/tabService";
import TreeView from "../../../components/util/tree/tree";

let config = {
    template: template,
    data: {
        tableId:'',
        tableName:'',
        columnDefs: [],
        rowData:[],
        footerData:[],
        fieldsData:[],
        //数据总数
        total: 0,
        //展示的数据行数
        rows: 100,
        //第一条数据位置
        first: 0,
        //当前页数
        page: 1,
        //定制列（列宽）
        colWidth: {},
        //定制列（固定列）
        fixCols: {l: [], r: []},
        //定制列（列排序）
        orderFields: [],
        //定制列（隐藏列）
        ignoreFields: [],
        //定制列需要字段信息
        customColumnsFields: [],
        onlyCloseExpertSearch:false,
        isShowCustomPanel: false,
        //高级查询字段数据
        expertSearchFields: [],
        //搜索参数
        filterParam: {expertFilter:[], filter: [], is_filter: 0, common_filter_id: '', common_filter_name: ''},
        //floatingFilter搜索参数
        searchValue: [],
        //floatingFilter搜索参数
        searchOldValue: [],
        //floatingFilter搜索参数
        queryList: {},
        //搜索参数(判断是否需要重置分页)
        filterText: '',
        //请求数据参数
        commonQueryData:[],
        //临时查询数据
        temporaryCommonQuery:[],
        //部门名称
        departmentName: '',
        //用户状态
        userStatus: '',
        //是否显示全部
        isShowLeave: true,
        //第一次加载
        firstRender: true,
        //部门树数据
        department_tree: [],
        //是否显示floatingfilter
        isShowFloatingFilter: false,
        //排序参数
        sortParam: {sortOrder:'',sortField:'',sort_real_type:''},
        //排序方式
        frontendSort: false,
        //宽度自适应
        isAutoWidth: false,
        //上次的状态
        lastGridState: [],
        //查看某人权限的部门名称
        permDeparmentName:'',
        // //部门field
        // departmentField: '',
        // //用户id
        // userId:'',
        userPerm:{
            id:'',
            department:'',
            options:[],
            value:[]
        },
        field_mapping: {},
        filter_mapping: {is_active:{'是':1,'否':0},is_superuser:{'是':1,'否':0},status:{'离职':0,'在职':1,'实习':2,'试用':3,'管理员':4,'病休':5}},
        specialFilter:{},
        //第一次设置数据
        firstSetData: true,
        //是否为新窗口
        isNewWindow: false
    },
    actions: {
        //获取表头数据
        getHeaderData: function () {
            let obj1 = {
                actions: JSON.stringify(['ignoreFields', 'group', 'fieldsOrder', 'pageSize', 'colWidth', 'pinned']),
                table_id: this.data.tableId
            }
            let obj2 = {
                table_id: this.data.tableId
            }
            let preferenceData = dataTableService.getPreferences(obj1);
            let headerData = dataTableService.getColumnList(obj2);

            Promise.all([preferenceData, headerData]).then((res)=> {
                dgcService.setPreference( res[0],this.data );
                let oprate = {headerName: '操作',field: 'myOperate', width: 160,suppressFilter: true,suppressSorting: true,suppressResize: true,suppressMenu: true, cellRenderer: (param)=>{
                    return '<div style="text-align:center;"><a class="ui-link" id="view">查看</a> | <a class="ui-link" id="edit">编辑</a> | <a class="ui-link" id="jurisdiction">权限</a><div>';
                }}
                //添加序号列
                let number = dgcService.numberCol;
                number['headerCellTemplate'] = this.actions.resetPreference();
                this.data.columnDefs.unshift(number);
                this.data.columnDefs = [
                    dgcService.numberCol,
                    dgcService.selectCol,
                    oprate
                ];
                this.data.fieldsData = res[1].rows;
                for( let col of res[1].rows ){
                    if( col.field == '_id' ){
                        continue;
                    }
                    let filterType = fieldTypeService.searchType(col["real_type"]);
                    if( this.data.specialFilter[col["field"]] ){
                        filterType = 'person';
                    }
                    let minWidth = {
                        datetime: 160,
                        time: 90,
                        date: 110
                    }
                    let obj = {
                        headerName: col.name,
                        field: col["field"],
                        enableCellChangeFlash: true,
                        suppressMenu: true,
                        suppressToolPanel: true,
                        colId: col["field"],
                        tooltipField: col["field"],
                        sortingOrder: ['desc', 'asc', null],
                        width: col.width,
                        hide: false,
                        minWidth: minWidth[fieldTypeService.searchType(col["real_type"])] || 20,
                        width: col.width,
                        cellStyle: {'font-style': 'normal'},
                        enableRowGroup: true,
                        suppressSorting: false,
                        suppressResize: false,
                        suppressMovable: false,
                        suppressFilter: false,
                        floatingFilterComponent: this.floatingFilterCom.actions.createFilter(filterType, col["field"], this.data.searchValue, this.data.searchOldValue),
                        floatingFilterComponentParams: {suppressFilterButton: true},
                    }
                    this.data.columnDefs.push( obj );
                }
                let need = dgcService.createNeedFields( res[1].rows );
                this.data.expertSearchFields = need.search;
                for( let d of this.data.expertSearchFields ){
                    if( this.data.specialFilter[d.searchField] ){
                        d.searchType = 'person';
                    }
                }
                //定制列需要字段数据
                this.data.customColumnsFields = need.custom;
                this.actions.renderAgGrid();
            })
            HTTP.flush();
        },
        //渲染agGrid
        renderAgGrid: function () {
            let gridData = {
                columnDefs: this.data.columnDefs,
                noFooter: true,
                rowData: this.data.rowData,
                footerData: this.data.footerData,
                fieldsData: this.data.fieldsData,
                floatingFilter: true,
                onColumnResized: this.actions.onColumnResized,
                onSortChanged: this.actions.onSortChanged,
                onDragStopped: this.actions.onDragStopped,
                onCellClicked: this.actions.onCellClicked,
                onRowDoubleClicked: this.actions.onRowDoubleClicked,
                onRowSelected: this.actions.onRowSelected
            }
            this.agGrid = new agGrid(gridData);
            this.append(this.agGrid , this.el.find('#data-agGrid'));
            //渲染定制列
            if( this.el.find('.custom-column-btn')[0] ){
                //如果有定制列修改偏好状态
                dgcService.calcColumnState(this.data,this.agGrid,["number","mySelectAll"]);
                let custom = {
                    gridoptions: this.agGrid.gridOptions,
                    fields: this.data.customColumnsFields,
                    fixCols: this.data.fixCols,
                    tableId: this.data.tableId,
                    agGrid: this.agGrid,
                    close: this.actions.calcCustomColumn,
                    setFloatingFilterInput: this.actions.setFloatingFilterInput
                }
                this.customColumnsCom  = new customColumns(custom);
                this.append(this.customColumnsCom, this.el.find('.custom-columns-panel'));

                //点击关掉定制列panel
                this.el.find( '.ag-body' ).on( 'click',()=>{
                    setTimeout( ()=>{
                        this.el.find( '.custom-columns-panel' ).eq(0).animate( { 'right':'-200px' } );
                    },400 )
                    this.data.isShowCustomPanel = false;
                    this.actions.changeAgGridWidth(true);
                } )

                let paginationData = {
                    total: this.data.total,
                    rows: this.data.rows,
                    tableId: this.data.tableId
                }
                this.pagination = new dataPagination(paginationData);
                this.pagination.actions.paginationChanged = this.actions.refreshData;
                this.append(this.pagination, this.el.find('.pagination'));
            }
            this.actions.btnClick();
            this.actions.getUserData();
        },
        //设置特殊字段filter
        setEspecialFilter: function (filter) {
            let newFilter = [];
            for( let f of filter ){
                if( this.data.specialFilter[f.cond.searchBy] ){
                    let obj = this.data.specialFilter[f.cond.searchBy]
                    let keyword = f.cond.keyword;
                    for( let k in obj ){
                        if( k.indexOf( keyword )!=-1 ){
                            f.cond.keyword = obj[k];
                            if( f.cond.operate == '$regex' ){
                                f.cond.operate = 'exact';
                            }
                        }
                    }
                }
            }
        },
        resetPreference: function () {
            let ediv = document.createElement('div');
            let eHeader = document.createElement('span');
            let eImg = document.createElement('i');
            eImg.title = '重置筛选';
            eImg.className = 'icon-aggrid icon-aggrid-cancel resetFloatingFilter';
            eImg.addEventListener( 'click',()=>{
                msgBox.confirm( '确定清空筛选数据？' ).then( r=>{
                    if( r ){
                        for( let k in this.data.searchValue ){
                            this.data.searchValue[k] = '';
                        }
                        for( let k in this.data.searchOldValue ){
                            this.data.searchOldValue[k] = '';
                        }
                        this.data.queryList = {};
                        this.actions.setFloatingFilterInput();
                        this.data.filterParam.filter = [];
                        this.actions.getUserData();
                    }
                } )
            } )
            ediv.appendChild( eHeader )
            eHeader.innerHTML = "初";
            eHeader.className = "table-init-logo";
            eHeader.title = '初始化偏好'
            eHeader.addEventListener('click', () => {
                msgBox.confirm( '确定初始化偏好？' ).then( r=>{
                    if( r ){
                        dataTableService.delPreference( {table_id: this.data.tableId} ).then( res=>{
                            msgBox.showTips( '操作成功' );
                            let obj = {
                                actions: JSON.stringify(['ignoreFields', 'group', 'fieldsOrder', 'pageSize', 'colWidth', 'pinned']),
                                table_id: this.data.tableId
                            };
                            dataTableService.getPreferences( obj ).then( res=>{
                                dgcService.setPreference( res,this.data );
                                //创建表头
                                this.agGrid.gridOptions.api.setColumnDefs( this.data.columnDefs );
                                dgcService.calcColumnState(this.data,this.agGrid,["number","mySelectAll"]);
                                this.customColumnsCom.actions.makeSameSate();
                            } );
                            HTTP.flush();
                        } );
                        HTTP.flush();
                    }
                } )
            });
            ediv.appendChild( eImg )
            return ediv;
        },
        //设置搜索input值
        setFloatingFilterInput: function () {
            for( let k in this.data.searchValue ){
                this.el.find( '.filter-input-'+k )[0].value = this.data.searchValue[k];
            }
        },
        //获取数据
        getUserData: function (refresh) {
            let json = {
                department: this.data.departmentName,
                filter: [],
                rows: this.data.rows,
                page: this.data.page
            }
            this.actions.setEspecialFilter(this.data.filterParam.filter);
            this.actions.setEspecialFilter(this.data.filterParam.expertFilter);
            if( this.data.filterParam.filter && this.data.filterParam.filter.length != 0 ){
                json['filter'] = _.cloneDeep(this.data.filterParam.filter ) || []
            }
            if( this.data.filterParam['common_filter_id'] ){
                json['filter'] = json['filter'] || [];
                //这个顺序要保证是先高级查询，再搜索的
                let len = this.data.filterParam.expertFilter.length - 1;
                for(let i = len; i>=0; i--){
                    json['filter'].unshift(this.data.filterParam.expertFilter[i]);
                }
                // for( let a of this.data.filterParam.expertFilter ){
                //     json['filter'].push( a );
                // }
                if( this.data.filterParam['common_filter_id'] != '临时高级查询' ){
                    json['common_filter_id'] = this.data.filterParam['common_filter_id'] || '';
                }
                if( this.data.filterParam.filter.length == 0 ){
                    let dom = `<div class='query-tips'><span class="query-tips-delete"></span><span class="title">加载常用查询&lt;<span class="text">${this.data.filterParam['common_filter_name']}</span>&gt;</span></div>`;
                    this.el.find('.btn-nav').append(dom);
                    setTimeout(()=>{
                        this.el.find('.query-tips').css('display','none');
                    },5000)
                    this.el.find('.query-tips-delete').on('click', ()=> {
                        this.el.find('.query-tips').css('display','none');
                    })
                    // msgBox.alert( '加载常用查询<'+this.data.filterParam['common_filter_name']+'>' );
                }
            }
            if( this.data.isShowLeave && this.data.userStatus != '' ){
                json.filter.push(
                    {
                        "relation": "$and",
                        "cond": {
                            "leftBracket": 0,
                            "searchBy": this.data.userStatus,
                            "operate": "$ne",
                            "keyword": 0,
                            "rightBracket": 0
                        }
                    }
                )
            }
            //排序
            if( this.data.sortParam.sortField ){
                json = _.defaultsDeep( json,this.data.sortParam )
            }
            json = dgcService.returnQueryParams( json );
            if( json.filter && json.filter != '' ){
                if( this.data.filterText != json.filter ){
                    this.data.first = 0;
                    json.page = 1;
                    this.data.page = 1;
                    this.data.filterText = json.filter;
                }
            }
            dataTableService.getUserData( json ).then( res=>{
                if( this.data.firstRender ){
                    this.data.department_tree = res.department_tree;
                    this.actions.createDepartment();
                    this.data.firstRender = false;
                }
                this.data.total = res.total;
                this.data.rowData = res.rows;
                this.actions.sortWay();
                let obj = {
                    rowData: this.data.rowData
                }
                this.agGrid.actions.setGridData( obj );
                let currentPage = parseInt( Number( this.data.first )/Number( this.data.rows ) );
                this.pagination.actions.setPagination( this.data.total,this.data.page );
                //第一次关闭loading
                if( this.data.firstSetData ){
                    this.hideLoading();
                    this.data.firstSetData = false;
                }
                if(refresh){
                    msgBox.showTips( '数据刷新成功。' )
                }
            } )
            HTTP.flush();
        },
        //刷新数据
        refreshData: function (res) {
            this.data.rows = res.rows;
            this.data.page = res.currentPage;
            this.data.first = res.first;
            this.actions.getUserData(true);
        },
        //创建部门树
        createDepartment: function () {
            this.actions.departmentTreeFun(this.data.department_tree);
            let treeView = new TreeView(this.data.department_tree,{
                callback:(event,node) => {
                    if( node.id ){
                        this.data.departmentName = node.name;
                        this.actions.getUserData();
                    }
                },
                treeType:"SINGLE_SELECT",
                selectParentMode:'Select',
                isSearch: true,
                treeName:"department-tree"
            });
            treeView.render(this.el.find( '.choose-department-tree' ));
        },
        departmentTreeFun:function (tree) {
            for( let t of tree ){
                if( t.group ){
                    t['nodes'] = t.children;
                    t['text'] = t.name;
                    this.actions.departmentTreeFun( t['nodes'] )
                }else {
                    t['text'] = t.name;
                }
            }
        },
        //按钮点击
        btnClick: function () {
            //定制列点击
            this.actions.customColumnClick();
            //显示所有
            this.el.find( '.show-all-btn' ).on( 'click',()=>{
                this.data.departmentName = '';
                this.actions.getUserData();
            } )
            //显示离职
            this.el.find( '.show-leave-btn' ).on( 'click',()=>{
                this.data.isShowLeave = !this.data.isShowLeave;
                this.el.find( '.show-leave-btn span' )[0].innerHTML = this.data.isShowLeave?'显示离职':'隐藏离职';
                this.actions.getUserData();
            } )
            //floatingFilter
            this.el.find( '.float-search-btn' ).on( 'click',()=>{
                let height = this.data.isShowFloatingFilter ? 0:30;
                this.agGrid.gridOptions.api.setFloatingFiltersHeight(height);
                this.data.isShowFloatingFilter = !this.data.isShowFloatingFilter;
            } )
            //导入数据
            this.el.find('.grid-import-btn').on( 'click',()=>{
                let json = {
                    tableId: this.data.tableId,
                    isSuperUser: window.config.is_superuser || 0
                }
                let url = dgcService.returnIframeUrl( '/iframe/dataImport/',json );
                let winTitle = '导入数据';
                this.actions.openSourceDataGrid( url,winTitle,600,800 );
            } )
            //导出数据
            this.el.find( '.grid-export-btn' ).on( 'click',()=>{
                this.actions.onExport();
            } )
            //删除
            this.el.find( '.grid-del-btn' ).on( 'click',()=>{
                let arr = [];
                let rows = this.agGrid.gridOptions.api.getSelectedRows();
                for( let r of rows ){
                    if( r._id ){
                        arr.push( r._id );
                    }
                }
                if( arr.length == 0 ){
                    msgBox.alert( '请选择数据' )
                    return;
                }
                msgBox.confirm( '确定删除？' ).then( res=>{
                    if( res == true ){
                        let json = {
                            table_id:this.data.tableId,
                            real_ids:JSON.stringify( arr )
                        }
                        dataTableService.delTableData( json ).then( res=>{
                            if( res.success ){
                                msgBox.showTips( '删除成功' )
                                this.actions.setInvalid()
                            }else {
                                msgBox.alert( res.error )
                            }
                        } )
                        HTTP.flush();
                    }
                } )
            } )
            //新增
            this.el.find( '.new-form-btn' ).on( 'click',()=>{
                let obj = {
                    table_id: this.data.tableId,
                    btnType: 'new',
                    is_view: 0
                }
                let url = dgcService.returnIframeUrl( '/form/index/',obj );
                this.actions.openSelfIframe( url,'新增' )
            } )
            //高级查询
            if( this.el.find( '.expert-search-btn' )[0] ){
                this.actions.renderExpertSearch();
            }
            //宽度自适应
            this.el.find( '.grid-auto-width' ).on( 'click',()=>{
                if( !this.data.isAutoWidth ){
                    this.data.lastGridState = this.agGrid.gridOptions.columnApi.getColumnState();
                    this.agGrid.actions.autoWidth();
                }else {
                    let state = this.agGrid.gridOptions.columnApi.getColumnState();
                    for( let s of state ){
                        for( let ls of this.data.lastGridState ){
                            if( s.colId == ls.colId ){
                                s.width = ls.width;
                                break;
                            }
                        }
                    }
                    this.agGrid.gridOptions.columnApi.setColumnState( state );
                }
                this.el.find( '.grid-auto-width' ).find( 'span' ).html( !this.data.isAutoWidth?'恢复默认':'自适宽度' );
                this.data.isAutoWidth = !this.data.isAutoWidth;
            } )
            //新窗口显示隐藏
            if( this.data.isNewWindow ){
                this.el.find( '.grid-new-window' )[0].style.display = 'none';
            }
        },
        //触发导出
        onExport: function () {
            let filer = [];
            if( this.data.filterParam.filter && this.data.filterParam.filter.length != 0 ){
                filer = this.data.filterParam.filter || [];
            }
            if( this.data.filterParam['common_filter_id'] ){
                for( let a of this.data.filterParam.expertFilter ){
                    filer.push( a );
                }
            }
            let obj = {
                tableId: this.data.tableId,
                filterParam: filer
            }
            for( let o in obj ){
                exportSetting.data[o] = obj[o];
            }
            PMAPI.openDialogByComponent(exportSetting, {
                width: 600,
                height: 360,
                title: '导出数据'
            }).then((data) => {
                let dom = `<div class='exports-tips'><span class="exports-tips-delete"></span><span class="title">导出成功</span></div>`;
                this.el.find('.btn-nav').append(dom);
                setTimeout(()=>{
                    this.el.find('.exports-tips').css('display','none');
                },3000)
                this.el.find('.exports-tips-delete').on('click', ()=> {
                    this.el.find('.exports-tips').css('display','none');
                })
            });
        },
        //渲染高级查询
        renderExpertSearch: function () {
            let _this = this
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
                PMAPI.openDialogByIframe(`/iframe/expertSearch/`,{
                    width:950,
                    height:600,
                    title:`高级查询`,
                    modal:true,
                },{d}).then(res=>{
                    this.data.onlyCloseExpertSearch = res.onlyclose || false;
                    if(res.type == 'temporaryQuery') {
                        if(res.addNameAry.length == 0){
                            // this.actions.getExpertSearchData(res.addNameAry);
                            this.actions.postExpertSearch(res.value,res.id,res.name);
                        }
                        this.el.find('.dataGrid-commonQuery-select').val(res.name);
                    }
                    if(res.appendChecked) {
                        this.data.temporaryCommonQuery = res.value
                        this.actions.appendQuerySelect()
                    }
                    if(res.saveCommonQuery || res.deleteCommonQuery) {
                        this.actions.getExpertSearchData(res.addNameAry);
                    }
                    if(res.onlyclose == true) {
                        this.actions.getExpertSearchData()
                    }
                    // if(res.saveCommonQuery || (res.saveCommonQuery && res.onlyclose == true)) {
                    //     this.actions.getExpertSearchData(res.addNameAry);
                    // }if(res.deleteCommonQuery || (res.deleteCommonQuery && res.onlyclose == true)) {
                    //     this.actions.getExpertSearchData(res.addNameAry);
                    // } if(!res.saveCommonQuery && res.onlyclose == true) {
                    //     return false
                    // }
                })
            } )
            _this.el.find('.dataGrid-commonQuery-select').bind('change', function() {
                if($(this).val() == '常用查询') {
                    _this.actions.postExpertSearch([],'');
                    _this.el.find('.query-tips').css('display','none');
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
        //设置常用查询选项值
        appendQuerySelect: function() {
            let length = this.el.find('.dataGrid-commonQuery-select option').length
            for (let i = 0; i< length ;i++) {
                if(this.el.find('.dataGrid-commonQuery-select option').eq(i).val() == '临时高级查询'){
                    this.el.find('.dataGrid-commonQuery-select option').eq(i).remove()
                }
            }
            this.el.find('.dataGrid-commonQuery-select').append(`<option class="dataGrid-commonQuery-option Temporary" fieldId="00" value="临时高级查询">临时高级查询</option>`)
            this.el.find('.dataGrid-commonQuery-select').val('临时高级查询');

        },
        //获取高级查询数据
        getExpertSearchData: function (addNameAry) {
            let obj = {'actions':JSON.stringify( ['queryParams'] ),'table_id':this.data.tableId};
            dataTableService.getPreferences( obj ).then( res=>{
                this.el.find('.dataGrid-commonQuery-option').remove();
                this.el.find('.dataGrid-commonQuery-select').append(`<option class="dataGrid-commonQuery-option" fieldId="100" value="常用查询">常用查询</option>`)
                if(res.rows.length != 0){
                    res.rows.forEach((row) => {
                        this.el.find('.dataGrid-commonQuery-select').append(`<option class="dataGrid-commonQuery-option" fieldId="${row.id}" value="${row.name}">${row.name}</option>`)
                    });
                }
                if(this.data.filterParam['common_filter_name'] && this.data.onlyCloseExpertSearch) {
                    this.el.find('.dataGrid-commonQuery-select').val(this.data.filterParam['common_filter_name']);
                }
                if(this.data.commonQueryData && res.rows && this.data.commonQueryData.length > res.rows.length){
                    let inCheck = true;
                    if(this.data.filterParam['common_filter_name'] != ''){
                        if(res.rows.length == 0){
                            inCheck = true;
                        } else {
                            for(let item of res.rows) {
                                debugger
                                if (item.name == this.data.filterParam['common_filter_name']) {
                                    inCheck = false ;
                                }
                            }
                        }
                    }
                    if(inCheck) {
                        this.actions.postExpertSearch([],'');
                        this.el.find('.dataGrid-commonQuery-select').val('常用查询');
                    }
                }
                this.data.commonQueryData = res.rows;
                if(addNameAry && addNameAry.length != 0){
                    this.data.commonQueryData.forEach((item)=>{
                        for(let i = 0; i < addNameAry.length; i++) {
                            if(item.name == addNameAry[i]){
                                this.actions.postExpertSearch(JSON.parse(item.queryParams),item.id,item.name);
                                this.el.find('.dataGrid-commonQuery-select').val(item.name);
                            }
                        }
                    })
                }
            } );
            HTTP.flush();
        },
        postExpertSearch:function(data,id,name) {
            this.data.filterParam.expertFilter = data;
            this.data.filterParam.common_filter_id = id;
            this.data.filterParam.common_filter_name = name;
            this.actions.getUserData();
        },
        //定制列
        customColumnClick: function () {
            if( this.el.find('.custom-column-btn')[0] ){
                this.el.find( '.custom-column-btn' ).on( 'click',()=>{
                    this.actions.calcCustomColumn();
                } )
            }
        },
        //定制列事件
        calcCustomColumn: function () {
            this.data.isShowCustomPanel = !this.data.isShowCustomPanel;
            let close = false;
            if( this.data.isShowCustomPanel ){
                this.el.find( '.custom-columns-panel' ).eq(0).animate( { 'right':'0px' } );
            }else {
                close = true;
                setTimeout( ()=>{
                    this.el.find( '.custom-columns-panel' ).eq(0).animate( { 'right':'-200px' } );
                },400 )
            }
            this.actions.changeAgGridWidth(close);
        },
        //改变agGrid宽度
        changeAgGridWidth: function (close) {
            let num = 0;
            if( this.data.isShowCustomPanel ){
                num+=200;
            }
            let grid = this.el.find( '#data-agGrid' )
            if( close ){
                grid.width( 'calc(100% - ' + num + 'px)' );
            }else {
                setTimeout( ()=>{
                    grid.width( 'calc(100% - ' + num + 'px)' );
                },400 )
            }
        },
        //floatingFilter拼参数
        floatingFilterPostData: function (col_field, keyWord, searchOperate) {
            this.data.queryList[col_field] = {
                'keyWord': keyWord,
                'operate': dgcService.getMongoSearch(searchOperate),
                'col_field': col_field
            };
            //用于去除queryList中的空值''
            let obj = {};
            for (let key in this.data.queryList) {
                if (!( this.data.queryList[key]["keyWord"] == "" )) {
                    obj[key] = this.data.queryList[key];
                }
            }
            this.data.queryList = obj;
            let filter = [];
            for (let attr in this.data.queryList) {
                filter.push({
                    "relation": "$and",
                    "cond": {
                        "leftBracket": 0,
                        "searchBy": this.data.queryList[attr]['col_field'],
                        "operate": this.data.queryList[attr]['operate'],
                        "keyword": this.data.queryList[attr]['keyWord'],
                        "rightBracket": 0
                    }
                });
            }
            this.data.filterParam['filter'] = filter;
            this.data.filterParam['is_filter'] = 1;
            this.actions.getUserData();
        },
        //设置失效
        setInvalid: function () {
            this.pagination.data.myInvalid = true;
        },
        //打开穿透数据弹窗
        openSourceDataGrid: function ( url,title,w,h ) {
            //暂时刷新方法
            let defaultMax = false;
            if( url.indexOf( '/form/index/' ) != -1 ){
                this.actions.setInvalid();
                defaultMax = true;
            }
            PMAPI.openDialogByIframe( url,{
                width: w || 1300,
                height: h || 800,
                title: title,
                modal:true,
                defaultMax: defaultMax,
                customSize: defaultMax
            } ).then( (data)=>{
            } )
        },
        //打开局部的弹窗
        openSelfIframe: function ( url,title,w,h ) {
            PMAPI.openDialogToSelfByIframe( url,{
                width: w || 1400,
                height: h || 800,
                title: title,
                modal:true,
                defaultMax: true,
                // customSize: true
            } ).then( (data)=>{

            } )
        },
        onColumnResized: function ($event) {
            this.customColumnsCom.actions.onColumnResized( this.customColumnsCom );
        },
        onDragStopped: function ($event) {
            this.customColumnsCom.actions.onFix();
            this.customColumnsCom.actions.dragAction();
        },
        onSortChanged: function ($event) {
            if( this.data.frontendSort ){
                this.agGrid.actions.refreshView();
                return;
            }
            let data = this.agGrid.gridOptions.api.getSortModel()[0];
            if (data) {
                this.data.sortParam['sortOrder']= (data.sort == "desc" ? -1 : 1);
                this.data.sortParam['sortField']=data.colId;
                for( let d of this.data.fieldsData ){
                    if( d['field'] == data.colId ){
                        this.data.sortParam['sort_real_type']=d['real_type'];
                    }
                }
            }else {
                this.data.sortParam = {sortOrder:'',sortField:'',sort_real_type:''}
            }
            this.actions.getUserData();
        },
        onRowDoubleClicked: function ($event) {
            let obj = {
                table_id: this.data.tableId,
                btnType: 'view',
                real_id: $event.data._id,
                is_view: 1
            }
            let url = dgcService.returnIframeUrl( '/form/index/',obj );
            this.actions.openSelfIframe( url,'查看' )
        },
        getPermData:function() {
            let obj = {
                user_id:this.data.userPerm.id,
                action:'get'
            };
            dataTableService.getPermData(obj).then( res=>{
                let selectAry = []
                res.options.forEach((item)=>{
                    selectAry.push({
                        id:item.value,
                        name:item.label
                    })
                    for(let i = 0; i < res.data.length; i++){
                        if(item.value == res.data[i]){
                            this.data.userPerm.value.push({
                                id:item.value,
                                name:item.label
                            });
                        }
                    }
                })
                this.data.userPerm.options = res.options || [];
                let json = {
                    userPerm: this.data.userPerm,
                    selectAry: selectAry,
                    choosed: this.data.userPerm.value
                }
                this.actions.onOpendIframe(json)
            })
            HTTP.flush();
        },
        setPermData: function(list){
            let obj = {
                department: this.data.userPerm.department,
                user_id: this.data.userPerm.id,
                action: 'save',
                perms: JSON.stringify(list)
            }
            dataTableService.getPermData(obj).then( res=>{
                if(res.succ == 0){
                    msgBox.alert('保存成功')
                }
            })
            HTTP.flush();
        },
        onOpendIframe: function(obj){
            PMAPI.openDialogByIframe(`/iframe/jurisdiction/`,{
                width:450,
                height:550,
                title:`权限设置`,
                modal:true
            },{obj}).then(res=>{
                if(res.type == 'save'){
                    this.actions.setPermData(res.choosedList)
                }
            })
        },
        onCellClicked: function ($event) {
            if( $event.colDef.headerName == '操作' ){
                if( $event.event.srcElement.id == 'edit' ){
                    let obj = {
                        table_id: this.data.tableId,
                        btnType: 'edit',
                        real_id: $event.data._id,
                        is_view: 0
                    }
                    let url = dgcService.returnIframeUrl( '/form/index/',obj );
                    this.actions.openSelfIframe( url,'编辑' )
                }
                if( $event.event.srcElement.id == 'view' ){
                    let json = {
                        table_id: this.data.tableId,
                        btnType: 'view',
                        real_id: $event.data._id,
                        is_view: 1
                    }
                    let u = dgcService.returnIframeUrl( '/form/index/',json );
                    this.actions.openSelfIframe( u,'查看' )
                }
                if( $event.event.srcElement.id == 'jurisdiction' ){
                    this.data.userPerm.id = $event.data['_id'];
                    this.data.userPerm.department = $event.data[this.data.departmentField];
                    this.actions.getPermData()
                }
            }
        },
        //排序方式
        sortWay: function () {
            this.data.frontendSort = this.data.total < this.data.rows?true:false;
            console.log( '排序方式：' + (this.data.frontendSort ? '前端排序' : '后端排序') );
            this.agGrid.gridOptions["enableServerSideSorting"] = !this.data.frontendSort;
            this.agGrid.gridOptions["enableSorting"] = this.data.frontendSort;
        },
        //设置特殊字段field信息
        setFieldMapping: function () {
            this.data.field_mapping = window.config.system_config['0']['field_mapping'];
            this.data.userStatus = this.data.field_mapping.status;
            this.data.departmentField = this.data.field_mapping.department;
            for( let key in this.data.filter_mapping ) {
                this.data.specialFilter[this.data.field_mapping[key]] = this.data.filter_mapping[key];
            }
        }
    },
    afterRender: function (){
        this.showLoading();
        TabService.onOpenTab( this.data.tableId );
        this.actions.setFieldMapping();
        this.floatingFilterCom = new FloatingFilter();
        this.floatingFilterCom.actions.floatingFilterPostData = this.actions.floatingFilterPostData;
        this.actions.getHeaderData();
    }
}

class personnel extends Component {
    constructor(data,newConfig){
        super($.extend(true,{},config,newConfig,{data:data||{}}));
    }
}

export default personnel;