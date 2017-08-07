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
        cssTheme: 'ag-blue',
        floatingFilter: false,
        //原始表头数据
        fieldsData: [],
        onColumnResized:function ($event) {
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
                onColumnResized: this.data.onColumnResized
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