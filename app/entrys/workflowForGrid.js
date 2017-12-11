
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
import ApprovalWorkflow from '../components/workflow/approval-workflow/approval-workflow';
import FormEntrys from './form';
import msgBox from '../lib/msgbox';
import WorkFlow from '../components/workflow/workflow-drawflow/workflow';
import Grid from '../components/dataGrid/data-table-page/data-table-page';
import {PMAPI,PMENUM} from '../lib/postmsg';
import jsplumb from 'jsplumb';

let obj={};
const workflowForGrid={
    init(para){
        obj.record_id=para.record_id;
        obj.table_id=para.table_id;
        obj.form_id=para.form_id;
        obj.flow_id=para.flow_id;
	    this.data.approvalWorkflow = new ApprovalWorkflow({events:actions});
	    this.data.approvalWorkflow.render(this.el);
	    this.data.approvalWorkflow.hideLoading();
    },
    create(){
        $('#addFollower').hide();
	    this.data.workForm = new WorkFlowForm();
	    this.data.workForm.render(this.el.find('#workflow-form'));
        
        let nameArr=[],focus=[],is_view,tree=[],staff=[];
        is_view=obj.btnType==='view'?1:0;
        //订阅form data
        Mediator.subscribe('workFlow:record_info', (res) => {
	        this.data.approvalHeader=new ApprovalHeader({data:res.record_info});
	        this.data.approvalHeader.render(this.el.find('#approval-info'));
	        this.data.approvalHeader.hideLoading();
	        this.data.workflowRecord=new WorkflowRecord({data:res.record_info});
	        this.data.workflowRecord.render(this.el.find('#workflow-record'));
	        this.data.workflowRecord.hideLoading();
            let current_node_arr = res.record_info.current_node.split('、');
            if(current_node_arr.indexOf(window.config.name)==-1){
                $('#approval-workflow').find('.for-hide').hide();
            }
            if(res.record_info.status==="已驳回到发起人"&&res.record_info.start_handler===window.config.name){
                $('#approval-workflow').find('.for-hide').hide();
                $('#approval-workflow').find('#re-app').show();
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
                for(var i in a){
                    for(var j in a[i]){
                        focus.push(a[i][j]);
                    }
                }
                (async function () {
                    return workflowService.getWorkflowInfo({url: '/get_all_users/'});
                })().then(users => {
                    for(var i in focus){
                        nameArr.push(`<span class="selectSpan">${users.rows[focus[i]].name}</span>`);
                    }
                    $('#add-home #addFollowerList').html(nameArr);
                    let current_node_arr = res.record_info.current_node.split('、');
                    if(nameArr.indexOf(window.config.name)>-1&&current_node_arr.indexOf(window.config.name)==-1){
                        $('#approval-workflow').find('.for-hide').hide();
                        $('#approval-workflow').find('#re-app').hide();
                    }
                });
            });
            
        });
        
        Mediator.subscribe("workflow:loaded",(e)=>{
            if(e===1){
                if(obj.is_focus==1||obj.btnType==='view'){
                    $('#approval-workflow').find('.for-hide').hide();
                }
            }
        });

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

        let focusArr=[];
        Mediator.subscribe('workflow:focus-users', (res)=> {
            focusArr=res;
        });
    }
};

export default workflowForGrid ;