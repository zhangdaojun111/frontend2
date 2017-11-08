
import '../assets/scss/main.scss';
import 'jquery-ui/ui/widgets/button.js';
import 'jquery-ui/ui/widgets/dialog.js';

import {HTTP} from '../lib/http';
import Mediator from '../lib/mediator';
import {workflowService} from '../services/workflow/workflow.service';
import WorkFlowCreate from '../components/workflow/workflow-create/workflow-create';
import WorkflowRecord from '../components/workflow/approval-record/approval-record';
import WorkFlowForm from '../components/workflow/workflow-form/workflow-form';
import WorkFlowGrid from '../components/workflow/workflow-grid/workflow-grid';
import ApprovalHeader from '../components/workflow/approval-header/approval-header';
import ApprovalWorkflow from '../components/workflow/approval-workflow/approval-workflow';
import FormEntrys from './form';
import msgBox from '../lib/msgbox';
import WorkFlow from '../components/workflow/workflow-drawflow/workflow';
import Grid from '../components/dataGrid/data-table-page/data-table-agGrid/data-table-agGrid';
import {PMAPI,PMENUM} from '../lib/postmsg';
import jsplumb from 'jsplumb';
import {CreateFormServer} from "../services/formService/CreateFormServer";

let serchStr = location.search.slice(1),nameArr=[],obj = {},focus=[],is_view,tree=[],staff=[],agorfo=true,is_batch=0;
serchStr.split('&').forEach(res => {
    let arr = res.split('=');
    obj[arr[0]] = arr[1];
});
is_view=obj.btnType==='view'?1:0;
PMAPI.getIframeParams(obj.key).then(res => {
    if(res.data.current_node) {
        if(res.data.current_node.indexOf(window.config.name)===-1){
            is_view = 1;
        }
    }


    ApprovalWorkflow.showDom().then(function (component) {
        WorkFlowGrid.showGrid();
        WorkFlowForm.showForm();
        FormEntrys.initForm({
            el: $('#place-form'),
            form_id: obj.form_id,
            record_id: obj.record_id,
            is_view: is_view,
            from_approve: 1,
            from_focus: 0,
            btnType:'none',
            table_id: obj.table_id
        });
        Mediator.subscribe("form:formAlreadyCreate",()=>{
            component.hideLoading();
        });
        // setTimeout(()=> component.hideLoading(),1000)
    });
});
// is_view=obj.btnType==='view'?1:0;
//
// ApprovalWorkflow.showDom().then(function (component) {
//     WorkFlowGrid.showGrid();
//     WorkFlowForm.showForm();
//     FormEntrys.initForm({
//         el: $('#place-form'),
//         form_id: obj.form_id,
//         record_id: obj.record_id,
//         is_view: is_view,
//         from_approve: 1,
//         from_focus: 0,
//         btnType:'none',
//         table_id: obj.table_id
//     });
//     Mediator.subscribe("form:formAlreadyCreate",()=>{
//         component.hideLoading();
//     });
//     // setTimeout(()=> component.hideLoading(),1000)
// });

