/*
 * Created by qmy on 2017/8/10.
 */
import '../../assets/scss/main.scss';
import 'jquery-ui/ui/widgets/button.js';
import 'jquery-ui/ui/widgets/dialog.js';

import {HTTP} from '../../lib/http';
import Mediator from '../../lib/mediator';
import {workflowService} from '../../services/workflow/workflow.service';
import WorkFlowForm from '../../components/workflow/workflow-form/workflow-form';
import AddWf from '../../components/workflow/add-workflow';
import FormEntrys from '../form';
import msgBox from '../../lib/msgbox';
import WorkFlow from '../../components/workflow/workflow-drawflow/workflow';
import WorkflowAddFollow from '../../components/workflow/workflow-addFollow/workflow-addFollow';
import TreeView from '../../components/util/tree/tree';
import jsplumb from 'jsplumb';


WorkflowAddFollow.showAdd();
WorkFlowForm.showForm();
let tree=[],staff=[];
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

let serchStr = location.search.slice(1);
let obj = {},is_view;
serchStr.split('&').forEach(res => {
    var arr = res.split('=');
    obj[arr[0]] = arr[1];
});

(async function () {
    return workflowService.getPrepareParams({table_id:obj.table_id});
})().then(res => {
    if(res.data.flow_data.length===0){
        $('.workflow-foot').hide();
        $('.workflow-flex').hide();
        $('#place-form').html('');
        FormEntrys.createForm({
            el: '#place-form',
            is_view: 0,
            from_workflow:1,
            from_focus: 0,
            table_id: obj.table_id,
            parent_table_id:obj.parent_table_id,
            parent_real_id:obj.parent_real_id,
            parent_temp_id:obj.parent_temp_id,
            parent_record_id:obj.parent_record_id,
            btnType:obj.btnType,
            real_id:obj.real_id
        });
    }else{
        Mediator.publish('workflow:getParams', res.data.flow_data);
    }
});
Mediator.publish('workflow:focused', []);
Mediator.subscribe('workflow:getflows', (res)=> {
    obj.flow_id=res.flow_id;
    obj.form_id=res.form_id;
    WorkFlow.createFlow({flow_id:res.flow_id,el:"#flow-node"});
    $('#place-form').html('');
    FormEntrys.createForm({
        el: '#place-form',
        form_id: res.form_id,
        flow_id:res.flow_id,
        is_view: 0,
        from_workflow:1,
        from_focus: 0,
        btnType:'none',
        table_id: obj.table_id,
        parent_table_id:obj.parent_table_id,
        parent_real_id:obj.parent_real_id,
        parent_temp_id:obj.parent_temp_id,
        parent_record_id:obj.parent_record_id,
        real_id:obj.real_id
    });
    
});
let focusArr=[];
Mediator.subscribe('workflow:focus-users', (res)=> {
    focusArr=res;
})
Mediator.subscribe('workflow:submit', (res)=> {
    let formData=FormEntrys.getFormValue(obj.table_id);
    if(formData.error){
        msgBox.alert(`${formData.errorMessage}`);
    }else{
        let postData={
                flow_id:obj.flow_id,
                focus_users:JSON.stringify(focusArr)||[],
                data:JSON.stringify(formData)
        };
        (async function () {
            return await workflowService.createWorkflowRecord(postData);
        })().then(res=>{
            if(res.success===1){
                msgBox.alert(`${res.error}`);
                PMAPI.sendToParent({
                    type: PMENUM.close_dialog,
                    key:obj.key,
                    data:{}
                });
            }else{
                msgBox.alert(`${res.error}`);
            }
        })
    }
})
if(obj.btnType==='view'){
    $('.workflow-flex').hide();
}