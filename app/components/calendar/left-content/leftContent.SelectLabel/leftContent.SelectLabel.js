import Component from "../../../../lib/component";
import template from './leftContent.SelectLabel.html';
import './leftContent.SelectLabel.scss';

import Mediator from '../../../../lib/mediator';

let config = {
    template: template,
    actions: {
       
    },

    afterRender: function() {
        let id = $(".label-id").html();
        console.log({Text});
    }
}

class LeftContentSelect extends Component {
    constructor(data){
        config.data = data;
        super(config);
    }

}

export default LeftContentSelect;