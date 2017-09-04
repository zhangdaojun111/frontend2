/**
 *@author qiumaoyun
 *发起工作流主要逻辑
 */
import '../assets/scss/main.scss';
import 'jquery-ui/ui/widgets/button.js';
import 'jquery-ui/ui/widgets/dialog.js';

import {HTTP} from '../lib/http';
import Mediator from '../lib/mediator';
import {workflowService} from '../services/workflow/workflow.service';

import WorkflowInitial from '../components/workflow/workflow-initial/workflow-initial';
import WorkFlow from '../components/workflow/workflow-drawflow/workflow';
import WorkFlowForm from '../components/workflow/workflow-form/workflow-form';
import WorkFlowGrid from '../components/workflow/workflow-grid/workflow-grid';
import WorkflowAddFollow from '../components/workflow/workflow-addFollow/workflow-addFollow/workflow-addFollow';
import FormEntrys from './form';
import TreeView from  '../components/util/tree/tree';
import msgBox from '../lib/msgbox';
import Grid from '../components/dataGrid/data-table-page/data-table-agGrid/data-table-agGrid';
import jsplumb from 'jsplumb';

WorkflowAddFollow.showAdd();

WorkFlowForm.showForm();
WorkFlowGrid.showGrid();





/*
***订阅workflow choose事件，获取工作流info并发布getInfo,获取草稿
 */
let wfObj,temp_ids=[];
let timer ;
Mediator.subscribe('workflow:choose', (msg)=> {
    $("#singleFlow").click();
    $("#submitWorkflow").show();
    $("#startNew").hide();
    wfObj=msg;
    (async function () {
        WorkFlow.createFlow({flow_id:msg.id,el:"#flow-node"});
        return workflowService.validateDraftData({form_id:msg.formid});
    })()
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
            flow_id:msg.id,
            el:$('#place-form'),
            real_id:'',
            from_workflow:1,
            form_id:msg.formid,
            btnType:'none',
            is_view:0
        });
        const intervalSave= async function (data) {
            let postData={
                flow_id:msg.id,
                is_draft:1,
                data:{}
            };
            postData.data=JSON.stringify(data);
            let res = await workflowService.createWorkflowRecord(postData);
            if(res.success===1){
                msgBox.alert('自动保存成功！');
            }
        };
        // let timer;
        const autoSaving=function(){
            timer=setInterval(()=>{
                intervalSave(FormEntrys.getFormValue(wfObj.tableid));
            },2*60*1000);
        };
        clearInterval(timer);
        autoSaving();
        Mediator.subscribe("workflow:contentClose",()=>{
            clearInterval(timer);
        })
        Mediator.subscribe('workflow:autoSaveOpen', (msg)=> {
            clearInterval(timer);
            if(msg===1){
                autoSaving();
            }
        })
        $(window).on('focus',function(){
            clearInterval(timer);
            autoSaving();
        });
        $(window).on('blur',function(){
            clearInterval(timer);
        });
    });

    // (async function () {
    //     return workflowService.getGridinfo({
    //         table_id:wfObj.tableid,
    //         formId:wfObj.formid,
    //         is_view:0,
    //         parent_table_id:null,
    //         parent_real_id:null,
    //         parent_temp_id:null,
    //
    //     });
    // })().then(function (res) {
    //     let AgGrid=new Grid({
    //         parentTempId:temp_id,
    //         tableId:res.table_id,
    //         viewMode:"createBatch"
    //     });
    //     AgGrid.actions.returnBatchData = function (ids) {
    //         temp_ids=ids;
    //     };
    //     AgGrid.render($("#J-aggrid"));
    // })

});

/**
 * 点击初始化批量工作流
 */
Mediator.subscribe('workflow:getGridinfo',(res)=>{
    (async function () {
        return workflowService.getGridinfo({
            table_id:wfObj.tableid,
            formId:wfObj.formid,
            is_view:0,
            parent_table_id:null,
            parent_real_id:null,
            parent_temp_id:null,

        });
    })().then(function (res) {
        let AgGrid=new Grid({
            parentTempId:temp_id,
            tableId:res.table_id,
            viewMode:"createBatch"
        });
        AgGrid.actions.returnBatchData = function (ids) {
            temp_ids=ids;
        };
        AgGrid.render($("#J-aggrid"));
    })
})


/*
***submit workflow data 提交工作流
 */
let focusArr=[];
Mediator.subscribe('workflow:focus-users', (res)=> {
    focusArr=res;
})
Mediator.subscribe('workflow:submit', (res)=> {
    if($("#workflow-form:visible").length>0){
        let formData=FormEntrys.getFormValue(wfObj.tableid);
        if(formData.error){
            msgBox.alert(`${formData.errorMessage}`);
        }else{
            $("#submitWorkflow").hide();
            let postData={
                flow_id:wfObj.id,
                focus_users:JSON.stringify(focusArr)||[],
                data:JSON.stringify(formData)
            };
            (async function () {
                return await workflowService.createWorkflowRecord(postData);
            })().then(res=>{
                if(res.success===1){
                    msgBox.alert(`${res.error}`);
                    $("#startNew").show().on('click',()=>{
                        Mediator.publish('workflow:choose',wfObj);
                        $("#startNew").hide();
                        $("#submitWorkflow").show();
                    });
                    WorkFlow.createFlow({flow_id:wfObj.id,record_id:res.record_id,el:"#flow-node"});
                }else{
                    msgBox.alert(`${res.error}`);
                    $("#submitWorkflow").show();
                }
            })
        }
    }else{
        $("#submitWorkflow").hide();
        let postData={
            type:1,
            temp_ids:JSON.stringify(temp_ids),
            flow_id:wfObj.id,
            unique_check:0
        };
        (async function () {
            return await workflowService.createWorkflowRecord(postData);
        })().then(res=>{
            if(res.success===1){
                msgBox.alert(`${res.error}`);
                $("#startNew").show().on('click',()=>{
                    Mediator.publish('workflow:choose',wfObj);
                    $("#startNew").hide();
                    $("#submitWorkflow").show();
                });
                WorkFlow.createFlow({flow_id:wfObj.id,record_id:res.record_id,el:"#flow-node"});
            }else{
                msgBox.alert(`${res.error}`);
                $("#submitWorkflow").show();
            }
        })
    }
    
});
let temp_id=``;
Mediator.subscribe('workFlow:record_info', (res) => {
    temp_id=res.data.temp_id.value;
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

//Grid
$('#multiFlow').on('click',()=>{
    
})
