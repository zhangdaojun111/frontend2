
import '../../assets/scss/main.scss';
import 'jquery-ui/ui/widgets/button.js';
import 'jquery-ui/ui/widgets/dialog.js';

import {
    HTTP
} from '../../lib/http';
import Mediator from '../../lib/mediator';
import {
    workflowService
} from '../../services/workflow/workflow.service';
import WorkFlowForm from '../../components/workflow/workflow-form/workflow-form';
import AddWf from '../../components/workflow/add-workflow';
import FormEntrys from '../form';
import TreeView from '../../components/util/tree/tree';
import msgBox from '../../lib/msgbox';
import WorkFlow from '../../components/workflow/workflow-drawflow/workflow';
import WorkflowAddFollow from '../../components/workflow/workflow-addFollow/workflow-addHome';
import {PMAPI,PMENUM} from '../../lib/postmsg';
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
            flow_id: obj.flow_id
        }
    });
})().then(res => {
    Mediator.publish('workflow:gotWorkflowInfo', res);
    let a=res.data[0].updateuser2focususer;
    for(var i in a){
        for(var j in a[i]){
            focus.push(a[i][j]);
        }
    }
    Mediator.publish('workflow:focused', []);
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

