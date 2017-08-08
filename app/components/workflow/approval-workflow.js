import Component from '../../lib/component';
import template from './approval-workflow.html';
import './approval-workflow.scss';
import Mediator from '../../lib/mediator';
import WorkFlow from './workflow-drawflow/workflow';
import WorkflowSeal from './workflow-seal/workflow-seal';
import {workflowService} from '../../services/workflow/workflow.service';

let config={
    template: template,
    data:{
        record_id:'',
        focus_users:[],
        action:0,
        comment:'',
        node_id:null,
        recordData:{
            form_id:181,
            record_id:'59882e8e802289933b1ddf0d',
            is_view:0,
            from_approve:1,
            from_focus:0,
            table_id:'5318_EHFuJD7Ae76c6GMPtzdiWH',
        }
    },
    actions:{
        approveWorkflow (__this){
            (async function () {
                return workflowService.approveWorkflowRecord({
                    url: '/approve_workflow_record/?seqid=qiumaoyun_1502093694205&record_id=598819d246e8e4283ced51bd',
                    data:__this.data
                });
            })().then(res=>{
                console.log(res);
            })
        },
        getRecordInfos(__this){
            (async function () {
                return workflowService.getRecordInfo({
                    url:'/get_form_dynamic_data',
                    data:__this.data.recordData
                })
            })().then(res=>{
                console.log(res)
            })
        }
    },
    afterRender(){
        let __this=this;
        console.log(data);
        Mediator.subscribe('workflow:gotWorkflowInfo', (msg)=> {
            WorkFlow.show(msg.data[0]);
        });
        this.el.on('click','#app-pass',()=>{
            this.actions.approveWorkflow(__this);
        });
        this.actions.getRecordInfos(__this);
    }
};
class ApprovalWorkflow extends Component{
    constructor (data){
        super(config,data);
    }
}

let component = new ApprovalWorkflow();
let el = $('#approval-workflow');
component.render(el);

let data = {"file_ids": ["5987de19c3ec2134050ee679", "5987de3244543b4d1226c977", "5987fe3e8e368f5747b1722c"]}
WorkflowSeal.showheader(data);