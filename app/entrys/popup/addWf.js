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
import jsplumb from 'jsplumb';
import {PMAPI, PMENUM} from '../../lib/postmsg';
import {CreateFormServer} from "../../services/formService/CreateFormServer";
// AddWf.showDom().then(function (component) {
//     WorkFlowForm.showForm();
//     let isshow = true;
//     Mediator.subscribe("form:formAlreadyCreate",()=>{
//         if(isshow){
//             component.hideLoading();
//             isshow = false;
//         }
//     });
//     // setTimeout(()=>component.hideLoading(),1000)
// });
let serchStr = location.search.slice(1);
let obj = {}, is_view = 0,cache_old;
let action;
serchStr.split('&').forEach(res => {
    let arr = res.split('=');
    obj[arr[0]] = arr[1];
});

AddWf.showDom(obj).then(function (component) {
    WorkFlowForm.showForm();
    let isshow = true;

    Mediator.subscribe("form:formAlreadyCreate",()=>{
        if(isshow){
            component.hideLoading();
            isshow = false;
        }
        if(obj.tableType !== 'child' && obj.btnType === 'new' && !obj.calendar  && !obj.isAddBuild){
          $('#miniFormBtn').show();
        }else{
           $('#miniFormBtn').hide();
        }

    });
    // setTimeout(()=>component.hideLoading(),1000)
});



