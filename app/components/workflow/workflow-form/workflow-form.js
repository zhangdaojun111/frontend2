import Component from "../../../lib/component";
import template from './workflow-form.html';
import './workflow-form.scss';

import Mediator from '../../../lib/mediator';

let config = {
    template: template,
    actions: {
        animationToggle:function () {
            this.el.find(".place-form").slideToggle("slow",function () {})
        },
    },
    afterRender: function() {
        this.el.on('click','.collapseFormBtn',()=>{

            this.actions.animationToggle();
        })
    }
}

class WorkFlowForm extends Component {
    constructor(data){
        config.data = data;
        super(config);
    }
}

export default {
     showForm(data) {
        let component = new WorkFlowForm();
        let el = $('#workflow-form');
        component.render(el);
     }
};