//订阅form data
Mediator.subscribe('workFlow:record_info', (res) => {
    let count = 0;
    for(let comment of res.record_info.approve_tips) {
        comment['index'] = count;
        count += 1;
    }
    console.log(res.record_info.approve_tips);
    ApprovalHeader.showheader(res.record_info);
    WorkflowRecord.showRecord(res.record_info);
    let current_node_arr = res.record_info.current_node.split('、');
    console.log( "---" )
    console.log( res.record_info.current_node )
    console.log( current_node_arr )
    console.log( "---" )
    if(current_node_arr.indexOf(window.config.name)==-1){
        is_view = 1;
        $('#approval-workflow').find('.for-hide').hide();
    };
    if(res.record_info.status==="已驳回到发起人"&&res.record_info.start_handler===window.config.name){
        $('#approval-workflow').find('.for-hide').hide();
        if(!is_view){
            $('#approval-workflow').find('#re-app').show();
        }
    };
    if(res.record_info.status==="已撤回"&&res.record_info.start_handler===window.config.name){
        $('#approval-workflow').find('.for-hide').hide();
        if(!is_view){
            $('#approval-workflow').find('#re-app').show();
        }
    };
    if(is_view){
        $('#add-home').find('#addFollower').hide();
    }

    //审批工作流
    (async function () {
        return workflowService.getWorkflowInfo({
            url: '/get_workflow_info/',
            data: {
                flow_id: obj.flow_id,
                record_id: obj.record_id
            }
        });
    })().then(result => {
        Mediator.publish('workflow:getImgInfo', result);
        Mediator.publish('workflow:gotWorkflowInfo', result);
        let a=result.data[0].updateuser2focususer;
        for(let i in a){
            for(let j in a[i]){
                focus.push(a[i][j]);
            }
        }
        Mediator.publish('workflow:focused' , focus);
        (async function () {
            return workflowService.getWorkflowInfo({url: '/get_all_users/'});
        })().then(users => {
            for(let i in focus){
                nameArr.push(`<span class="selectSpan">${users.rows[focus[i]].name}</span>`);
            }
            $('#add-home #addFollowerList').html(nameArr);
            let current_node_arr = res.record_info.current_node.split('、');
            if(nameArr.indexOf(window.config.name)>-1&&current_node_arr.indexOf(window.config.name)==-1){
                $('#approval-workflow').find('.for-hide').hide();
                $('#approval-workflow').find('#re-app').hide();
            };
        }).then()
    });
    
});

/**
 * 审批批量工作流初始化
 */
(async function () {
    return workflowService.getRecordInfo(
        {
            flow_id: obj.flow_id,
            form_id: obj.form_id,
            record_id: obj.record_id,
            is_view: is_view,
            from_approve: 1,
            from_focus: 0,
            // is_view:0,
            table_id: obj.table_id,
        }
    )
})().then(function (res) {
    let cannotopenform = '';
    if(res['record_info']['status'] === '已完成') {
        cannotopenform = '1';
    }
    Mediator.publish("workflow:aggridorform",res);
    is_batch = res.record_info.is_batch;
    if(is_batch==1){
        agorfo =false;
    }
    let AgGrid=new Grid({
        batchIdList:res.record_info.temp_ids,
        tableId:obj.table_id,
        recordId: obj.record_id,
        viewMode:"approveBatch",
        cannotopenform: cannotopenform,
        parentRecordId:res['record_info']['id'],
    });
    AgGrid.actions.returnBatchData = function (ids) {
        temp_ids=ids;
    };
    AgGrid.render($("#J-aggrid"));
})


Mediator.subscribe("workflow:loaded",(e)=>{
    if(e===1){
        if(obj.is_focus==1||obj.btnType==='view'){
            $('#approval-workflow').find('.for-hide').hide();
        }
    }
});

/**
 * 审批表单初始化
 */


let focusArr=[];
Mediator.subscribe('workflow:focus-users', (res)=> {
    focusArr=res;
})

function GetQueryString(name)
{
    let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}

