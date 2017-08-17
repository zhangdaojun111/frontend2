import Component from '../../lib/component';
import template from './add-workflow.html';
import './approval-workflow.scss';
import Mediator from '../../lib/mediator';
import WorkFlow from './workflow-drawflow/workflow';
import {workflowService} from '../../services/workflow/workflow.service';
import msgBox from '../../lib/msgbox';
// import AddSigner from './add-signer';
import {PMAPI,PMENUM} from '../../lib/postmsg';

let config={
    template: template,
    data:{

    },

    actions:{
    
    },
    afterRender(){
        Mediator.subscribe('workflow:gotWorkflowInfo', (msg)=> {
            this.data.workflowData=msg.data[0];
            WorkFlow.show(msg.data[0],'#drawflow');
        });
    }
};
class AddWorkflow extends Component{
    constructor (data){
        super(config,data);
    }
}

let component = new AddWorkflow();
let el = $('#add-wf');
component.render(el);
