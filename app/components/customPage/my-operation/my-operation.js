/**
 * Created by zhaohaoran
 * 我的操作定制表
 */
import Component from "../../../lib/component";
import template from './my-operation.html';
import './my-operation.scss';
import {HTTP} from "../../../lib/http";
import msgBox from '../../../lib/msgbox';
import {PMAPI,PMENUM} from '../../../lib/postmsg';
import agGrid from '../../../components/dataGrid/agGrid/agGrid';
import {dataTableService} from '../../../services/dataGrid/data-table.service';
import {dgcService} from "../../../services/dataGrid/data-table-control.service";
import dataPagination from "../../dataGrid/data-table-toolbar/data-pagination/data-pagination";
import FloatingFilter from "../../dataGrid/data-table-toolbar/floating-filter/floating-filter";

let config = {
    template: template,
    data: {
        tableId: '',
        columnDefs: [],
        rowData:[],
        fieldsData:[],
        rows: 100,
        total: 0,
        page: 1,
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


        //选择的数据
        selectRows: [],
        //是否显示floatingfilter
        isShowFloatingFilter: false,
        //排序参数
        sortParam: {sortOrder:'',sortField:'',sort_real_type:''},
        //排序方式
        frontendSort: false,
    },
    actions: {
        //创建表头
        createColumnDefs: function () {
            let columnData = [
                {headerName: '操作类型', width: 100,field:'operation_type', suppressSorting: true,suppressMenu: true,cellStyle:{'font-style': 'normal','text-align':'center'}},
                {headerName: '操作目标', width: 100,field:'obj_name', suppressSorting: true,suppressMenu: true,cellStyle:{'font-style': 'normal','text-align':'center'}},
                {headerName: '操作时间', width: 100,field:'create_time', suppressSorting: true,suppressMenu: true,cellStyle:{'font-style': 'normal','text-align':'center'}},
                {headerName: '级联结果', width: 100,field:'cache_result', suppressSorting: true,suppressMenu: true,cellStyle:{'font-style': 'normal','text-align':'center'}},
                {headerName: '级联详情', width: 100,field:'cache_detail', suppressSorting: true,suppressMenu: true,cellRenderer:this.handleCellRenderer,cellStyle:{'font-style': 'normal','text-align':'center'}},
                {headerName: '本表结果', width: 100,field:'result_type', suppressSorting: true,suppressMenu: true,cellRenderer:this.handleCellRendererResult,cellStyle:{'font-style': 'normal','text-align':'center'}},
                {headerName: '本表详情', width: 100,field:'operation', suppressSorting: true,suppressMenu: true,cellRenderer:this.handleCellRenderer,cellStyle:{'font-style': 'normal','text-align':'center'}}
            ];

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
                rowData: this.data.rowData,
                fieldsData: this.data.fieldsData,
                floatingFilter: true,
                onColumnResized: this.actions.onColumnResized,
                onSortChanged: this.actions.onSortChanged,
                onDragStopped: this.actions.onDragStopped,
                onCellClicked: this.actions.onCellClicked,
                onRowDoubleClicked: this.actions.onRowDoubleClicked
            }
            this.agGrid = new agGrid(gridData);
            this.append(this.agGrid , this.el.find('#operation-agGrid'));
            dgcService.calcColumnState( this.data,this.agGrid,["number","mySelectAll"] )
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
            this.actions.getData();
        },
        //渲染按钮
        renderBtn: function () {
            //floatingFilter
            let floatSearch = this.el.find( '.float-search-btn' );
            if( floatSearch[0] ){
                floatSearch.on( 'click',()=>{
                    let height = this.data.isShowFloatingFilter ? 0:30;
                    this.agGrid.gridOptions.api.setFloatingFiltersHeight(height);
                    this.data.isShowFloatingFilter = !this.data.isShowFloatingFilter;
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
            let gridData = dataTableService.getOperationData( json );
            debugger
            let arr = [gridData];
            // if( this.data.firstRender ){
            //     let preferenceData = dataTableService.getPreferences(obj1);
            //     arr = [gridData,preferenceData];
            // }
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
                    this.actions.renderGrid();
                }
                let obj = {
                    rowData: this.data.rowData
                }
                this.actions.sortWay();
                this.agGrid.actions.setGridData( obj );
                this.pagination.actions.setPagination( this.data.total,this.data.page );
            });
            HTTP.flush();
        },

        postExpertSearch:function(data,id,name) {
            this.data.filterParam.expertFilter = data;
            this.data.filterParam.common_filter_id = id;
            this.data.filterParam.common_filter_name = name;
            this.actions.getData();
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
            if( this.data.frontendSort ){
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
        debugger
        // this.floatingFilterCom = new FloatingFilter();
        // this.floatingFilterCom.actions.floatingFilterPostData = this.actions.floatingFilterPostData;
        // this.data.pageType = this.data.tableId2pageType[this.data.tableId];
        this.actions.getData();
    }
}

class myOperation extends Component {
    constructor(data) {
        for( let d in data ){
            config.data[d] = data[d];
        }
        super(config);
    }
}

export default myOperation;