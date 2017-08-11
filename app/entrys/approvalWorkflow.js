
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
import ApprovalWorkflow from '../components/workflow/approval-workflow';
import WorkflowAddFollow from '../components/workflow/workflow-addFollow/workflow-addFollow';
import FormEntrys from './form';
import TreeView from  '../components/util/tree/tree';
import msgBox from '../lib/msgbox';
import WorkFlow from '../components/workflow/workflow-drawflow/workflow';
import Grid from '../components/dataGrid/data-table-page/data-table-page';


WorkFlowForm.showForm();

//审批工作流

var mockFlowData;

(async function () {
    return workflowService.getWorkflowInfo({url: '/get_workflow_info/',data:{
        flow_id:32,
        record_id:'59897f02c3ec2134050ee6a7'
    // return workflowService.getWorkflowInfo({url: '/get_workflow_info/?seqid=wenjingjing_1502270451650',data:{
    //     flow_id:10,
    //     record_id:"598ac7a1c57ccd4d472bd31d"
    }});
})().then(res=>{
    Mediator.publish('workflow:getImgInfo',res);
    Mediator.publish('workflow:gotWorkflowInfo', res);
    mockFlowData=res;
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
                        recursion(staff,selectedNode,'checkDept');
                    }
                }
            }else{
                for(var k in staff){
                    if(k==selectedNode.id){
                        Mediator.publish('workflow:unCheckDept', staff[k]);
                        recursion(staff,selectedNode,'unCheckDept');
                    }
                }
            }
        },
        treeType:'MULTI_SELECT',
        isSearch: true
        });
    treeComp2.render($('#treeMulti'));

    var treeComp3 = new TreeView(tree,{
        callback: function (event,selectedNode) {
            if(event==='select'){
                for(var k in staff){
                    if(k==selectedNode.id){
                        Mediator.publish('workflow:checkAdder', staff[k]);
                        recursion(staff,selectedNode,'checkAdder');
                    }
                }
            }else{
                for(var k in staff){
                    if(k==selectedNode.id){
                        Mediator.publish('workflow:unCheckAdder', staff[k]);
                        recursion(staff,selectedNode,'unCheckAdder');
                    }
                }
            }
        },
        treeType:'MULTI_SELECT',
        isSearch: true
        });
    treeComp3.render($('#addUser'));

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

//审批操作
FormEntrys.createForm({
    el:$("#place-form"),
    form_id:181,
    record_id:'59897f02c3ec2134050ee6a7',
    is_view:0,
    from_approve:1,
    from_focus:0,
    table_id:'5318_EHFuJD7Ae76c6GMPtzdiWH'
}).then(res=>{
    ApprovalHeader.showheader(res);
    WorkflowRecord.showRecord(res);
    Mediator.subscribe('approval:recordPass', (data)=> {
        console.log(data);
           approveWorkflow({
                record_id:'59897f1591461c15d279023a',
                focus_users:[],
                action:0,// 0：通过 1：驳回上一级 2:驳回发起人 3：作废 4：取消 5：撤回 6：驳回任意节点 7：撤回审批 8：自动拨回到发起人 9：加签
                comment:null,
                node_id:null,//驳回节点id
                sigh_type:0,//加签类型  0：前 1：后
                sigh_user_id:'',
                data:{},
                sign:JSON.stringify(data),
            });

    })
    Mediator.subscribe('approval:appRejUp', (ispass)=> {
       if(ispass){
           approveWorkflow({
                record_id:'59897f1591461c15d279023a',
                focus_users:[],
                action:1,
                comment:null,
                node_id:null,
                sigh_type:0,
                sigh_user_id:'',
                data:{}
            });
        }
    })
    Mediator.subscribe('approval:recordRejStart', (ispass)=> {
       if(ispass){
           approveWorkflow({
                record_id:'59897f1591461c15d279023a',
                focus_users:[],
                action:2,
                comment:null,
                node_id:null,
                sigh_type:0,
                sigh_user_id:'',
                data:{}
            });
        }
    })
    Mediator.subscribe('approval:signUser', (signObj)=> {
        approveWorkflow({
                record_id:'59897f1591461c15d279023a',
                focus_users:[],
                action:2,
                comment:null,
                node_id:null,
                sigh_type:signObj.sigh_type,
                sigh_user_id:signObj.sigh_user_id,
                data:{}
        });
    })
    
});


//获取盖章图片
(async function () {
    return workflowService.getStmpImg();
})().then(res=>{
    Mediator.publish("workflow:getStampImg",res);
});


Mediator.subscribe("workflow:seal",(msg)=>{
    (async function () {
        let data = await workflowService.addStmpImg(msg);
    })().then(res=>{
        Mediator.publish("workflow:getStamp");
    });
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


