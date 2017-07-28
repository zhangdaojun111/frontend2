import Component from "../../lib/component";
import template from './data-table-page.html.html';
import './data-table-page.scss';

let config = {
    template: template,
    data: {},
    actions: {},
    afterRender: function (){}
}

class dataTablePage extends Component {
    constructor() {
        super(config);
    }
}

export default dataTablePage;