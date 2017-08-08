
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
import msgBox from '../lib/msgbox';

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
            let is_draft=0;
            if(res.the_last_draft!=''){
                var a=msgBox.confirm('asdasd')
                a.then(res=>{
                    console.log("res:"+res);
                },rej=>{
                    console.log("rej:"+rej);
                })
                // $( "#dialog-confirm" ).dialog({
                //     title:'提示',
                //     resizable: false,
                //     height: "auto",
                //     width: 400,
                //     modal: true,
                //     buttons: {
                //         "确认": function() {
                //             $( this ).dialog( "close" );
                //             //todo get draft info
                //             is_draft=1;
                //         },
                //         "取消": function() {
                //             $( this ).dialog( "close" );
                //             is_draft=0;
                //         }
                //     }
                // });
                // $("#dialog-confirm").html('');
                
                // $("#dialog-confirm").append(`<p><span class="ui-icon ui-icon-alert"></span>
                //     您于${res.the_last_draft}时填写该工作表单尚未保存，是否继续编辑？
                // </p>`);


            }else{
                is_draft=0;
                alert('there is no draft,没有草稿');
            }
        }).then((is_draft)=>{
        console.log(`tableid:${msg.tableid}`);
        $('#place-form').html('');
        FormEntrys.createForm({
            reload_draft_data:is_draft,
            table_id:msg.tableid,
            el:'#place-form',
            is_view:1,
            real_id:''
        });
        
        $("#workflow-create").append(`<button id="submitWF" class="ui-button ui-widget ui-corner-all">提交</button>`);
        
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
    Mediator.publish('workflow:gotWorkflowInfo', res);
});

let tree=[];
(async function () {
    return workflowService.getStuffInfo({url: '/save_perm/?perm_id=0'});
})().then(res=>{
    tree=res.data.department_tree;

    function recur(data) {
        for (let item of data){
            item.nodes=item.children;
            if(item.children.length!==0){
                recur(item.children);
            }
        }
    }
    recur(tree);


    var treeComp2 = new TreeView(tree,{
        callback: function (event,selectedNode) {
            console.log(selectedNode.id);
            // console.dir(selectedNode);
        },
        treeType:'MULTI_SELECT',
        isSearch: true
        });
    treeComp2.render($('#treeMulti'));
});

WorkflowRecord.showRecord();