//审批操作
const approveWorkflow = (para) => {
    let key=GetQueryString('key');
    let formData=CreateFormServer.getFormValue(obj.table_id,true);
        // comment=$('#comment').val();
    para.data={};
    if(agorfo){
        if(formData.error){
            msgBox.alert(`${formData.errorMessage}`);
            return ;
        }else {
            para.data = JSON.stringify(formData);
        }
    }
    para.focus_users=JSON.stringify(focusArr);
    msgBox.showLoadingSelf();
    console.log(para);
    // (async function () {
    //     return workflowService.approveWorkflowRecord({
    //         url: '/approve_workflow_record/',
    //         data: para
    //     });
    // })().then(res => {
    //     msgBox.hideLoadingSelf();
    //     if(res.success===1){
    //         msgBox.alert(`操作成功`);
    //         PMAPI.sendToParent({
    //             type: PMENUM.close_dialog,
    //             key:key,
    //             data:{refresh:true}
    //         })
    //     }else{
    //         msgBox.alert(`失败：${res.error}`);
    //     }
    //
    // })
    workflowService.approveWorkflowRecord({
        url: '/approve_workflow_record/',
        data: para
    }).then(res => {
        msgBox.hideLoadingSelf();
        if(res.success===1){
            msgBox.alert(`操作成功`);
            PMAPI.sendToParent({
                type: PMENUM.close_dialog,
                key:key,
                data:{refresh:true}
            })
        }else{
            msgBox.alert(`失败：${res.error}`);
        }
    })

};
// Mediator.subscribe('workflow:comment',(res)=>{
//     console.log(res);
//     comment = res.comment;
//     attachmentComment = res.attachment;
//     console.log('111111111111');
// })

Mediator.subscribe('approval:recordPass', (data) => {
    console.log(data);
    approveWorkflow({
        record_id: obj.record_id,
        action: 0, // 0：通过 1：驳回上一级 2:驳回发起人 3：作废 4：取消 5：撤回 6：驳回任意节点 7：撤回审批 8：自动拨回到发起人 9：加签
        node_id: null, //驳回节点id
        sigh_type: 0, //加签类型  0：前 1：后
        sigh_user_id: '',
        sign: data['imgInfo'][0],
        delSign:data['imgInfo'][1],
        comment_attachment: JSON.stringify(data['comment']['attachment']),
        comment: data['comment']['comment'],
    });
});
Mediator.subscribe('approval:appRejUp', (ispass) => {
    if (ispass.determine) {
        approveWorkflow({
            record_id: obj.record_id,
            action: 1,
            comment_attachment: JSON.stringify(ispass['attachment']),
            comment: ispass['comment'],
        });
    }
});
Mediator.subscribe('approval:recordRejStart', (ispass) => {
    if (ispass.determine) {
        approveWorkflow({
            record_id: obj.record_id,
            action: 2,
            comment_attachment: JSON.stringify(ispass['attachment']),
            comment: ispass['comment'],
        });
    }
});
Mediator.subscribe('approval:signUser', (signObj) => {
    approveWorkflow({
        record_id: obj.record_id,
        action: 9,
        sigh_type: signObj.sigh_type,
        sigh_user_id: signObj.sigh_user_id,
        comment: signObj.comment,
        comment_attachment: JSON.stringify(signObj.attachment),
    });
});
Mediator.subscribe('approval:rejToAny', (res) => {
    console.log(res);
    // if(res.id.length === 21){
    //     res.id = res.id.slice(5);
    // }else if(res.id.length === 19){
    //     res.id = res.id.slice(3);
    // }
    approveWorkflow({
        record_id: obj.record_id,
        action: 6,
        node_id: res.data.rejectId,
        comment: res.data.data.comment,
        comment_attachment: JSON.stringify(res.data.data['attachment']),
    });
});
//驳回至发起人，重新发起
Mediator.subscribe("approval:re-app", (msg) => {
    let key=GetQueryString('key');
    let formData=CreateFormServer.getFormValue(obj.table_id,true);
    if(formData.error){
        msgBox.alert(`${formData.errorMessage}`);
    }else{
        let postData={
            flow_id:obj.flow_id,
            focus_users:JSON.stringify(focusArr)||[],
            data:JSON.stringify(formData),
            record_id:obj.record_id
        };
        (async function () {
            return await workflowService.createWorkflowRecord(postData);
        })().then(res=>{
            if(res.success===1){
                msgBox.alert(`${res.error}`);
            }else{
                msgBox.alert(`失败：${res.error}`);
            }
            PMAPI.sendToParent({
                type: PMENUM.close_dialog,
                key:key,
                data:{refresh:true}
            })
        })
    }
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

