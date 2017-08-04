import Component from '../../lib/component';
import template from './workflow-divFramework.html';
import './workflow-divFramework.scss';

let config={
    template: template,
    data:{},
    action:{

    },
    afterRender(){

    }
};
class WorkflowDivFramework extends Component{
    constructor (data){
        super(config,data);
    }
}

let component = new WorkflowDivFramework();
let el = $('#WorkflowDivFramework');
component.render(el);