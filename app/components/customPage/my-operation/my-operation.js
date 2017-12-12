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

let myOperation = Component.extend({
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
            this.floatingFilterCom = new FloatingFilter();
            //创建表头
            let columnData = [
                {headerName: '操作类型', width: 100,field:'operation_type',floatingFilterComponent: this.floatingFilterCom.actions.createFilter('none', 'operation_type', this.data.searchValue, this.data.searchOldValue),
                    floatingFilterComponentParams: {suppressFilterButton: true}, suppressSorting: true,suppressMenu: true,cellStyle:{'font-style': 'normal','text-align':'center'}},
                {headerName: '操作目标', width: 100,field:'obj_name', floatingFilterComponent: this.floatingFilterCom.actions.createFilter('none', 'obj_name', this.data.searchValue, this.data.searchOldValue),
                    floatingFilterComponentParams: {suppressFilterButton: true}, suppressSorting: true,suppressMenu: true,cellStyle:{'font-style': 'normal','text-align':'center'}},
                {headerName: '操作时间', minWidth: 160,field:'create_time',floatingFilterComponent: this.floatingFilterCom.actions.createFilter('none', 'create_time', this.data.searchValue, this.data.searchOldValue),
                    floatingFilterComponentParams: {suppressFilterButton: true}, suppressSorting: true,suppressMenu: true,cellStyle:{'font-style': 'normal','text-align':'center'}},
                {headerName: '级联结果', width: 100,field:'cache_result',floatingFilterComponent: this.floatingFilterCom.actions.createFilter('none' , 'cache_result', this.data.searchValue, this.data.searchOldValue),
                    floatingFilterComponentParams: {suppressFilterButton: true}, suppressSorting: true,suppressMenu: true,cellStyle:{'font-style': 'normal','text-align':'center'}},
                {headerName: '级联详情', width: 100,field:'cache_detail',floatingFilterComponent: this.floatingFilterCom.actions.createFilter('none' , 'cache_detail', this.data.searchValue, this.data.searchOldValue),
                    floatingFilterComponentParams: {suppressFilterButton: true}, suppressSorting: true,suppressMenu: true,cellRenderer:(param)=>{
                    return '<div style="text-align: center;color:#2298f4;cursor: pointer">详情</div>'
                },cellStyle:{'font-style': 'normal','text-align':'center'}},
                {headerName: '本表结果', width: 100,field:'result_type',floatingFilterComponent: this.floatingFilterCom.actions.createFilter('none', 'result_type', this.data.searchValue, this.data.searchOldValue),
                    floatingFilterComponentParams: {suppressFilterButton: true}, suppressSorting: true,suppressMenu: true,cellRenderer:(param)=>{
                    let result = param.data.result_type;
                    if( result=='失败' ){
                        return '<div style="text-align: center;color: red;font-weight: bold;">'+result+'</div>';
                    }else {
                        return '<div style="text-align: center;">'+result+'</div>';
                    }
                },cellStyle:{'font-style': 'normal','text-align':'center'}},
                {headerName: '本表详情', width: 100,field:'operation',floatingFilterComponent: this.floatingFilterCom.actions.createFilter('none' , 'operation', this.data.searchValue, this.data.searchOldValue),
                    floatingFilterComponentParams: {suppressFilterButton: true}, suppressSorting: true,suppressMenu: true,cellRenderer:()=>{
                    return '<div style="text-align: center;color:#2298f4;">详情</div>'
                },cellStyle:{'font-style': 'normal','text-align':'center'}}
            ];
            this.data.columnDefs = columnData;

            this.floatingFilterCom.actions.floatingFilterPostData = this.actions.floatingFilterPostData;
            this.actions.renderGrid();
            this.actions.renderBtn();
            this.actions.getData();
        },
        //渲染
        renderGrid: function () {
            let gridData = {
                columnDefs: this.data.columnDefs,
                rowData: this.data.rowData,
                noFooter: true,
                floatingFilter: true,
                onColumnResized: this.actions.onColumnResized,
                onSortChanged: this.actions.onSortChanged,
                onDragStopped: this.actions.onDragStopped,
                onCellClicked: this.actions.onCellClicked,
                onRowDoubleClicked: this.actions.onRowDoubleClicked
            }
            this.agGrid = new agGrid({data:gridData});
            this.append(this.agGrid , this.el.find('#operation-agGrid'));
            //渲染分页
            let paginationData = {
                total: this.data.total,
                rows: this.data.rows,
                tableId: this.data.tableId
            }
            //渲染分页
            this.pagination = new dataPagination({data: paginationData});
            this.pagination.actions.paginationChanged = this.actions.refreshData;
            this.append(this.pagination, this.el.find('.pagination'));

        },
        //渲染按钮
        renderBtn: function () {
            //floatingFilter
            if( this.el.find( '.float-search-btn' )[0] ){
                this.el.find( '.float-search-btn' ).on( 'click',()=>{
                    let height = this.data.isShowFloatingFilter ? 0:30;
                    this.agGrid.gridOptions.api.setFloatingFiltersHeight(height);
                    this.data.isShowFloatingFilter = !this.data.isShowFloatingFilter;
                } )
            }
        },
        //获取数据
        getData: function () {
            let json = this.actions.createPostData()
            let gridData = dataTableService.getOperationData(json);
            let arr = [gridData];
            Promise.all(arr).then((res)=> {
                this.data.rowData = res[0].rows;
                this.data.total = res[0].history_num;
                let obj = {
                    rowData: this.data.rowData,
                }
                this.agGrid.actions.setGridData( obj );
                this.pagination.actions.setPagination( this.data.total,this.data.page );
            });
            HTTP.flush();
        },
        //创建请求数据参数
        createPostData: function () {
            let json = {
                rows:this.data.rows,first:this.data.page,filter:[]
            }
            if( this.data.filterParam.filter && this.data.filterParam.filter.length != 0 ){
                json['filter'] = _.cloneDeep(this.data.filterParam.filter ) || []
            }
            if( this.data.filterParam['common_filter_id'] ){
                json['filter'] = json['filter'] || [];
                let len = this.data.filterParam.expertFilter.length - 1;
                for(let i = len; i>=0; i--){
                    json['filter'].unshift(this.data.filterParam.expertFilter[i]);
                }
                // for( let a of this.data.filterParam.expertFilter ){
                //     json['filter'].push( a );
                // }
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
        //分页刷新
        refreshData: function (res) {
            this.data.rows = res.rows;
            this.data.page = res.currentPage;
            this.data.first = res.first;
            this.actions.getData();
        },
        handleCellRenderer:function(param){
            return '<div style="text-align: center;color:#0E7AEF;">详情</div>'
        },

        handleCellRendererResult:function(param){
            let result = param.data.result_type;
            if( result=='失败' ){
                return '<div style="text-align: center;color: red;font-weight: bold;">'+result+'</div>';
            }else {
                return '<div style="text-align: center;">'+result+'</div>';
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
            this.actions.getData();
        },
        onColumnResized: function ($event) {
            // this.customColumnsCom.actions.onColumnResized( this.customColumnsCom );
        },
        onDragStopped: function ($event) {
            // this.customColumnsCom.actions.onFix();
            // this.customColumnsCom.actions.dragAction();
        },
        onSortChanged: function ($event) {
            // if( this.data.frontendSort ){
            //     return;
            // }
            // let data = this.agGrid.gridOptions.api.getSortModel()[0];
            // if (data) {
            //     this.data.sortParam['sortOrder']= (data.sort == "desc" ? -1 : 1);
            //     this.data.sortParam['sortField']=data.sortField;
            // }else {
            //     this.data.sortParam = {sortOrder:'',sortField:'',sort_real_type:''}
            // }
            // this.actions.getData();
        },
        onCellClicked: function (params) {
            if(params['colDef']['field']=='operation'){
                let obj = {};
                obj['tableId'] = params['data']['table_id'];
                obj['type'] = 'operation';
                obj['content'] = params['data']['result_detail'] || '';
                obj['dataInfo'] = params['data']['data_info'] || [];
                this.actions.onOpenIframe(obj)
            } else if(params['colDef']['field']=='cache_detail'){
                let obj = {};
                obj['tableId'] = params['data']['table_id'];
                obj['type'] = 'cache_detail';
                obj['content'] = params['data']['cache_detail'] || '';
                this.actions.onOpenIframe(obj)
            }
        },
        //打开详情弹窗
        onOpenIframe: function(obj){
            PMAPI.openDialogByIframe(`/iframe/operationDetails/`,{
                width:1200,
                height:800,
                title:`详情`,
                modal:true
            },{obj}).then(res=>{

            })
        },
        onRowDoubleClicked: function ($event) {
        }
    },
    afterRender: function (){
        this.actions.createColumnDefs();
    }
})

// class myOperation extends Component {
//     constructor(data,newConfig){
//         for (let d in data) {
//             config.data[d] = data[d];
//         }
//         super($.extend(true,{},config,newConfig,{data:data||{}}));
//     }
// }

export default myOperation;