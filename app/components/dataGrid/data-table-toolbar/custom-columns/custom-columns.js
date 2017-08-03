import Component from "../../../../lib/component";
import template from './custom-columns.html';
import './custom-columns.scss';

let config = {
    template: template,
    data: {},
    actions: {},
    afterRender: function (){}
}

class customColumns extends Component {
    constructor(data) {
        for (let d in data) {
            config.data[d] = data[d]
        }
        super(config);
    }
}

export default customColumns;