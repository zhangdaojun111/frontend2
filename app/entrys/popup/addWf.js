/**
 *@author qiumaoyun
 *默认新增，编辑等操作工作流逻辑
 */
import '../../assets/scss/main.scss';
import 'jquery-ui/ui/widgets/button.js';
import 'jquery-ui/ui/widgets/dialog.js';

import {HTTP} from '../../lib/http';
import Mediator from '../../lib/mediator';
import {workflowService} from '../../services/workflow/workflow.service';
import WorkFlowForm from '../../components/workflow/workflow-form/workflow-form';
import AddWf from '../../components/workflow/add-workflow/add-workflow';
import FormEntrys from '../form';
import msgBox from '../../lib/msgbox';
import WorkFlow from '../../components/workflow/workflow-drawflow/workflow';
import TreeView from '../../components/util/tree/tree';
import jsplumb from 'jsplumb';
import {PMAPI, PMENUM} from '../../lib/postmsg';


WorkFlowForm.showForm();

let serchStr = location.search.slice(1);
let obj = {}, is_view,cache_old;
serchStr.split('&').forEach(res => {
    let arr = res.split('=');
    obj[arr[0]] = arr[1];
});
is_view = obj.btnType === 'view' ? 1 : 0;
if (obj.btnType === 'view') {
    $('#subAddworkflow').hide();
}

Mediator.publish('workflow:getKey', obj.key);
(async function () {
    return workflowService.getPrepareParams({table_id: obj.table_id});
})().then(res => {
    if (res.data.flow_data.length === 0) {
        $('.workflow-foot').hide();
        $('.workflow-flex').hide();
        $('#place-form').html('');
        FormEntrys.createForm({
            el: $('#place-form'),
            is_view: is_view,
            from_focus: 0,
            table_id: obj.table_id,
            parent_table_id: obj.parent_table_id,
            parent_real_id: obj.parent_real_id,
            parent_temp_id: obj.parent_temp_id,
            parent_record_id: obj.parent_record_id,
            btnType: obj.btnType,
            real_id: obj.real_id,
            isAddBuild: obj.isAddBuild,
            id: obj.id,
            key: obj.key
        });
        setTimeout(()=>{
            cache_old= FormEntrys.getFormValue(obj.table_id);
        },1000)
    } else {
        Mediator.publish('workflow:getParams', res.data.flow_data);
    }
});
Mediator.subscribe('workflow:getflows', (res) => {
    if (obj.btnType === 'view') {
        $('#toEdit').show();
        $('#addFollower').hide();
    }else if(obj.btnType==='none'){
        $('#toEdit').hide();
        $('#addFollower').hide()
    }
    obj.flow_id = res.flow_id;
    obj.form_id = res.form_id;
    WorkFlow.createFlow({flow_id: res.flow_id, el: "#flow-node"});
    $('#place-form').html('');
    FormEntrys.createForm({
        el: $('#place-form'),
        form_id: res.form_id,
        flow_id: res.flow_id,
        is_view: is_view,
        from_workflow: 1,
        from_focus: 0,
        btnType: 'none',
        table_id: obj.table_id,
        parent_table_id: obj.parent_table_id,
        parent_real_id: obj.parent_real_id,
        parent_temp_id: obj.parent_temp_id,
        parent_record_id: obj.parent_record_id,
        real_id: obj.real_id,
        isAddBuild: obj.isAddBuild,
        id: obj.id,
        key: obj.key
    });
    setTimeout(()=>{
        cache_old= FormEntrys.getFormValue(obj.table_id);
    },1000)
});
let focusArr = [];
Mediator.subscribe('workflow:focus-users', (res) => {
    focusArr = res;
})
Mediator.subscribe('workflow:submit', (res) => {
    let formData = FormEntrys.getFormValue(obj.table_id);
    if (formData.error) {
        msgBox.alert(`${formData.errorMessage}`);
    } else {
        let postData = {
            flow_id: obj.flow_id,
            focus_users: JSON.stringify(focusArr) || [],
            data: JSON.stringify(formData),
            cache_new:JSON.stringify(formData),
            cache_old:JSON.stringify(cache_old),
            table_id:obj.table_id,
            parent_table_id:obj.parent_table_id,
            parent_real_id:obj.parent_real_id,
            parent_temp_id:obj.parent_temp_id,
            parent_record_id:obj.parent_record_id
        };
        (async function () {
            return workflowService.addUpdateTableData(postData);
        })().then(res => {
            if (res.success === 1) {
                msgBox.alert(`${res.error}`);
                PMAPI.sendToParent({
                    type: PMENUM.close_dialog,
                    key: obj.key,
                    data: {
                        table_id: obj.table_id,
                        type: 'closeAddition'
                    }
                });
            } else {
                msgBox.alert(`${res.error}`);
            }
        })
    }
}),
Mediator.subscribe('workflow:changeToEdit',(res)=>{
    FormEntrys.changeToEdit(res);
})