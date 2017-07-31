import Component from "../../../lib/component";
import template from './data-table-page.html';
import './data-table-page.scss';

import dataTableAgGrid from "../data-table-page/data-table-agGrid/data-table-agGrid"
let config = {
    template: template,
    data: {},
    actions: {},
    afterRender: function (){
        this.append(new dataTableAgGrid({}), this.el.find('#data-table-agGrid'));
    }
}

class dataTablePage extends Component {
    constructor() {
        super(config);
    }
}

export default dataTablePage;