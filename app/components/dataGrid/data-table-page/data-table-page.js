import Component from "../../../lib/component";
import template from './data-table-page.html';
import './data-table-page.scss';

import dataTableAgGrid from "../data-table-page/data-table-agGrid/data-table-agGrid"
let config = {
    template: template,
    data: {
        tableId:'',
        tableName:''
    },
    actions: {},
    afterRender: function (){
        let json = {
            tableId: this.data.tableId,
            tableName: this.data.tableName
        }
        this.append(new dataTableAgGrid(json), this.el.find('#data-table-agGrid'));
        $( "#pagetabs" ).tabs();
    }
}

class dataTablePage extends Component {
    constructor(data) {
        for (let d in data) {
            config.data[d] = data[d]
        }
        super(config);
    }
}

export default dataTablePage;