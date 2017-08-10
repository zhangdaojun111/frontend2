import Component from '../../lib/component';
import template from './approval-workflow.html';
import './approval-workflow.scss';
import Mediator from '../../lib/mediator';
import WorkFlow from './workflow-drawflow/workflow';
import WorkflowSeal from './workflow-seal/workflow-seal';
import {workflowService} from '../../services/workflow/workflow.service';
import msgBox from '../../lib/msgbox';
let config={
    template: template,
    data:{
        record_id:'',
        focus_users:[],
        action:0,
        comment:'',
        node_id:null,
        workflowData:null
    },
    actions:{
        approveWorkflow (__this){
            (async function () {
                return workflowService.approveWorkflowRecord({
                    url: '/approve_workflow_record/?seqid=qiumaoyun_1502093694205&record_id=598819d246e8e4283ced51bd',
                    data:__this.data
                });
            })().then(res=>{
                console.log(res);
            })
        },
        previewView:function (el,appendDiv,addFollow) {
            let type=$(el).data("preview");


            switch (type){
                case 'follow-view' :
                    let addFollow=this.el.find(".workflow-foot #add-follow").clone(true);
                    appendDiv.find(".preview-node1").html(addFollow);
                    appendDiv.find(".preview-node1").toggle().siblings().hide();
                    break;
                case 'flow-view' :
                    let flowNode=this.el.find(".workflow-foot #flow-node").clone();
                    appendDiv.find(".preview-node2").html(flowNode);
                    appendDiv.find(".preview-node2").toggle().siblings().hide();
                    break;
                case 'record-view' :
                    let workflowRecord=this.el.find(".workflow-record #workflow-record").clone();
                    appendDiv.find(".preview-node3").html(workflowRecord);
                    appendDiv.find(".preview-node3").toggle().siblings().hide();
                    break;
            }
        },
        toogz(e){
            let ev = this.el.find(".signature");
            if(ev.css("display")=="none"){
                ev.css("display","block");
            }else{
                ev.css("display","none");
            }
        },
        appPass() {
            msgBox.confirm("你确定审核通过吗").then((res)=>{
                if(res===true){
                    Mediator.publish('approval:recordPass',res);
                }
            })
        },
        appRejStart(){
            msgBox.confirm("你确定驳回发起人吗").then((res)=>{
                if(res===true){
                    Mediator.publish('approval:recordRejStart',res);
                }
            })
        },
        appRejUp(){
            msgBox.confirm("你确定驳回上一级吗").then((res)=>{
                if(res===true){
                    Mediator.publish('approval:appRejUp',res);
                }
            })
        },
        appRejAny(){
            this.el.find('.rejContainer').show();
            WorkFlow.show(this.data.workflowData,'#rejWf');
        }

    },
    afterRender(){
        
        let __this=this;
        Mediator.subscribe('workflow:gotWorkflowInfo', (msg)=> {
            this.data.workflowData=msg.data[0];
            WorkFlow.show(msg.data[0],'#drawflow');
        });
      
        this.el.on('click','.gz',(e)=>{
            this.actions.toogz(e);
        })


        this.el.on('click','.close',function () {
            __this.el.find('.rejContainer').hide();
        });
        this.el.on('click',".preview-btn",function () {
            let appendDiv=__this.el.find("#preview-node");
            __this.actions.previewView($(this),appendDiv);
        });
        this.el.on('click','#app-pass',function () {
            __this.actions.appPass();
        });
        this.el.on('click','#app-rej-start',function () {
            __this.actions.appRejStart();
        });
        this.el.on('click','#app-rej-up',function () {
            __this.actions.appRejUp();
        });
        this.el.on('click','#app-rej-any',function () {
            __this.actions.appRejAny();
        });
        this.el.on('click','#rejWf .draged-item',function(){
            WorkFlow.rejectNode(this);
        });

    }
};
class ApprovalWorkflow extends Component{
    constructor (data){
        super(config,data);
    }
}

let component = new ApprovalWorkflow();
let el = $('#approval-workflow');
component.render(el);

Mediator.subscribe("workflow:getStampImg",(msg)=>{
    console.log(msg);
    WorkflowSeal.showheader(msg);
})
