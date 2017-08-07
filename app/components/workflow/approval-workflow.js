import Component from '../../lib/component';
import template from './approval-workflow.html';
import './approval-workflow.scss';
import Mediator from '../../lib/mediator';
import ApprovalHeader from './workflow-seal/workflow-seal';
import WorkFlow from './workflow-drawflow/workflow';


let config={
    template: template,
    data:{},
    action:{

    },
    afterRender(){
        Mediator.subscribe('workflow:gotWorkflowInfo', (msg)=> {
            WorkFlow.show(msg.data[0]);
        })
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


ApprovalHeader.showheader();