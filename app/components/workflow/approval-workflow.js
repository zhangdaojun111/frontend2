import Component from '../../lib/component';
import template from './approval-workflow.html';
import './approval-workflow.scss';

import ApprovalHeader from './workflow-seal/workflow-seal'



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


ApprovalHeader.showheader();