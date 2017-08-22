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
                {headerName: '级联详情', width: 100,field:'cache_detail', suppressSorting: true,suppressMenu: true,cellRenderer:(param)=>{
                    return '<div style="text-align: center;color:#0E7AEF;">详情</div>'
                },cellStyle:{'font-style': 'normal','text-align':'center'}},
                {headerName: '本表结果', width: 100,field:'result_type', suppressSorting: true,suppressMenu: true,cellRenderer:(param)=>{
                    let result = param.data.result_type;
                    if( result=='失败' ){
                        return '<div style="text-align: center;color: red;font-weight: bold;">'+result+'</div>';
                    }else {
                        return '<div style="text-align: center;">'+result+'</div>';
                    }
                },cellStyle:{'font-style': 'normal','text-align':'center'}},
                {headerName: '本表详情', width: 100,field:'operation', suppressSorting: true,suppressMenu: true,cellRenderer:()=>{
                    return '<div style="text-align: center;color:#0E7AEF;">详情</div>'
                },cellStyle:{'font-style': 'normal','text-align':'center'}}
            ];
            this.data.columnDefs = columnData;
            this.actions.renderGrid();
            this.actions.renderBtn();
            this.actions.getData();
        },
        //渲染
        renderGrid: function () {
            let gridData = {
                columnDefs: this.data.columnDefs,
                rowData: this.data.rowData,
                floatingFilter: false,
                onColumnResized: this.actions.onColumnResized,
                onSortChanged: this.actions.onSortChanged,
                onDragStopped: this.actions.onDragStopped,
                onCellClicked: this.actions.onCellClicked,
                onRowDoubleClicked: this.actions.onRowDoubleClicked
            }
            this.agGrid = new agGrid(gridData);
            this.append(this.agGrid , this.el.find('#operation-agGrid'));
            // //渲染分页
            // let paginationData = {
            //     total: this.data.total,
            //     rows: this.data.rows,
            //     tableId: this.data.tableId
            // }
            // //渲染分页
            // this.pagination = new dataPagination(paginationData);
            // this.pagination.actions.paginationChanged = this.actions.refreshData;
            // this.append(this.pagination, this.el.find('.pagination'));

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
        },
        //获取数据
        getData: function () {

        },
        //floatingFilter
        floatingFilterPostData: function (col_field, keyWord, searchOperate) {

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
        onRowDoubleClicked: function ($event) {
        }
    },
    afterRender: function (){
        this.actions.createColumnDefs();
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