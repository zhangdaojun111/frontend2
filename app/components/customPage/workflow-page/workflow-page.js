/**
 * @author yangxiaochuan
 * 工作流定制表
 */
import Component from "../../../lib/component";
import template from './workflow-page.html';
import './workflow-page.scss';
import '../../../assets/scss/dataGrid/dataGrid-icon.scss';
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
        footerData:[],
        fieldsData:[],
        rows: 100,
        total: 0,
        page: 1,
        //pageType{0:'进展中的工作',1:'已完成的工作',2:'我的工作申请中的工作',3:'我的工作已完成的工作',4:'我的工作审批过的工作',5:'工作审批',6:'我的工作已关注的工作'}
        pageType: 5,
        tableId2pageType: {'approve-workflow':5,'approving-workflow':0,'finished-workflow':1,'my-workflow':2,'finish-workflow':3,'focus-workflow':6,'approved-workflow':4},
        tableId2Name: {'approve-workflow':'工作审批','approving-workflow':'进展中的工作','finished-workflow':'已完成的工作','my-workflow':'我的工作->申请中的工作','finish-workflow':'我的工作->已完成的工作','focus-workflow':'我的工作->已关注的工作','approved-workflow':'我的工作->审批过的工作'},
        //定制列（列宽）
        colWidth: {},
        //定制列（固定列）
        fixCols: {l: [], r: []},
        //定制列（列排序）
        orderFields: [],
        //定制列（隐藏列）
        ignoreFields: [],
        //请求数据参数
        commonQueryData:[],
        onlyCloseExpertSearch:false,
        //是否第一次渲染agGrid
        firstRender: true,
        //可以搜索的数据
        iCanSearch: {},
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
        //选择的数据
        selectRows: [],
        //高级查询字段参数
        expertSearchFields:[],
        //是否显示floatingfilter
        isShowFloatingFilter: false,
        //排序参数
        sortParam: {sortOrder:'',sortField:'',sort_real_type:''},
        //排序方式
        frontendSort: false,
        //第一次设置数据
        firstSetData: true,
        //定制列数据
        customColumnsFields: [{name:'序号',field:'number',canhide:false,candrag:false,canFix:false}, {name:'操作',field:'myOperate',canhide:true,candrag:true,canFix:true}]
    },
    actions: {
        //创建表头
        createColumnDefs: function () {
            let cols = wchService.getWorkflowHeader( this.data.pageType );
            let number = dgcService.numberCol;
            number['headerCellTemplate'] = this.actions.resetPreference();
            this.data.columnDefs = [number];
            if( this.data.pageType == 2||this.data.pageType == 0 ){
                this.data.columnDefs.push( dgcService.selectCol )
                this.data.customColumnsFields.push( {name:'选择',field:'mySelectAll',canhide:false,candrag:false,canFix:false} )
            }
            let fixArr = this.data.fixCols.l.concat(this.data.fixCols.r);
            for( let col of cols ){
                if( col.field == 'myOperate' ){
                    col['suppressFilter'] = true;
                    this.data.columnDefs.push( col );
                    continue;
                }
                let s = this.actions.searchType(col["field"],col.headerName);
                let minWidth = {
                    datetime: 160,
                    time: 90,
                    date: 110
                }
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
                    minWidth: minWidth[s.type] || 20,
                    width: col["width"] || 120,
                    cellStyle: {'font-style': 'normal'},
                    floatingFilterComponent: this.floatingFilterCom.actions.createFilter(s.type , s.field, this.data.searchValue, this.data.searchOldValue),
                    floatingFilterComponentParams: {suppressFilterButton: true},
                    enableRowGroup: true,
                    suppressSorting: false,
                    sortField: col["field"],
                    suppressResize: false,
                    suppressMovable: false
                }
                //定制列数据
                this.data.customColumnsFields.push( {name:col.headerName,field:col["field"],canhide:true,candrag:true,canFix:true} );
                this.data.columnDefs.push( obj );
            }
            this.data.fieldsData = this.data.columnDefs;
        },
        resetPreference: function () {
            let ediv = document.createElement('div');
            let eHeader = document.createElement('span');
            let eImg = document.createElement('i');
            eImg.className = 'icon-aggrid icon-aggrid-cancel resetFloatingFilter';
            eImg.title = '重置筛选';
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
                        this.actions.getData();
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
        //返回搜索类型
        searchType: function ( data,name ) {
            let type = 'none';
            if( this.data.iCanSearch[data] ){
                type = 'text';
                if( name.indexOf( '时间' ) != -1 ){
                    type = 'datetime';
                }
            }
            return {type:type,field:this.data.iCanSearch[data] || data};
        },
        //渲染
        renderGrid: function () {
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
                onRowDoubleClicked: this.actions.onRowDoubleClicked
            }
            this.agGrid = new agGrid(gridData);
            this.append(this.agGrid , this.el.find('#workflow-agGrid'));
            dgcService.calcColumnState( this.data,this.agGrid,["number","mySelectAll"] )
            //渲染分页
            let paginationData = {
                total: this.data.total,
                rows: this.data.rows,
                tableId: this.data.tableId,
                type: 'workflow'
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
                agGrid: this.agGrid,
                close: this.actions.calcCustomColumn,
                setFloatingFilterInput: this.actions.setFloatingFilterInput
            }
            //渲染定制列
            if( $('.custom-column-btn')[0] ){
                this.customColumnsCom  = new customColumns(custom);
                this.append(this.customColumnsCom, this.el.find('.custom-columns-panel'));
            }
            this.data.firstRender = false;
            //点击关掉定制列panel
            this.el.find( '.ag-body' ).on( 'click',()=>{
                setTimeout( ()=>{
                    this.el.find( '.custom-columns-panel' ).eq(0).animate( { 'right':'-200px' } );
                },400 )
                this.data.isShowCustomPanel = false;
                this.actions.changeAgGridWidth(true);
            } )
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
        refreshData: function (res) {
            this.data.rows = res.rows;
            this.data.page = res.currentPage;
            this.data.first = res.first;
            this.actions.getData(true);
        },
        //渲染按钮
        renderBtn: function () {
            if( this.data.tableId == 'my-workflow' || this.data.tableId == 'approving-workflow' ){
                this.el.find( '.batch-cancel' )[0].style.display = 'flex';
                this.el.find( '.batch-cancel' ).on( 'click',()=>{
                    this.data.selectRows = [];
                    let rows = this.agGrid.gridOptions.api.getSelectedRows();
                    for( let r of rows ){
                        this.data.selectRows.push( r.id );
                    }
                    if( this.data.selectRows.length == 0 ){
                        msgBox.alert( '请选择要取消的数据！' )
                    }else {
                        msgBox.confirm( '确定取消？' ).then( res=>{
                            if( res ){
                                let json = {
                                    checkIds: JSON.stringify(this.data.selectRows),
                                    action:4,
                                    type:1
                                }
                                workflowService.approveMany( json )
                                    .then(data => {
                                        if( data.success ){
                                            msgBox.showTips( '取消成功' );
                                            this.actions.getData();
                                        }else {
                                            msgBox.alert( '取消失败：' + data.error );
                                        }
                                    })
                            }
                        } )
                    }
                } );
            }else {
                this.el.find( '.batch-cancel' )[0].style.display = 'none';
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
                    this.actions.calcCustomColumn();
                } )
            }
            //新窗口显示隐藏
            if( this.data.isNewWindow ){
                this.el.find( '.grid-new-window' )[0].style.display = 'none';
            }else {
                //全屏
                if( this.el.find( '.grid-new-window' )[0] ){
                    let obj = {
                        tableId: this.data.tableId,
                        tableName: this.data.tableId2Name[this.data.tableId],
                        isNewWindow: true
                    }
                    let url = this.actions.returnIframeUrl( '/iframe/workflowPage/',obj )
                    this.el.find('.grid-new-window').attr('href', url);
                }
            }
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
                    modal:true
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
        getData: function (refresh) {
            let json = this.actions.createPostData();
            let obj1 = {
                actions: JSON.stringify(['ignoreFields', 'fieldsOrder', 'pageSize', 'colWidth', 'pinned']),
                table_id: this.data.tableId
            }
            let gridData = dataTableService.getWorkflowData( json );
            let arr = [gridData];
            if( this.data.firstRender ){
                let preferenceData = dataTableService.getPreferences(obj1);
                arr = [gridData,preferenceData];
            }
            Promise.all(arr).then((res)=> {
                this.data.rowData = res[0].rows;
                this.data.total = res[0].total;
                if( this.data.firstRender ){
                    this.data.iCanSearch = res[0].field_mapping;
                    this.actions.renderBtn();
                    this.actions.createColumnDefs();
                    for( let c of this.data.columnDefs ){
                        let f = c.field;
                        let n = c.headerName
                        if( this.data.iCanSearch[f] ){
                            let obj = {}
                            obj['name'] = n;
                            obj['searchField'] = this.data.iCanSearch[f];
                            obj['searchType'] = n.indexOf( '时间' ) != -1 ? 'datetime':'text';
                            this.data.expertSearchFields.push( obj );
                        }
                    }
                    dgcService.setPreference( res[1],this.data );
                    this.actions.renderGrid();
                }
                let obj = {
                    rowData: this.data.rowData
                }
                this.actions.sortWay();
                this.agGrid.actions.setGridData( obj );
                this.pagination.actions.setPagination( this.data.total,this.data.page );
                //第一次关闭loading
                if( this.data.firstSetData ){
                    this.hideLoading();
                    this.data.firstSetData = false;
                }
                if(refresh){
                    msgBox.showTips( '数据刷新成功。' )
                }
            });
            HTTP.flush();
        },
        //设置搜索input值
        setFloatingFilterInput: function () {
            for( let k in this.data.searchValue ){
                this.el.find( '.filter-input-'+k )[0].value = this.data.searchValue[k];
            }
        },
        //创建请求数据参数
        createPostData: function () {
            let json = {
                type:this.data.pageType,rows:this.data.rows,page:this.data.page,filter:[]
            }
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
            return json;
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
            this.actions.getData();
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
            if( this.data.frontendSort ){
                this.agGrid.actions.refreshView();
                return;
            }
            let data = this.agGrid.gridOptions.api.getSortModel()[0];
            if (data) {
                this.data.sortParam['sortOrder']= (data.sort == "desc" ? -1 : 1);
                this.data.sortParam['sortField']=data.sortField;
            }else {
                this.data.sortParam = {sortOrder:'',sortField:'',sort_real_type:''}
            }
            this.actions.getData();
        },
        onRowDoubleClicked: function ($event) {
            let obj = {
                form_id: $event["data"]["form_id"],
                record_id: $event["data"]["id"],
                flow_id: $event["data"]["flow_id"],
                table_id: $event["data"]["table_id"]
            }
            let winTitle = '查看工作';
            obj['btnType'] = 'view';
            let url = dgcService.returnIframeUrl( '/wf/approval/',obj );
            this.actions.openSourceDataGrid( url,winTitle );
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
        //设置失效
        setInvalid: function () {
            if( this.pagination ){
                this.pagination.data.myInvalid = true;
            }
        },
        //延时刷新
        timeDelayRefresh: function(){
            this.actions.setInvalid();
            this.pagination.actions.timeDelayRefresh();
        },
        //打开穿透数据弹窗
        openSourceDataGrid: function ( url,title ) {
            let defaultMax = false;
            if( url.indexOf( '/wf/approval/' ) != -1 ){
                defaultMax = true;
            }
            PMAPI.openDialogByIframe( url,{
                width: 1000,
                height: 800,
                title: title,
                modal:true,
                // defaultMax: defaultMax,
                customSize: defaultMax
            } ).then( (data)=>{
                console.log( "工作流操作返回" )
                console.log( data )

                if( data.refresh ){
                    this.actions.timeDelayRefresh();
                }
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
                                msgBox.showTips( '操作成功' );
                                this.actions.timeDelayRefresh();
                            }else {
                                msgBox.alert( '操作失败：' + res.error );
                            }
                        })
                }
            })
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
            this.actions.getData();
        },
        //排序方式
        sortWay: function () {
            this.data.frontendSort = this.data.total < this.data.rows?true:false;
            console.log( '排序方式：' + (this.data.frontendSort ? '前端排序' : '后端排序') );
            this.agGrid.gridOptions["enableServerSideSorting"] = !this.data.frontendSort;
            this.agGrid.gridOptions["enableSorting"] = this.data.frontendSort;
        },
    },
    afterRender: function (){
        this.showLoading();
        this.el.find( '.headerTips' ).eq(0).find( 'span' ).eq(0).html( this.data.tableId2Name[this.data.tableId] );
        this.floatingFilterCom = new FloatingFilter();
        this.floatingFilterCom.actions.floatingFilterPostData = this.actions.floatingFilterPostData;
        this.data.pageType = this.data.tableId2pageType[this.data.tableId];
        this.actions.getData();
    }
}
class workflowPage extends Component {
    constructor(data,newConfig){
        for (let d in data) {
            config.data[d] = data[d];
        }
        super($.extend(true,{},config,newConfig,{data:data||{}}));
    }
}

export default workflowPage;