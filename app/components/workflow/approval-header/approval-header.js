/**
 * @author qiumaoyun and luyang
 * 工作审批header
 */

import Component from '../../../lib/component';
import template from './approval-header.html';
import './approval-header.scss';
import Mediator from '../../../lib/mediator';
import {PMAPI} from '../../../lib/postmsg';
import VoteConfirm from '../vote-confirm/vote-confirm'

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
        if(this.data.is_batch) {
            this.el.find('.gz').hide();
        }
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
	    this.el.on('click','.vote',(e)=>{
	    	VoteConfirm.data.nodeData=this.data.nodeData;
	    	VoteConfirm.data.nodeTip=this.data.nodeTip;
		    PMAPI.openDialogByComponent(VoteConfirm,{
			    title: '请投票',
			    maxable: false,
			    modal: true,
			    width:300,
			    height:300,
		    }).then(res=>{
			    if(res && res.value){
					Mediator.publish('workflow:voteconfirm',{value:res.value,submitKey:this.data.submitKey});
			    }
		    })
	    });
	    Mediator.subscribe('workflow:gotWorkflowInfo',(res)=>{
		    for(let index in res.data[0].node){
			    let data=res.data[0].node[index];
			    if(data.multi_handlers && data.multi_handlers.split(',').join('') == this.data.current_node.split('、').join('') && data.handler_relation=='2' && data.state == 1){
				    this.data.nodeData=data['vote_option'];
				    this.data.submitKey=[];
				    for(let key in this.data.nodeData){
				    	if(key != ''){
				    		this.data.submitKey.push(this.data.nodeData[key]);
					    }
				    }
				    this.data.nodeTip=data['vote_tip'];
				    this.el.find('.approval-control').empty();
				    this.el.find('.approval-control').append($('<div class="vote approval-btn approval-pass for-hide">投票</div>'));
				    break;
			    }
		    }
		    this.el.find('.approval-control').show();
	    })
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