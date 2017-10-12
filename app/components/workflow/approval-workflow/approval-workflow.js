/**
 * @author qiumaoyun and luyang
 * 工作审批page body
 */

import Component from '../../../lib/component';
import template from './approval-workflow.html';
import './approval-workflow.scss';
import '../../../assets/scss/workflow/workflow-base.scss';
import Mediator from '../../../lib/mediator';
import WorkFlow from '../workflow-drawflow/workflow';
import WorkflowSeal from '../workflow-seal/workflow-seal';
import {workflowService} from '../../../services/workflow/workflow.service';
import msgBox from '../../../lib/msgbox';
import {PMAPI,PMENUM} from '../../../lib/postmsg';
import approvalOpinion from '../approval-opinion/approval-opinion'
import WorkFlowForm from '../workflow-form/workflow-form';
import WorkFlowGrid from '../workflow-grid/workflow-grid';

let serchStr = location.search.slice(1),nameArr=[],obj = {},focus=[],is_view,tree=[],staff=[];;
serchStr.split('&').forEach(res => {
    let arr = res.split('=');
    obj[arr[0]] = arr[1];
});
is_view=obj.btnType==='view'?1:0;

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
        wfDetail: {},
        focus: [],
    },
    actions:{

        /**
         * @author luyang 放大 缩小 全屏查看顶部节点图
         * @param el 顶部节点图 按钮 dom
         *
         */
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
            };
            switch (type){
                case 'zoomIn' :
                    let  nodeflowSize=this.data.nodeflowSize+= 0.1;
                    container.css({
                        height:`${nodeCssObj.height*nodeflowSize+'px'}`,
                        transform:`scale(${nodeflowSize})`,
                        transformOrigin:`${nodeCssObj.transformOrigin}`
                    });
                    break;
                case 'zoomOut' :
                    let  nodeflowSize1=this.data.nodeflowSize-= 0.1;
                    container.css({
                        height:`${nodeCssObj.height*nodeflowSize1+'px'}`,
                        transform:`scale(${nodeflowSize1})`,
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
        /**
         * @author luyang 克隆节点插入顶部，切换显示
         * @param el 当前点击按钮 type:follow-view 关注联系人，flow-view 流程节点 record-view：审批记录
         * @param appendDiv 添加到的dom
         */
        previewView:function (el,appendDiv) {
            let type=$(el).data("preview");
            let addFollow=this.el.find("#add-home").clone(true).attr('id','cloneId1');
            let flowNode=this.el.find("#flow-node").clone().attr('id','cloneId2');
            let workflowRecord=this.el.find("#workflow-record").clone().attr('id','cloneId3');
            switch (type){
                case 'follow-view' :
                    appendDiv.find(".preview-node1").html(addFollow);
                    $("#cloneId1").find('.add-follow').remove();
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
        /**
         *
         * @param pos 初始偏移
         * @param txt 提示框dom文字
         * @param event event对象
         */
        tipsMouseover:function (pos,txt,event) {
            if(txt!=''){
                let tooltip = $('<div id="J_tooltip"></div>');
                $("body").append(tooltip);
                let tooltipDiv=$("#J_tooltip");
                tooltipDiv.css({
                    top: (event.pageY+pos.y) + "px",
                    left:  (event.pageX+pos.x)  + "px"
                }).show("fast").text(txt);
            }
        },
        /**
         *
         * @param el 提示框dom对象
         */
        tipsMouseout:function (el) {
            el.remove()
        },
        /**
         *
         * @param pos 初始偏移
         * @param el 提示框dom对象
         * @param event event对象
         */
        tipsMousemove:function (pos,el,event) {
            el.css({
                top: (event.pageY+pos.y) + "px",
                left:  (event.pageX+pos.x)  + "px"
            })
        },
        toogz(ev){
           ev.toggle();
        },
        appPass() {
            Mediator.publish('workflow:appPass');
            PMAPI.openDialogByComponent(approvalOpinion,{
                width: 450,
                height: 300,
                title: '提示'
            }).then((res)=>{
                console.log(res);
                console.log("11111112222222222222")
                // if(res===true){
                //     Mediator.publish("approval:recordPass",this.data.imgInfo);
                // }
            })
        },
        appRejStart(){
            msgBox.confirm("确定驳回发起人").then((res)=>{
                if(res===true){
                    Mediator.publish('approval:recordRejStart',res);
                }
            })
        },
        appRejUp(){
            msgBox.confirm("确定驳回上一级").then((res)=>{
                if(res===true){
                    Mediator.publish('approval:appRejUp',res);
                }
            })
        },
        appRejAny(){
            // PMAPI.openDialogByComponent(ApprovalDialog, {
            //     width: 900,
            //     height: 600,
            //     title: '驳回到任意节点'
            // }).then((data) => {
            //
            // });
            PMAPI.openDialogByIframe('/iframe/approvalDialog/',
                {
                    title: '驳回任意节点',
                    width: '900',
                    height: '600',
                    modal: true,
                },
                {
                    flow_id:obj.flow_id,
                    record_id:obj.record_id
                }
            ).then(res=>{
                if(!res.onlyclose){
                    Mediator.publish('approval:rejToAny',res);
                }else {
                    this.el.find(".approval-btn-sel").removeClass('active');
                }
            });
            // this.el.find('.rejContainer').show();
            // this.el.find('.closeSpan').remove();
            // let container = this.el.find('.workflow-draw-box')[0];
            // container.style.transform = 'scale(1)';
            // container.id = "rej";
            // let e = document.documentElement, g = document.getElementsByTagName('body')[0], w = window.innerWidth || e.clientWidth || g.clientWidth, h = window.innerHeight || e.clientHeight || g.clientHeight;
            // container.style.position = "fixed";
            // container.style.top = "0";
            // container.style.left = "0";
            // container.style.right = "0";
            // container.style.bottom = "0";
            // container.style.backgroundColor = "#fff";
            // container.style.width = w + 'px';
            // container.style.height = h + 'px';
            // container.style.marginTop = 0;
            // container.style.margin = 0;
            // container.style.zIndex = '99';
            // container.style.overflow = 'auto';
            // let ocloseSpan = document.createElement('span');
            // ocloseSpan.className = 'closeSpan';
            // ocloseSpan.style['float'] = 'right';
            // ocloseSpan.style.cursor = 'pointer';
            // ocloseSpan.style.fontSize = '30px';
            // ocloseSpan.style.border = '1px solid #ddd';
            // ocloseSpan.innerHTML = '&nbsp;×&nbsp;';
            // ocloseSpan.addEventListener('click', (event) => {
            //     container.id = "";
            //     container.style.height ='100px';
            //     container.style.width = '100%';
            //     container.style.position = "relative";
            //     container.style.zIndex = '0';
            //     container.style.overflow = 'visible';
            //     ocloseSpan.style.display = 'none';
            // });
            // container.appendChild(ocloseSpan);
        },
        reApp(){
            Mediator.publish('approval:re-app');
        },
        addSigner(){
            this.el.find('.addUser').show();
            PMAPI.openDialogByIframe(`/iframe/addSigner/`,{
                width:1000,
                height:800,
                title:`加签节点`,
                modal:true
            }).then(res=>{
                if(!res.onlyclose){
                    Mediator.publish("approval:signUser",{
                        sigh_type:res.sigh_type,
                        sigh_user_id:res.sigh_user_id
                    });
                }
            })
        },
        workflowFocused: function (res) {
            if(res.length>0){
                this.el.on('click','#addFollower',()=>{
                    PMAPI.openDialogByIframe(`/iframe/addfocus/?${res}`,{
                        width:800,
                        height:620,
                        title:`添加关注人`,
                        modal:true
                    },{users:this.data.focus_users}).then(res=>{
                        if(!res.onlyclose){
                            let nameArr=[],idArr=[],htmlStr=[];
                            for(var k in res){
                                nameArr.push(res[k]);
                                htmlStr.push(`<span class="selectSpan">${res[k]}</span>`);
                                idArr.push(k);
                            }
                            this.el.find('#addFollowerList').html(htmlStr);
                            Mediator.publish('workflow:focus-users',idArr);
                            this.data.focus_users = res;
                        }
                    })
                });
            }else{
                this.el.on('click','#addFollower',()=>{
                    PMAPI.openDialogByIframe(`/iframe/addfocus/`,{
                        width:800,
                        height:620,
                        title:`添加关注人`,
                        modal:true
                    },{users:this.data.focus_users}).then(res=>{
                        if(!res.onlyclose){
                            let nameArr=[],idArr=[],htmlStr=[];
                            for(var k in res){
                                nameArr.push(res[k]);
                                htmlStr.push(`<span class="selectSpan">${res[k]}</span>`);
                                idArr.push(k);
                            }
                            this.el.find('#addFollowerList').html(htmlStr);
                            Mediator.publish('workflow:focus-users',idArr);
                            this.data.focus_users = res;
                        }
                    })
                });
            }
        }
    },
    afterRender(){
        this.showLoading();
        let __this=this;

        // workflowService.getWorkflowInfo({
        //     url: '/get_workflow_info/',
        //     data: {
        //         flow_id: obj.flow_id,
        //         record_id: obj.record_id
        //     }
        // }).then(res => {
        //     let a=res.data[0]['updateuser2focususer'];
        //     for(let i in a){
        //         for(let j in a[i]){
        //             this.data.focus.push(a[i][j]);
        //         }
        //     }
        //     this.actions.workflowFocused(this.data.focus);
        //     let wffComponent = new WorkFlowForm();
        //     wffComponent.actions.addImg(res);
        //     this.data.workflowData=res.data[0];
        //     WorkFlow.show(res.data[0],'#drawflow');
        // }); //zj

        Mediator.subscribe('workflow:gotWorkflowInfo', (msg)=> {
            this.data.workflowData=msg.data[0];
            WorkFlow.show(msg.data[0],'#drawflow');
        }); // zj

        this.el.on('click','.gz',()=>{
            let signature = $(".signature");
            this.actions.toogz(signature);
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
            this.actions.addSigner();
        });
        Mediator.subscribe("workflow:sendImgInfo",(e)=>{
            this.data.imgInfo=e;
        });
        const pos={x:10,y:20};
        this.el.on("mouseover","#cloneId3 .tipsText",function (e) {
            let elDiv=$(this);
            let elDivText=elDiv.text();
            __this.actions.tipsMouseover(pos,elDivText,e)
        });
        this.el.on("mouseout","#cloneId3 .tipsText",function () {
            let J_tooltip=$("#J_tooltip");
            __this.actions.tipsMouseout(J_tooltip)
        });
        this.el.on("mousemove","#cloneId3 .tipsText",function (e) {
            let J_tooltip=$("#J_tooltip");
            __this.actions.tipsMousemove(pos,J_tooltip,e)
        });
        Mediator.subscribe("workflow:aggridorform",(res)=>{
            if(res.record_info.is_batch==1){
                this.el.find("#workflow-grid").show();
                this.el.find("#workflow-form").hide();
            }
        });

        Mediator.subscribe("workflow:focused", (res) => {
            this.actions.workflowFocused(res);
        });

    }
};
class ApprovalWorkflow extends Component{
    constructor (data){
        super(config,data);
    }
}



export default {
    showDom(){
        return new Promise(function(resolve, reject){
            let component = new ApprovalWorkflow();
            let el = $('#approval-workflow');
            component.render(el);
            resolve(component);
        })

    },
    create(elem){
        return new Promise(function(resolve, reject){
            let component = new ApprovalWorkflow();
            let el = $(elem);
            component.render(el);
            resolve(component);
        })

    },

};

Mediator.subscribe("workflow:getStampImg",(msg)=>{
    WorkflowSeal.showheader(msg);
});
