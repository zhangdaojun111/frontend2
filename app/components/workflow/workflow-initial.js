import Component from '../../lib/component';
import template from './workflow-initial.html';
import './workflow-initial.scss';
import Mediator from '../../lib/mediator';

// import WorkFlowCatalog from './workflow-catalog/workflow-catalog'

let config={
    template: template,
    data:{
        user:[]
    },
    actions:{

    },
    afterRender(){
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
        $(".h_panghu").on("webkitAnimationEnd",function () {
            $(this).addClass("h_panghu2");
            setTimeout(function () {
                $(".h_panghu_mask").remove()
            },2000)
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