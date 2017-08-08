import Component from "../../../lib/component";
import template from './workflow-form.html';
import './workflow-form.scss';

import Mediator from '../../../lib/mediator';

let config = {
    template: template,
    actions: {
        showImgDel(e){
            let ev = $(e.target).children('i');
            console.log(e.target);
            ev.css("display","block");
        },
        hideImgDel(e){
            let ev = $(e.target).children('i');
            console.log(e.target);
            ev.css("display","none");
        }
    },
    afterRender: function() {
        this.el.on('click','.collapseFormBtn',()=>{
            this.el.find(".place-form").toggle();
        })
        this.el.on("mouseover",".imgseal",(e)=>{
            this.actions.showImgDel(e);
        }),
        this.el.on("mouseleave",'.imgseal',(e)=>{
            this.actions.hideImgDel(e);
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
