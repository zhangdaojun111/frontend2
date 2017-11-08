/**
 * @author yangxiaochuan
 * agGrid
 */
import Component from "../../../lib/component";
import template from './agGrid.html';
import {Grid,GridOptions} from 'ag-grid/main';
import './agGrid.scss';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/theme-bootstrap.css';
import 'ag-grid/dist/styles/theme-blue.css';
import 'ag-grid/dist/styles/theme-material.css';
import 'ag-grid/dist/styles/theme-dark.css';
import 'ag-grid/dist/styles/theme-fresh.css';

import {dgcService} from '../../../services/dataGrid/data-table-control.service';

let config = {
    template: template,
    data: {
        columnDefs : [],
        rowData : [],
        footerData: [{myfooter: '合计'}],
        cssTheme: 'ag-bootstrap',
        floatingFilter: false,
        //不需要分页
        noFooter: false,
        //原始表头数据
        fieldsData: [],
        localeText:{
            copy: '复制',
            ctrlC: 'ctrl + C',
            paste: '粘贴',
            ctrlV: 'ctrl + V',
            noRowsToShow: '<img src='+ require( "../../../assets/images/dataGrid/icon_shuju_no.png" ) +'>'
        },
        onColumnResized:function ($event) {
        },
        onDragStopped:function ($event) {
        },
        onDragStarted:function ($event) {
            if( $('.ag-dnd-ghost-label').html() == 'undefined' ){
                $('.ag-dnd-ghost-label').html('')
            }
            //提高拖动提示的层级使其显示
            setTimeout( ()=>{
                $(".ag-dnd-ghost").css( {'z-index':'999','background':'#ffffff','font-size':'12px','border-radius':'2px','border-color':'rgba(228, 228, 228, 1)'} );
            },0 )
        },
        onSortChanged:function ($event) {
        },
        onCellClicked:function ($event) {
        },
        onRowDoubleClicked:function ($event) {
        },
        onRowSelected:function (param) {
        },
        setRowStyle:function (param) {
        },
        isExternalFilterPresent:function () {
        },
        doesExternalFilterPass:function ($event) {
        },
        rowDataChanged:function ($event) {
        },
        onCellValueChanged:function ($event) {
        }
    },
    gridOptions: GridOptions,
    actions: {
        createGridOptions: function (){
            this.gridOptions = {
                columnDefs: this.data.columnDefs,
                rowData: this.data.rowData,
                floatingFilter: this.data.floatingFilter,
                suppressFilterButton: true,
                animateRows: true,
                suppressMultiSort: true,
                enableColResize: true,
                enableSorting: true,
                sortingOrder: ['asc','desc','null'],
                suppressRowClickSelection: true,
                suppressColumnVirtualisation: false,
                rowSelection: 'multiple',
                headerHeight: 30,
                rowHeight: 30,
                floatingFiltersHeight: 0,
                icons: dgcService.replacingIcons,
                localeText: this.data.localeText,
                //列宽改变
                onColumnResized: this.data.onColumnResized,
                //拖动结束
                onDragStopped: this.data.onDragStopped,
                onDragStarted: this.data.onDragStarted,
                onRowDataChanged: this.data.rowDataChanged,
                //双击查看
                onCellClicked: this.data.onCellClicked,
                onCellValueChanged: this.data.onCellValueChanged,
                //外部搜索
                isExternalFilterPresent: this.data.isExternalFilterPresent,
                doesExternalFilterPass: this.data.doesExternalFilterPass,
                //行双击
                onRowDoubleClicked: this.data.onRowDoubleClicked,
                //单元格双击
                onCellDoubleClicked: this.data.onCellDoubleClicked,
                //分组
                getNodeChildDetails: (rowItem)=>{
                    if ( rowItem.group||Object.is(rowItem.group,'')||Object.is(rowItem.group,0) ) {
                        return {
                            group: true,
                            // open C be default
                            // expanded: rowItem.group === 'Group C',
                            // expanded: rowItem.children&&rowItem.children[0]&&rowItem.children[0].group?true:false,
                            expanded: rowItem.children&&rowItem.children[0]&&rowItem.children[0].group?true:false,
                            // provide ag-Grid with the children of this group
                            children: rowItem.children,
                            // this is not used, however it is available to the cellRenderers,
                            // if you provide a custom cellRenderer, you might use it. it's more
                            // relavent if you are doing multi levels of groupings, not just one
                            // as in this example.
                            field: 'group',
                            // the key is used by the default group cellRenderer
                            key: rowItem.group
                        };
                    } else {
                        return {
                            group: false
                        };
                    }
                },
                //排序
                onSortChanged: this.data.onSortChanged,
                //行选择
                onRowSelected: this.data.onRowSelected,
                //单元格双击
                onCellDoubleClicked: this.data.onCellDoubleClicked,
                //设置颜色
                getRowStyle: (param)=>{
                    return this.data.setRowStyle( param )
                }
            }
            //是否需要footer
            if( !this.data.noFooter ){
                this.gridOptions['pinnedBottomRowData'] = this.data.footerData;
            }
        },
        createAgGrid: function (){
            let eGridDiv = this.el.find( '#myGrid' );
            let mygrid = new Grid( eGridDiv[0] , this.gridOptions );
        },
        //重新赋值
        setGridData: function ( json ) {
            if( json.columnDefs ){
                this.data.columnDefs = json.columnDefs;
                this.gridOptions.api.setColumnDefs( json.columnDefs );
            }
            if( json.rowData ){
                this.data.rowData = json.rowData;
                this.gridOptions.api.setRowData( json.rowData );
            }
            if( json.footerData ){
                this.data.footerData = json.footerData;
                this.gridOptions.api.setPinnedBottomRowData( json.footerData );
            }
        },
        //宽度自适应
        autoWidth: function () {
            let arr = [];
            for( let d of this.data.fieldsData ){
                let no = ['group','mySelectAll','myOperate','number'];
                if( no.indexOf( d.field ) == -1 ){
                    arr.push( d.field );
                }
            }
            this.gridOptions.columnApi.autoSizeColumns( arr );
        },
        //刷新序号
        refreshView: function () {
            this.gridOptions.api.redrawRows();
        },
    },
    afterRender: function (){
        this.actions.createGridOptions();
        this.actions.createAgGrid();
    }
}

class agGrid extends Component {
    constructor(data,newConfig){
        for (let d in data) {
            config.data[d] = data[d];
        }
        super($.extend(true,{},config,newConfig,{data:data||{}}));
    }
}

export default agGrid;