/**
 * Created by zhaohaohao
 */
import Component from "../../../../../../lib/component";
import template from './expert-search-item.html'


let config = {
    template: template,
    data: {
    },
    actions: {

    },
    afterRender: function() {

    }
}
class expertItem extends Component {
    constructor(data) {
        config.data = data
        super(config)
    }
}
export default expertItem