
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
import WorkFlowGrid from '../components/workflow/workflow-grid/workflow-grid';
import ApprovalHeader from '../components/workflow/approval-header/approval-header';
import ApprovalWorkflow from '../components/workflow/approval-workflow';
import WorkflowAddFollow from '../components/workflow/workflow-addFollow/workflow-addFollow';
import FormEntrys from './form';
import TreeView from  '../components/util/tree/tree';
import msgBox from '../lib/msgbox';


WorkFlowForm.showForm();
WorkFlowGrid.showGrid();

let WorkFlowList=workflowService.getWorkfLow({}),
    FavWorkFlowList=workflowService.getWorkfLowFav({});


Promise.all([WorkFlowList,FavWorkFlowList]).then(res=>{
    WorkFlowCreate.loadData(res);
});

HTTP.flush();

//订阅workflow choose事件，获取工作流info并发布getInfo,获取草稿
let wfObj;
Mediator.subscribe('workflow:choose', (msg)=> {
    wfObj=msg;
    (async function () {
        return workflowService.getWorkflowInfo({url: '/get_workflow_info/?seqid=qiumaoyun_1501661055093&record_id=',data:{
            flow_id:msg.id
        }});
    })()
    .then(res=>{
        Mediator.publish('workflow:gotWorkflowInfo', res);
        return workflowService.validateDraftData({form_id:msg.formid});
    })
    .then(res=>{
        if(res.the_last_draft!=''){
            return msgBox.confirm(`您于${res.the_last_draft}时填写该工作表单尚未保存，是否继续编辑？`)
        }else{
            return 0;
        }
    })
    .then((is_draft)=>{
        //auto saving draft  草稿自动保存
        is_draft=is_draft==true?1:0;
        $('#place-form').html('');
        FormEntrys.createForm({
            reload_draft_data:is_draft,
            table_id:msg.tableid,
            el:'#place-form',
            real_id:'',
            from_workflow:1,
            form_id:msg.formid
        });

        const intervalSave= async function (data) {
            let postData={
                flow_id:msg.id,
                is_draft:1,
                data:{}
            };
            postData.data=JSON.stringify(data);
            let res = await workflowService.createWorkflowRecord(postData);
            console.log(res);
            if(res.success===1){
                msgBox.alert('自动保存成功！');
            }
        };
        var timer;
        const autoSaving=function(){
            timer=setInterval(()=>{
                intervalSave(FormEntrys.getFormValue());
            },2*60*1000);
        };
        // autoSaving();
        Mediator.subscribe('workflow:autoSaveOpen', (msg)=> {
            clearInterval(timer);
            if(msg===1){
                autoSaving();
            }else{
                clearInterval(timer);
            }
        })
    })
    
});

Mediator.subscribe('workflow:submit', (res)=> {
    let formData=FormEntrys.getFormValue(),
        postData={
        flow_id:wfObj.id,
        is_draft:1,
        focus_users:JSON.stringify(res)||[],
        data:JSON.stringify(formData)
    };
    (async function () {
        let data = await workflowService.createWorkflowRecord(postData);
        alert(`error:${data.error}`);
    })();
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



(async function () {
    return workflowService.getWorkflowInfo({url: '/get_workflow_info/?seqid=qiumaoyun_1501661055093&record_id=',data:{
        flow_id:30
    }});
})().then(res=>{
    Mediator.publish('workflow:gotWorkflowInfo', res);
});

let tree=[];
let staff=[];
(async function () {
    return workflowService.getStuffInfo({url: '/save_perm/?perm_id=0'});
})().then(res=>{
    tree=res.data.department_tree;
    staff=res.data.department2user;
    function recur(data) {
        for (let item of data){
            item.nodes=item.children;
            if(item.children.length!==0){
                recur(item.children);
            }
        }
    }
    recur(tree);
    console.log(staff);

    var treeComp2 = new TreeView(tree,{
        callback: function (event,selectedNode) {
                for(var k in staff){
                    if(k==selectedNode.id){
                        if(event==='select'){
                            Mediator.publish('workflow:checkDept', staff[k]);
                        }else{
                            Mediator.publish('workflow:unCheckDept', staff[k]);
                        }
                    }
                }
        },
        treeType:'MULTI_SELECT',
        isSearch: true
        });
    treeComp2.render($('#treeMulti'));
});



FormEntrys.createForm({
    el:"#place-form",
    form_id:181,
    record_id:'59897efb53930b8ca98a3446',
    is_view:0,
    from_approve:1,
    from_focus:0,
    table_id:'5318_EHFuJD7Ae76c6GMPtzdiWH'
}).then((res)=>{
        ApprovalHeader.showheader(res);
        WorkflowRecord.showRecord(res);
});
// function getRecordObj () {
//     return new Promise(function (resolve, reject) {
//         setTimeout(()=>{
//             resolve(FormEntrys.ReturnRecordInfo());
//         },1000)
//     });
// }
// getRecordObj().then(function (res) {
//     ApprovalHeader.showheader(res);
//     WorkflowRecord.showRecord(res);
//
// })

// let data = new Promise(function (resolve) {
//     setTimeout(function () {
//        resolve(FormEntrys.ReturnRecordInfo())
//     }, 2000);
// });
//
// Promise.all([data]).then((res)=>{
//        console.log(res)
// })




//获取盖章图片
Mediator.subscribe("workflow:getStampImg",(msg)=>{
    (async function () {
        let data = await workflowService.getStmpImg(msg);
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