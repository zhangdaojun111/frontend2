import Component from '../../lib/component';
import template from './workflow-initial.html';
import './workflow-initial.scss';
import Mediator from '../../lib/mediator';

let config={
    template: template,
    data:{},
    action:{

    },
    afterRender(){
        this.el.on('click','#singleFlow',()=>{
            Mediator.publish('workflow:autoSaveOpen', 1);
            this.el.find('#workflow-form').show();
            this.el.find('#workflow-grid').hide();
        });
        this.el.on('click','#multiFlow',()=>{
            Mediator.publish('workflow:autoSaveOpen', 0);
            this.el.find('#workflow-grid').show();
            this.el.find('#workflow-form').hide();
        });
        this.el.on('click','#submit',()=>{
            Mediator.publish('workflow:submit');
        });
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