
import '../assets/scss/main.scss';
import 'jquery-ui/ui/widgets/button.js';
import 'jquery-ui/ui/widgets/dialog.js';

import {HTTP} from '../lib/http';
import Mediator from '../lib/mediator';
import {workflowService} from '../services/workflow/workflow.service';
import WorkFlowCreate from '../components/workflow/workflow-create/workflow-create';
import WorkflowInitial from '../components/workflow/workflow-initial';
import WorkFlowForm from '../components/workflow/workflow-form/workflow-form';
import WorkFlowGrid from '../components/workflow/workflow-grid/workflow-grid';
import WorkflowAddFollow from '../components/workflow/workflow-addFollow/workflow-addFollow';
import FormEntrys from './form';
import TreeView from  '../components/util/tree/tree';
import msgBox from '../lib/msgbox';
import WorkFlow from '../components/workflow/workflow-drawflow/workflow';
import Grid from '../components/dataGrid/data-table-page/data-table-page';


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
        return workflowService.getWorkflowInfo({url: '/get_workflow_info/',data:{
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
            form_workflow:1,
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
        autoSaving();
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
    })

});
//submit workflow data 提交工作流
Mediator.subscribe('workflow:submit', (res)=> {
    $("#submit").hide();
    let formData=FormEntrys.getFormValue(wfObj.tableid),
        postData={
        flow_id:wfObj.id,
        focus_users:JSON.stringify(res)||[],
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
                $("#submit").show();
            });
            (async function () {
                return workflowService.getWorkflowInfo({url: '/get_workflow_info/',data:{
                    flow_id:wfObj.id,
                    record_id:res.record_id
                }});
            })().then(data=>{
                Mediator.publish('workflow:gotWorkflowInfo', data);
            });
        };
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



//请求部门员工信息，加载树
let tree=[];
let staff=[];
function recursion(arr,slnds,pubInfo){
    if(slnds.nodes.length!==0){
        for(var j in arr){
            slnds.nodes.forEach(child=>{
                if(j==child.id){
                    Mediator.publish(`workflow:${pubInfo}`, arr[j]);
                    recursion(arr,child,pubInfo)
                }
            });
        }
    }
}
(async function () {
    return workflowService.getStuffInfo({url: '/get_department_tree/'});
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
    var treeComp2 = new TreeView(tree,{
        callback: function (event,selectedNode) {
            if(event==='select'){
                for(var k in staff){
                    if(k==selectedNode.id){
                        Mediator.publish('workflow:checkDept', staff[k]);
                        // recursion(staff,selectedNode,'checkDept');
                    }
                }
            }else{
                for(var k in staff){
                    if(k==selectedNode.id){
                        Mediator.publish('workflow:unCheckDept', staff[k]);
                        // recursion(staff,selectedNode,'unCheckDept');
                    }
                }
            }
        },
        treeType:'MULTI_SELECT',
        isSearch: true,
        withButtons:true
        });
    treeComp2.render($('#treeMulti'));
});



const approveWorkflow=(para)=>{
    (async function () {
        return workflowService.approveWorkflowRecord({
            url: '/approve_workflow_record/',
            data:para
        });
    })().then(res=>{
        msgBox.alert(`${res.error}`)
    })
}

//Grid

Mediator.subscribe('workflow:choose', function (info) {
    (async function () {
        return workflowService.getGridinfo({
            table_id:info.tableid,
            formId:info.formid,
            is_view:0,
            parent_table_id:null,
            parent_real_id:null,
            parent_temp_id:null,

        });
    })().then(function (res) {
        let AgGrid=new Grid({
            parentTempId:'',
            tableId:res.table_id,
            viewMode:"createBatch"
        });
        AgGrid.render($("#J-aggrid"));
    })

});


console.log(window.config);