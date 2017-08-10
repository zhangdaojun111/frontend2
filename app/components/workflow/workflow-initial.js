import Component from '../../lib/component';
import template from './workflow-initial.html';
import './workflow-initial.scss';
import Mediator from '../../lib/mediator';
import dataGrid from '../../components/dataGrid/data-table-page/data-table-page'

let config={
    template: template,
    data:{
        user:[]
    },
    actions:{
        myGrid:function () {
            if(this.el.find("#dataGrid").html()===''){
                let Grid=new dataGrid();
                this.append(Grid,"#dataGrid")
            }
        }
    },
    afterRender(){
        this.el.on('click','#singleFlow',()=>{
            Mediator.publish('workflow:autoSaveOpen', 1);
            this.el.find('#workflow-form').show();
            this.el.find('#workflow-grid').hide();
        });
        this.el.on('click','#multiFlow',()=>{
            Mediator.publish('workflow:autoSaveOpen', 0);
            this.actions.myGrid()
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