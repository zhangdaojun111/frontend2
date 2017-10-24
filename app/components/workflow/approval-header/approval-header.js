/**
 * @author qiumaoyun and luyang
 * 工作审批header
 */

import Component from '../../../lib/component';
import template from './approval-header.html';
import './approval-header.scss';
import Mediator from '../../../lib/mediator';

let config = {
    template: template,
    data: {

    },
    actions: {
        approvalBtnToggle:function (el,elPraent) {
            let isactive=elPraent.hasClass('active');
            if(isactive){
                elPraent.removeClass('active')
            }else {
                elPraent.addClass('active')
            }
        },
        toogz(e){
            this.el.find(".signature").toggle();
            this.showgz = !this.showgz;
        },
    },
    /**
     * @author luyang
     * @method approvalBtnToggle 审批按钮操作显示
     * @param  approvalBtnToggle(dom对象，dom父元素)
     */
    afterRender: function() {
        this.showLoading();
        let self=this;
        this.showgz = false;
        this.el.on("click",".approval-curr-txt",function (e) {
            e.stopPropagation();
            let elDiv=$(this);
            let elParent=elDiv.parent();
            self.actions.approvalBtnToggle(elDiv,elParent);
        });
        this.el.on('click','.gz',(e)=>{
            Mediator.publish('workflow:getFormTrans',this.showgz);
            this.actions.toogz(e);
        });
        Mediator.publish('workflow:loaded', 1);
    },
    beforeDestory: function(){

    }
}

class ApprovalHeader extends Component{
    // constructor (data){
    //     super(config,data);
    // }

    constructor(data,newConfig){
        super($.extend(true,{},config,newConfig,{data:data||{}}));
    }
}

export default {
    showheader(data){
        let component = new ApprovalHeader(data);
        let el = $('#approval-info');
        component.render(el);
        component.hideLoading();
    },
};