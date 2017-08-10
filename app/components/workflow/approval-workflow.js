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
            // this.el.find('.rejContainer').show();
            this.el.find('.closeSpan').remove();
            let container = this.el.find('.workflow-draw-box')[0];
            container.style.transform = 'scale(1)';
            container.id = "rej";
            let e = document.documentElement, g = document.getElementsByTagName('body')[0], w = window.innerWidth || e.clientWidth || g.clientWidth, h = window.innerHeight || e.clientHeight || g.clientHeight;
            container.style.position = "fixed";
            container.style.top = "0";
            container.style.left = "0";
            container.style.right = "0";
            container.style.bottom = "0";
            container.style.backgroundColor = "#fff";
            container.style.width = w + 'px';
            container.style.height = h + 'px';
            container.style.marginTop = 0;
            container.style.margin = 0;
            container.style.zIndex = '100';
            container.style.overflow = 'auto';
            let ocloseSpan = document.createElement('span');
            ocloseSpan.className = 'closeSpan';
            ocloseSpan.style['float'] = 'right';
            ocloseSpan.style.cursor = 'pointer';
            ocloseSpan.style.fontSize = '30px';
            ocloseSpan.style.border = '1px solid #ddd';
            ocloseSpan.innerHTML = '&nbsp;×&nbsp;';
            ocloseSpan.addEventListener('click', (event) => {
                container.id = "";
                container.style.height ='100px';
                container.style.width = '100%';
                container.style.position = "relative";
                container.style.zIndex = '0';
                container.style.overflow = 'visible';
                ocloseSpan.style.display = 'none';
            });
            container.appendChild(ocloseSpan);
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
        this.el.on('click','#rej .draged-item',function(){
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
