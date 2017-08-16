import Component from "../../../../lib/component";
import template from './history-approve-data.html';
import './history-approve-data.scss'
import agGrid from "../../agGrid/agGrid";

let config = {
    template: template,
    data: {
        table_id:'',
        real_id:'',
        key:''
    },
    actions: {

    },
    afterRender: function() {
    }
}
class historyApprove extends Component {
    constructor() {
        super(config)
    }
}
export default historyApprove