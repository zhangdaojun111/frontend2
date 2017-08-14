import Component from "../../../lib/component";
import template from './workflow-page.html';
import './workflow-page.scss';
import {HTTP} from "../../../lib/http";
import agGrid from '../../../components/dataGrid/agGrid/agGrid';
import {wchService} from '../../../services/dataGrid/workflow-config-header.service';
import {dataTableService} from '../../../services/dataGrid/data-table.service';
import {dgcService} from "../../../services/dataGrid/data-table-control.service";
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
        tableId2pageType: {'approve-workflow':5},
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

    },
    actions: {
        //创建表头
        createColumnDefs: function () {
            this.data.pageType = this.data.tableId2pageType[this.data.tableId];
            let cols = wchService.getWorkflowHeader( this.data.pageType );
            this.data.columnDefs = [dgcService.numberCol];
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
                this.data.columnDefs.push( obj );
            }
            console.log( this.data.columnDefs )
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
                floatingFilter: true
            }
            this.agGrid = new agGrid(gridData);
            this.append(this.agGrid , this.el.find('#workflow-agGrid'));
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
        //分页刷新
        refreshData: function () {

        },
        //渲染按钮
        renderBtn: function () {
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
                console.log( "_______________" )
                console.log( "_______________" )
                console.log( res )
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
            console.log("rows")
            console.log(this.data.rows)
            console.log("colWidth")
            console.log(this.data.colWidth)
            console.log("ignoreFields")
            console.log(this.data.ignoreFields)
            console.log("fixCols")
            console.log(this.data.fixCols)
            console.log("orderFields")
            console.log(this.data.orderFields)
        },
        //floatingFilter
        floatingFilterPostData: function (col_field, keyWord, searchOperate) {

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