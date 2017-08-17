import Component from "../../../lib/component";
import template from './agGrid.html';
import {Grid,GridOptions} from 'ag-grid/main';
import './agGrid.scss';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/theme-bootstrap.css';
// import 'ag-grid/dist/styles/theme-blue.css';
// import 'ag-grid/dist/styles/theme-material.css';
// import 'ag-grid/dist/styles/theme-dark.css';
// import 'ag-grid/dist/styles/theme-fresh.css';

import {dgcService} from '../../../services/dataGrid/data-table-control.service';

let config = {
    template: template,
    data: {
        columnDefs : [],
        rowData : [],
        footerData: [],
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
        onSortChanged:function ($event) {
        },
        onCellClicked:function ($event) {
        },
        onRowDoubleClicked:function ($event) {
        },
        onRowSelected:function (param) {
            console.log( 666 )
            console.log( 666 )
        },
        setRowStyle:function (param) {
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
                animateRows: false,
                suppressMultiSort: true,
                enableColResize: true,
                enableSorting: true,
                sortingOrder: ['asc','desc','null'],
                suppressRowClickSelection: true,
                rowSelection: 'multiple',
                headerHeight: 25,
                floatingFiltersHeight: 0,
                icons: dgcService.replacingIcons,
                localeText: this.data.localeText,
                //列宽改变
                onColumnResized: this.data.onColumnResized,
                //拖动结束
                onDragStopped: this.data.onDragStopped,
                //双击查看
                onCellClicked: this.data.onCellClicked,
                //行双击
                onRowDoubleClicked: this.data.onRowDoubleClicked,
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
            var eGridDiv = this.el.find( '#myGrid' );
            let mygrid = new Grid( eGridDiv[0] , this.gridOptions );
        },
        //重新赋值
        setGridData: function ( json ) {
            if( json.rowData ){
                this.gridOptions.api.setRowData( json.rowData );
            }
            if( json.footerData ){
                this.gridOptions.api.setPinnedBottomRowData( json.footerData );
            }
            // this.agGrid.gridOptions.api.redrawRows();
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
        }
    },
    afterRender: function (){
        this.actions.createGridOptions();
        this.actions.createAgGrid();
    }
}

class agGrid extends Component {
    constructor(data) {
        for( let d in data ){
            config.data[d] = data[d]
        }
        super(config);
    }
}

export default agGrid;