import Component from "../../../../lib/component";
import template from './workflow-btn.html';
import './workflow-btn.scss';

import Mediator from '../../../../lib/mediator';

let config = {
    template: template,
    actions: {
        choose: function(e) {
            Mediator.publish('workflow:choose', $(e.target)[0].dataset);
        }
    },
    afterRender: function() {
        this.el.on('click', '.workflow-btn', (e) => {
            this.actions.choose(e);
        });
        this.el.on('click', '.delFav', (e) => {
            Mediator.publish('workflow:delFav', $(e.target)[0].dataset.id);
        });
    }
}

class WorkFlowBtn extends Component {
    constructor(data){
        config.data = data;
        super(config);
    }
}

export default WorkFlowBtn;