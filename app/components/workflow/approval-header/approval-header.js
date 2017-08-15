import Component from '../../../lib/component';
import template from './approval-header.html';
import './approval-header.scss';

import Mediator from '../../../lib/mediator';


let config = {
    template: template,
    data: {

    },
    actions: {
        approvalBtnToggle:function (el) {
            if(el.parent().hasClass('active')){
                el.parent().removeClass('active')
            }else {
                el.parent().addClass('active')
            }
        }
    },
    afterRender: function() {
        let self=this;
        this.el.on("click",".approval-curr-txt",function (e) {
            e.stopPropagation();
            self.actions.approvalBtnToggle($(this))
        })
    },
    beforeDestory: function(){

    }
}

class ApprovalHeader extends Component{
    constructor (data){
        super(config,data);
    }

}

export default {
    showheader(data){
        let component = new ApprovalHeader(data);
        let el = $('#approval-info');
        component.render(el);
    },
};