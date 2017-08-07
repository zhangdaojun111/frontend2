import Component from '../../../lib/component';
import template from './workflow-seal.html';
import './workflow-seal.scss';

import Mediator from '../../../lib/mediator';


let config = {
    template: template,
    data: {
        // "file_ids": ["5987de19c3ec2134050ee679", "5987de3244543b4d1226c977", "5987fe3e8e368f5747b1722c"]
    },
    actions: {
        addImg(e){
            let imgFile = this.el.find('.J_add')[0].files[0]; 
           
            if(imgFile){
                let FR = new FileReader();
                FR.onload = function (event){
                    var imgstr = event.target.result;
                    console.log(imgstr);
                };
                FR.readAsDataURL(imgFile);
            }
        }
    },
    afterRender: function() {
        this.el.on('change','.J_add',(e)=>{
            this.actions.addImg(e);
        })
    },
    beforeDestory: function(){

    }
}

class WorkflowSeal extends Component{
    constructor (data){
        console.log(data);
        super(config,data);
    }
}

export default {
    showheader(data){
        console.log(data);
        let component = new WorkflowSeal(data);
        let el = $('#workflow-seal');
        component.render(el);
    },
};