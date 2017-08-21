/**
 * Created by zhaohaoran
 */
import Component from "../../../../../../lib/component";
import template from './history-approve-ExaIte.html'


let config = {
    template: template,
    data: {
    },
    actions: {

    },
    afterRender: function() {
    }
}
class examineItem extends Component {
    constructor(data) {
        config.data = data
        super(config)
    }
}
export default examineItem