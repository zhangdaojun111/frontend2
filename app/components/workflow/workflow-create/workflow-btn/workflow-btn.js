import Component from "../../../../lib/component";
import template from './workflow-btn.html';
import './workflow-btn.scss';

import Mediator from '../../../../lib/mediator';

let config = {
    template: template,

    actions: {
        
    },

    afterRender: function() {
       
    }
}

class WorkFlowBtn extends Component {
    constructor(data){
        config.data = data;
        super(config);
    }
}

export default WorkFlowBtn;