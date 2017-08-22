import Component from '../../lib/component';
import template from './workflow-initial.html';
import './workflow-initial.scss';
import '../../assets/scss/workflow/workflow-base.scss';
import Mediator from '../../lib/mediator';
import WorkflowAddFollow from './workflow-addFollow/workflow-addFollow';

let config={
    template: template,
    data:{
        user:[]
    },
    actions:{

    },
    afterRender(){

        this.el.on('click','#workflowClose',()=>{
            this.el.find('.J_select-Workflow').text("选择或输入查找");
            this.el.find("#workflow-box").show();
            this.el.find('#workflow-content').hide();
        }),
        this.el.on('click','#singleFlow',(e)=>{
            let ev =$(e.target);
            ev.addClass("selected");
            this.el.find("#multiFlow").removeClass("selected");
            Mediator.publish('workflow:autoSaveOpen', 1);
            this.el.find('#workflow-form').show();
            this.el.find('#workflow-grid').hide();
        });
        this.el.on('click','#multiFlow',(e)=>{
            let ev =$(e.target);
            ev.addClass("selected");
            this.el.find("#singleFlow").removeClass("selected");
            Mediator.publish('workflow:autoSaveOpen', 0);
            this.el.find('#workflow-grid').show();
            this.el.find('#workflow-form').hide();
        });
        this.el.on('click','#submit',()=>{
            let user=[];
            Mediator.subscribe('workflow:focus-users', (res)=> {
                this.data.user=res;
            })
            Mediator.publish('workflow:submit',this.data.user);
            
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

// WorkFlowCatalog.showCatalog();