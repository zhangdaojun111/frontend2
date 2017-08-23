import Component from '../../lib/component';
import template from './approval-workflow.html';
import './approval-workflow.scss';
import '../../assets/scss/workflow/workflow-base.scss';
import Mediator from '../../lib/mediator';
import WorkFlow from './workflow-drawflow/workflow';
import WorkflowSeal from './workflow-seal/workflow-seal';
import {workflowService} from '../../services/workflow/workflow.service';
import msgBox from '../../lib/msgbox';
// import AddSigner from './add-signer';
import {PMAPI,PMENUM} from '../../lib/postmsg';

let config={
    template: template,
    data:{
        record_id:'',
        focus_users:[],
        action:0,
        comment:'',
        node_id:null,
        workflowData:null,
        sigh_user_id:'',
        nodeflowSize:1,

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

        previewViewBtn:function (el) {
            let type=$(el).attr('id');
            let container = this.el.find('#cloneId2').find('.workflow-draw-box');
            let container2 = this.el.find('#cloneId2').find('#drawflow').find('.content');
            let closeDiv=$('<div class="screenClose-btn">X</div>');
            let nodeCssObj={
                height:100,
                transformOrigin:'0% 0%'
            };
            let screenCssObj={
                transform: 'scale(1)',
                position:'fixed',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                backgroundColor: 'rgb(255, 255, 255)',
                width: '100%',
                height: '100%',
                overflow: 'auto',
            }
            switch (type){

                case 'zoomIn' :

                    var  nodeflowSize=this.data.nodeflowSize+= 0.1;
                    container.css({
                        height:`${nodeCssObj.height*nodeflowSize+'px'}`,
                        transform:`scale(${nodeflowSize})`,
                        transformOrigin:`${nodeCssObj.transformOrigin}`
                    });

                    break;
                case 'zoomOut' :
                    var  nodeflowSize=this.data.nodeflowSize-= 0.1;
                    container.css({
                        height:`${nodeCssObj.height*nodeflowSize+'px'}`,
                        transform:`scale(${nodeflowSize})`,
                        transformOrigin:`${nodeCssObj.transformOrigin}`
                    });
                    break;
                case 'newWin' :

                    let screenBtn=$('.screenClose-btn');
                    if(!screenBtn.length){
                        container2.append(closeDiv);
                    }else {
                        container.css({
                            transform: 'scale(1)',
                            position:'fixed',
                            top: '0',
                            left: '0',
                            right: '0',
                            bottom: '0',
                            backgroundColor: 'rgb(255, 255, 255)',
                            width: '100%',
                            height: '100%',
                            overflow: 'auto',
                        });
                        screenBtn.show();
                    }
                    container.css({
                        transform: 'scale(1)',
                        position:'fixed',
                        top: '0',
                        left: '0',
                        right: '0',
                        bottom: '0',
                        backgroundColor: 'rgb(255, 255, 255)',
                        width: '100%',
                        height: '100%',
                        overflow: 'auto',
                    });
                    screenBtn.show();
                    this.el.on("click",'.screenClose-btn',function (e) {
                        e.stopPropagation();
                        container.css({
                            height:'100px',
                            position:'relative',
                            top: '0',
                            left: '0',
                            right: '0',
                            bottom: '0',
                            backgroundColor: '#fff',
                            width: '100%',
                            overflow: 'auto',
                        }) ;
                        $(this).hide();
                    });
                    break;
            }
        },
        previewView:function (el,appendDiv) {
            let type=$(el).data("preview");
            let addFollow=this.el.find("#add-home").clone(true).attr('id','cloneId1');
            let flowNode=this.el.find("#flow-node").clone().attr('id','cloneId2');
            let workflowRecord=this.el.find("#workflow-record").clone().attr('id','cloneId3');
            switch (type){
                case 'follow-view' :
                    appendDiv.find(".preview-node1").html(addFollow);
                    appendDiv.find(".preview-node1").toggle().siblings().hide();
                    break;
                case 'flow-view' :

                    appendDiv.find(".preview-node2").html(flowNode);
                    $("#cloneId2").find('#togglePic').remove();
                    appendDiv.find(".preview-node2").toggle().siblings().hide();
                    break;
                case 'record-view' :
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
            Mediator.publish('workflow:appPass');
            msgBox.confirm("你确定审核通过吗").then((res)=>{
                if(res===true){
                    Mediator.publish("approval:recordPass",this.data.imgInfo);
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
            container.style.zIndex = '99';
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
        },
        reApp(){
            Mediator.publish('approval:re-app');
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
        });
        this.el.on('click','.close',function () {
            __this.el.find('.rejContainer').hide();
        });
        this.el.on('click',".preview-btn",function () {
            let appendDiv=__this.el.find("#preview-node");
            __this.actions.previewView($(this),appendDiv);
        });
        this.el.on("click",'.preview-node2 .previewBtn',function () {
            __this.actions.previewViewBtn($(this))
        });
        this.el.on('click','#app-pass',function () {
            __this.actions.appPass();
        });
        this.el.on('click','#app-rej-start',function (e) {
            console.log('dsdfsdsfdsf')
            e.stopPropagation();
            __this.actions.appRejStart();
        });
        this.el.on('click','#app-rej-up',function (e) {
            e.stopPropagation();
            __this.actions.appRejUp();
        });
        this.el.on('click','#app-rej-any',function (e) {
            e.stopPropagation();
            __this.actions.appRejAny();
        });
        this.el.on('click','#re-app',function (e) {
            __this.actions.reApp();
        });

        this.el.on('click','#rej .draged-item',function(){
            WorkFlow.rejectNode(this);
        });
        this.el.on('click','#app-add',()=>{
            this.el.find('.addUser').show();
            PMAPI.openDialogByIframe(`/iframe/addSigner/`,{
                width:1000,
                height:800,
                title:`加签节点`,
                modal:true
            }).then(res=>{
                if(!res.onlyclose){
                    console.log(res);
                    Mediator.publish("approval:signUser",{
                        sigh_type:res.sigh_type,
                        sigh_user_id:res.sigh_user_id
                    });
                }
            })
        });
        Mediator.subscribe("workflow:sendImgInfo",(e)=>{
            this.data.imgInfo=e;
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
    WorkflowSeal.showheader(msg);
})
