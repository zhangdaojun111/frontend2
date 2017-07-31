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

import Mediator from '../../../lib/mediator';

let config = {
    template: template,
    data: {
        columnDefs : [],
        rowData : [],
        footerData: [],
        cssTheme: 'ag-fresh',
        floatingFilter: false
    },
    gridOptions: GridOptions,
    actions: {
        createGridOptions: function (){
            this.gridOptions = {
                columnDefs: this.data.columnDefs,
                rowData: this.data.rowData,
                pinnedBottomRowData: this.data.footerData,
                floatingFilter: this.data.floatingFilter,
                animateRows: true,
                suppressMultiSort: true,
                suppressRowClickSelection: true,
                rowSelection: 'multiple',
                icons: {}
            }
        },
        createAgGrid: function (){
            var eGridDiv = document.querySelector( '#myGrid' );
            let mygrid = new Grid( eGridDiv , this.gridOptions );
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