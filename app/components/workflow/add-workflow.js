import Component from '../../lib/component';
import template from './add-workflow.html';
import './approval-workflow.scss';
import './add-workflow.scss';
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
        let _this=this;
        Mediator.subscribe('workflow:gotWorkflowInfo', (msg)=> {
            this.data.workflowData=msg.data[0];
            WorkFlow.show(msg.data[0],'#drawflow');
        });
        Mediator.subscribe('workflow:getParams', (res)=> {
            let htmlStr=``;
            for(var i in res){
                htmlStr+=`<option data-flow_id=${res[i].flow_id} data-form_id=${res[i].form_id}>${res[i].flow_name}</option>`;
            }
            this.el.find('#wf-select').html(htmlStr);
            let o={};
            console.log(_this.el.find('#wf-select option'));
            o.flow_id=_this.el.find('#wf-select option:first').data('flow_id');
            o.form_id=_this.el.find('#wf-select option:first').data('form_id');
            Mediator.publish('workflow:getflows', o);
        });
        this.el.find('#wf-select').on('change',()=>{
            let o={};
            o.flow_id=this.el.find('#wf-select option:selected').data('flow_id');
            o.form_id=this.el.find('#wf-select option:selected').data('form_id');
            Mediator.publish('workflow:getflows', o);
        })

        this.el.find('#submit').on('click',()=>{
            Mediator.publish('workflow:submit', 1);
        });
        this.el.find('#print').on('click',()=>{
            window.print();
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
