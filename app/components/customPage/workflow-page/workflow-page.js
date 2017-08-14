import Component from "../../../lib/component";
import template from './workflow-page.html';
import './workflow-page.scss';
import agGrid from '../../../components/dataGrid/agGrid/agGrid';

let config = {
    template: template,
    data: {
        tableId: ''
    },
    actions: {},
    afterRender: function (){
        console.log( this.data.tableId )
    }
}

class workflowPage extends Component {
    constructor(data) {
        super(config);
    }
}

export default workflowPage;