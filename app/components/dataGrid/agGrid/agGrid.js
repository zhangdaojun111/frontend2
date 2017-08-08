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
        footerData: [],
        cssTheme: 'ag-fresh',
        floatingFilter: false,
        //原始表头数据
        fieldsData: [],
        onColumnResized:function ($event) {
        },
        onDragStopped:function ($event) {
        }
    },
    gridOptions: GridOptions,
    actions: {
        createGridOptions: function (){
            this.gridOptions = {
                columnDefs: this.data.columnDefs,
                rowData: this.data.rowData,
                pinnedBottomRowData: this.data.footerData,
                floatingFilter: this.data.floatingFilter,
                suppressFilterButton: true,
                animateRows: true,
                suppressMultiSort: true,
                enableColResize: true,
                enableSorting: true,
                sortingOrder: ['asc','desc','null'],
                suppressRowClickSelection: true,
                rowSelection: 'multiple',
                icons: dgcService.replacingIcons,
                //列宽改变
                onColumnResized: this.data.onColumnResized,
                //拖动结束
                onDragStopped: this.data.onDragStopped,
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
                }
            }
        },
        createAgGrid: function (){
            var eGridDiv = document.querySelector( '#myGrid' );
            let mygrid = new Grid( eGridDiv , this.gridOptions );
        },
        //重新赋值
        setGridData: function ( json ) {
            this.gridOptions.api.setRowData( json.rowData );
            this.gridOptions.api.setPinnedBottomRowData( json.footerData );
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