// is_view = obj.btnType === 'view' ? 1 : 0;
// if (obj.btnType === 'view'||obj.btnType ==="none") {
//     $('#subAddworkflow').hide();
//     is_view = 1;
// }
// //判断工作流是否处于在途状态或者在批量工作流中打开forn
// if(obj.in_process == 1 || obj.is_batch == 1){
//     // $("#add-wf").find('.J_hide').addClass('hide');
//     action = 1;
// }
// //批量工作流隐藏多余div
// if(obj.is_batch == 1){
//     $("#add-wf").find('#print').addClass('addPrint');
//     $("#add-wf").find('.J_hide').addClass('hide');
// }
//
// if(obj.is_view == 1 && obj.in_process == 0){
//     $("#add-wf").find('.J_hide').addClass('hide');
//     $("#add-wf").find('#print').addClass('addPrint');
// }
// Mediator.publish('workflow:getKey', obj.key);
// (async function () {
//     return workflowService.getPrepareParams({table_id: obj.table_id});
// })().then(res => {
//     if (res.data.flow_data.length === 0) {
//         $('.workflow-foot').hide();
//         $('.workflow-flex').hide();
//         $('#place-form').html('');
//         FormEntrys.initForm({el: $('#place-form'),
// 		    is_view: is_view,
// 		    from_focus: 0,
// 		    table_id: obj.table_id,
// 		    parent_table_id: obj.parent_table_id,
// 		    parent_real_id: obj.parent_real_id,
// 		    parent_temp_id: obj.parent_temp_id,
// 		    parent_record_id: obj.parent_record_id,
// 		    btnType: obj.btnType,
// 		    real_id: obj.real_id,
// 		    temp_id: obj.temp_id,
// 		    isAddBuild: obj.isAddBuild,
// 		    id: obj.id,
// 		    key: obj.key,
// 		    action: action});
//         setTimeout(()=>{
//             cache_old= CreateFormServer.getFormValue(obj.table_id,true);
//         },1000)
//     } else {
//         Mediator.publish('workflow:getParams', res.data.flow_data);
//     }
// });
// Mediator.subscribe('workflow:getflows', (res) => {
//     if (obj.btnType === 'view' && is_view != 0) {
//         $('#toEdit').show();
//         $('#addFollower').hide();
//     }else if(obj.btnType==='none'){
//         $('#toEdit').hide();
//         $('#addFollower').hide();
//     }
//     if(obj.in_process == 1){
//         WorkFlow.createFlow({
//             flow_id: obj.flow_id,
//             el: "#flow-node",
//             record_id:obj.record_id,
//         });
//         Mediator.publish("workflow:hideselect",obj.flow_id);
//     }else{
//         WorkFlow.createFlow({
//             flow_id: res.flow_id,
//             el: "#flow-node",
//             record_id:obj.record_id,
//         });
//         obj.flow_id = res.flow_id;
//         obj.form_id = res.form_id;
//     }
//     $('#place-form').html('');
//     FormEntrys.initForm({
//         el: $('#place-form'),
//         form_id: res.form_id,
//         flow_id: res.flow_id,
//         is_view: is_view,
//         from_workflow: 1,
//         from_focus: 0,
//         btnType: 'none',
//         table_id: obj.table_id,
//         parent_table_id: obj.parent_table_id,
//         parent_real_id: obj.parent_real_id,
//         parent_temp_id: obj.parent_temp_id,
//         parent_record_id: obj.parent_record_id,
//         data_from_row_id: obj.data_from_row_id || '',
//         operation_id: obj.operation_id || '',
//         real_id: obj.real_id,
//         temp_id: obj.temp_id,
//         in_process: obj.in_process,
//         record_id: obj.record_id,
//         isAddBuild: obj.isAddBuild,
//         id: obj.id,
//         key: obj.key,
//         action: action,
//         is_batch: obj.is_batch
//     });
//     setTimeout(()=>{
//         cache_old= CreateFormServer.getFormValue(obj.table_id,true);
//     },1000)
// });
// let focusArr = [];
// Mediator.subscribe('workflow:focus-users', (res) => {
//     focusArr = res;
// })
// Mediator.subscribe('workflow:submit', (res) => {
//     let formData = CreateFormServer.getFormValue(obj.table_id,true);
//     if (formData.error) {
//         msgBox.alert(`${formData.errorMessage}`);
//     } else {
//         msgBox.showLoadingSelf();
//         let postData = {
//             flow_id: obj.flow_id,
//             focus_users: JSON.stringify(focusArr) || [],
//             data: JSON.stringify(formData),
//             cache_new:JSON.stringify(formData),
//             cache_old:JSON.stringify(cache_old),
//             table_id:obj.table_id,
//             parent_table_id:obj.parent_table_id,
//             parent_real_id:obj.parent_real_id,
//             parent_temp_id:obj.parent_temp_id,
//             parent_record_id:obj.parent_record_id
//         };
//         //半触发操作用
//         if( obj.data_from_row_id ){
//             postData = {
//                 data: JSON.stringify(formData),
//                 flow_id: obj.flow_id,
//                 operation_table_id: obj.operation_table_id,
//                 operation_real_id: obj.data_from_row_id
//             }
//         }
//         (async function () {
//             //半触发操作用
//             if( obj.data_from_row_id ){
//                 return workflowService.createWorkflowRecord(postData);
//             }else {
//                 return workflowService.addUpdateTableData(postData);
//             }
//         })().then(res => {
//             msgBox.hideLoadingSelf();
//             if (res.success === 1) {
//                 msgBox.showTips(`保存成功`);
//                 PMAPI.sendToRealParent({
//                     type: PMENUM.close_dialog,
//                     key: obj.key,
//                     data: {
//                         table_id: obj.table_id,
//                         type: 'closeAddition',
//                         refresh: true
//                     }
//                 });
//             } else {
//                 msgBox.alert(`${res.error}`);
//             }
//         })
//     }
// }),
Mediator.subscribe('workflow:changeToEdit',(res)=>{
    //$("#add-wf").find('.J_hide').removeClass('hide');
    if(obj.is_batch !== '1') {
        $("#add-wf").find('.J_hide').removeClass('hide');
        // $("#add-wf").find('#print').removeClass('addPrint');
    }
    // $("#add-wf").find('#print').removeClass('addPrint');
    is_view = 0;
    CreateFormServer.changeToEdit(res);
});