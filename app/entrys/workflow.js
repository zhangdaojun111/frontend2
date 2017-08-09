
import '../assets/scss/main.scss';
import 'jquery-ui/ui/widgets/button.js';
import 'jquery-ui/ui/widgets/dialog.js';

import {HTTP} from '../lib/http';
import Mediator from '../lib/mediator';
import {workflowService} from '../services/workflow/workflow.service';
import WorkFlowCreate from '../components/workflow/workflow-create/workflow-create';
import WorkflowRecord from '../components/workflow/approval-record/approval-record';
import WorkflowInitial from '../components/workflow/workflow-initial';
import WorkFlowForm from '../components/workflow/workflow-form/workflow-form';
import ApprovalHeader from '../components/workflow/approval-header/approval-header';

import ApprovalWorkflow from '../components/workflow/approval-workflow';

import WorkflowAddFollow from '../components/workflow/workflow-addFollow/workflow-addFollow';

import FormEntrys from './form';
import TreeView from  '../components/util/tree/tree';

WorkFlowForm.showForm();


let WorkFlowList=workflowService.getWorkfLow({}),
    FavWorkFlowList=workflowService.getWorkfLowFav({});


Promise.all([WorkFlowList,FavWorkFlowList]).then(res=>{
    WorkFlowCreate.loadData(res);
});

HTTP.flush();

//订阅workflow choose事件，获取工作流info并发布getInfo,获取草稿
Mediator.subscribe('workflow:choose', (msg)=> {
    (async function () {
        return workflowService.getWorkflowInfo({url: '/get_workflow_info/?seqid=qiumaoyun_1501661055093&record_id=',data:{
            flow_id:msg.id
        }});
    })().then(res=>{
            Mediator.publish('workflow:gotWorkflowInfo', res);
            return workflowService.validateDraftData({form_id:msg.formid});
        })
        .then(res=>{
            if(res.the_last_draft!=''){
                $( "#dialog-confirm" ).dialog({
                    title:'提示',
                    resizable: false,
                    height: "auto",
                    width: 400,
                    modal: true,
                    buttons: {
                        "确认": function() {
                            $( this ).dialog( "close" );
                            //todo get draft info
                            $("#dialog-confirm").html('');
                        },
                        "取消": function() {
                            $( this ).dialog( "close" );
                            $("#dialog-confirm").html('');
                        }
                    }
                });
                $("#dialog-confirm").append(`<p><span class="ui-icon ui-icon-alert"></span>
                    您于${res.the_last_draft}时填写该工作表单尚未保存，是否继续编辑？
                </p>`);

            }else{
                alert('there is no draft');
            }
            $("#workflow-create").append(`<button id="submit" class="ui-button ui-widget ui-corner-all">提交</button>`);
        }).then(()=>{
        console.log(`tableid:${msg.tableid}`);
        // FormEntrys.createForm({
        //     table_id:msg.tableid,
        //     el:'#place-form',
        //     is_view:1,
        //     real_id:''
        // });
    })

});

//订阅收藏常用workflow
Mediator.subscribe('workflow:addFav', (msg)=> {
    (async function () {
        let data = await workflowService.addWorkflowFavorite({'id': msg});
    })();
});

//订阅删除常用workflow
Mediator.subscribe('workflow:delFav', (msg)=> {
    (async function () {
        let data = await workflowService.delWorkflowFavorite({'id': msg});
    })();
});


//审批工作流

ApprovalHeader.showheader();

(async function () {
    return workflowService.getWorkflowInfo({url: '/get_workflow_info/?seqid=qiumaoyun_1501661055093&record_id=',data:{
        flow_id:30
    }});
})().then(res=>{
    console.log(res);
    Mediator.publish('workflow:gotImgInfo', res);
    Mediator.publish('workflow:gotWorkflowInfo', res);
});

let tree=[];
(async function () {
    return workflowService.getStuffInfo({url: '/save_perm/?perm_id=0'});
})().then(res=>{
    tree=res.data.department_tree;

    function recur(data) {
        console.log(data);
        for (let item of data){
            console.log(item);
            item.nodes=item.children;
            if(item.children.length!==0){
                recur(item.children);
            }
        }
    }
    recur(tree);


    var treeComp2 = new TreeView(tree,function (event,selectedNode) {
        console.log("选中节点："+selectedNode.text);
        // console.dir(selectedNode);
    },'MULTI_SELECT',true,'tree3');
    treeComp2.render($('#treeMulti'));
});

WorkflowRecord.showRecord();

//获取盖章图片
Mediator.subscribe("workflow:getStampImg",(msg)=>{
    (async function () {
        let data = await workflowService.getStmpImg(msg);
        console.log(msg)
    })();
});

Mediator.subscribe("workflow:seal",(msg)=>{
    (async function () {
        let data = await workflowService.addStmpImg(msg);
    })();
});

//删除或添加盖章图片之后重新加载图片
Mediator.subscribe("workflow:getStamp",(msg)=>{
    (async function () {
        return workflowService.getStmpImg();
    })().then(res=>{
        Mediator.publish("workflow:changeImg",res);
    });
})
//删除图片
Mediator.subscribe("workflow:delImg",(msg)=>{
    (async function () {
        let data = await workflowService.delStmpImg(msg);
    })();
});
