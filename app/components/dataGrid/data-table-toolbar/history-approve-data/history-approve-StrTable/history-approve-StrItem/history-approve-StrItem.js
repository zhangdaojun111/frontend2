/**
 * Created by zhaohaoran
 */
import Component from "../../../../../../lib/component";
import template from './history-approve-StrItem.html'


let config = {
    template: template,
    data: {
    },
    actions: {

    },
    afterRender: function() {
    }
}
class strikeItem extends Component {
    constructor(data) {
        config.data = data
        super(config)
    }
}
export default strikeItem