
import '../assets/scss/main.scss';
import 'jquery-ui/ui/widgets/button.js';
import 'jquery-ui/ui/widgets/dialog.js';

import {
    HTTP
} from '../lib/http';
import Mediator from '../lib/mediator';
import {
    workflowService
} from '../services/workflow/workflow.service';
import WorkFlowCreate from '../components/workflow/workflow-create/workflow-create';
import WorkflowRecord from '../components/workflow/approval-record/approval-record';
import WorkFlowForm from '../components/workflow/workflow-form/workflow-form';
import WorkFlowGrid from '../components/workflow/workflow-grid/workflow-grid';
import ApprovalHeader from '../components/workflow/approval-header/approval-header';
import ApprovalWorkflow from '../components/workflow/approval-workflow';
import WorkflowAddFollow from '../components/workflow/workflow-addFollow/workflow-addHome';
import WorkflowAddSigner from '../components/workflow/workflow-addFollow/workflow-addSigner';
import FormEntrys from './form';
import TreeView from '../components/util/tree/tree';
import msgBox from '../lib/msgbox';
import WorkFlow from '../components/workflow/workflow-drawflow/workflow';
import Grid from '../components/dataGrid/data-table-page/data-table-page';
import {PMAPI,PMENUM} from '../lib/postmsg';
import jsplumb from 'jsplumb';


WorkFlowForm.showForm();

let serchStr = location.search.slice(1);
let obj = {},focus=[],is_view;
serchStr.split('&').forEach(res => {
    var arr = res.split('=');
    obj[arr[0]] = arr[1];
});



//审批工作流
(async function () {
    return workflowService.getWorkflowInfo({
        url: '/get_workflow_info/',
        data: {
            flow_id: obj.flow_id,
            record_id: obj.record_id
        }
    });
})().then(res => {
    Mediator.publish('workflow:getImgInfo', res);
    Mediator.publish('workflow:gotWorkflowInfo', res);
    let a=res.data[0].updateuser2focususer;
    for(var i in a){
        for(var j in a[i]){
            focus.push(a[i][j]);
        }
    }
    Mediator.publish('workflow:focused', focus);
    (async function () {
        return workflowService.getWorkflowInfo({url: '/get_all_users/'});
    })().then(users => {
        let nameArr=[];
        for(var i in focus){
            nameArr.push(users.rows[focus[i]].name);
        }
        $('#addFollowerList').text(`${nameArr}`);
    });
});


//订阅form data
Mediator.subscribe('workFlow:record_info', (res) => {
    ApprovalHeader.showheader(res.record_info);
    WorkflowRecord.showRecord(res.record_info);
});
if(obj.btnType==='view'){
    is_view=1;
}else{
    is_view=0;
};

Mediator.subscribe("workflow:loaded",(e)=>{
    if(e===1){
        Mediator.publish('workflow:is_view', is_view);
    }
});

FormEntrys.createForm({
    el: '#place-form',
    form_id: obj.form_id,
    record_id: obj.record_id,
    is_view: is_view,
    from_approve: 1,
    from_focus: 0,
    table_id: obj.table_id
});

let focusArr=[];
Mediator.subscribe('workflow:focus-users', (res)=> {
    focusArr=res;
})

function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}


//审批操作
const approveWorkflow = (para) => {
    let key=GetQueryString('key');
    let formData=FormEntrys.getFormValue(obj.table_id),
        comment=$('#comment').val();
    para.data=JSON.stringify(formData);
    para.comment=comment;
    para.focus_users=JSON.stringify(focusArr);
    (async function () {
        return workflowService.approveWorkflowRecord({
            url: '/approve_workflow_record/',
            data: para
        });
    })().then(res => {
        if(res.success===1){
            msgBox.alert(`操作成功`);
        }else{
            msgBox.alert(`失败：${res.error}`);
        }
        PMAPI.sendToParent({
            type: PMENUM.close_dialog,
            key:key,
            data:{}
        })
    })
};

Mediator.subscribe('approval:recordPass', (data) => {
    approveWorkflow({
        record_id: obj.record_id,
        action: 0, // 0：通过 1：驳回上一级 2:驳回发起人 3：作废 4：取消 5：撤回 6：驳回任意节点 7：撤回审批 8：自动拨回到发起人 9：加签
        node_id: null, //驳回节点id
        sigh_type: 0, //加签类型  0：前 1：后
        sigh_user_id: '',
        sign: JSON.stringify(data),
    });
});
Mediator.subscribe('approval:appRejUp', (ispass) => {
    if (ispass) {
        approveWorkflow({
            record_id: obj.record_id,
            action: 1,
        });
    }
});
Mediator.subscribe('approval:recordRejStart', (ispass) => {
    if (ispass) {
        approveWorkflow({
            record_id: obj.record_id,
            action: 2,
        });
    }
});
Mediator.subscribe('approval:signUser', (signObj) => {
    approveWorkflow({
        record_id: obj.record_id,
        action: 9,
        sigh_type: signObj.sigh_type,
        sigh_user_id: signObj.sigh_user_id,
    });
});
Mediator.subscribe('approval:rejToAny', (id) => {
    if(id.length==21){
        id=id.slice(5);
    }else if(id.length==19){
        id=id.slice(3);
    }
    approveWorkflow({
        record_id: obj.record_id,
        action: 6,
        node_id: id,
    });
});


//获取盖章图片
(async function () {
    return workflowService.getStmpImg();
})().then(res => {
    Mediator.publish("workflow:getStampImg", res);
});


Mediator.subscribe("workflow:seal", (msg) => {
    (async function () {
        let data = await workflowService.addStmpImg(msg);
    })().then(res => {
        Mediator.publish("workflow:getStamp");
    });
});

//删除或添加盖章图片之后重新加载图片
Mediator.subscribe("workflow:getStamp", (msg) => {
    (async function () {
        return workflowService.getStmpImg();
    })().then(res => {
        Mediator.publish("workflow:changeImg", res);
    });
})
//删除图片
Mediator.subscribe("workflow:delImg", (msg) => {
    (async function () {
        let data = await workflowService.delStmpImg(msg);
    })();
});

