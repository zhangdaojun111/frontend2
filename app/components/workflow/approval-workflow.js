import Component from '../../lib/component';
import template from './approval-workflow.html';
import './approval-workflow.scss';

import WorkflowSeal from './workflow-seal/workflow-seal'



let config={
    template: template,
    data:{},
    action:{

    },
    afterRender(){
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