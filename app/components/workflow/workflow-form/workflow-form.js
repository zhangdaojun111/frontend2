import Component from "../../../lib/component";
import template from './workflow-form.html';
import './workflow-form.scss';

import Mediator from '../../../lib/mediator';

let config = {
    template: template,
    actions: {
        animation:function () {
            let formUp = $('.place-form');
            let formtip = formUp.hasClass("show");
            console.log(formUp);
            if(formtip){
                formUp.addClass("hide");
                formUp.removeClass("show");
            }else{
                formUp.addClass("show");
                formUp.removeClass("hide");
            }
        },
    },
    afterRender: function() {
        this.el.on('click','.collapseFormBtn',()=>{

            this.actions.animation();
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
