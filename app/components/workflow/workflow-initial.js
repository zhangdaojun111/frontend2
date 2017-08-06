import Component from '../../lib/component';
import template from './workflow-initial.html';
import './workflow-initial.scss';

let config={
    template: template,
    data:{},
    action:{

    },
    afterRender(){

    }
};
class WorkflowInitial extends Component{
    constructor (data){
        super(config,data);
    }
}

let component = new WorkflowInitial();
let el = $('#WorkflowInitial');
component.render(el);