import Component from "../../../lib/component";
import Mediator from "../../../lib/mediator";
import AddWf from '../../../components/workflow/add-workflow/add-workflow';
import WorkFlowForm from '../../../components/workflow/workflow-form/workflow-form';

let config ={
	data:{
		isshow:true,
	},
	actions:{
		subscribe(){
			Mediator.subscribe("form:formAlreadyCreate",()=>{
				if(this.data.isshow){
					this.data.addWf.hideLoading();
					this.data.isshow = false;
				}
                if(this.data.obj.tableType !== 'child' && this.data.obj.btnType === 'new' && !this.data.obj.isCalendar && !this.data.obj.isAddBuild){
                    this.el.find('#miniFormBtn').show();
                }else{
                    this.el.find('#miniFormBtn').hide();
                }
			});
		}
	},
	afterRender(){
		this.data.addWf=new AddWf({data:{obj:this.data.obj}});
		this.data.addWf.render(this.el);
		this.data.workFlowForm=new WorkFlowForm();
		this.data.workFlowForm.render(this.el.find('#workflow-form'));
		this.actions.subscribe();
	}
};

let AddWfInit = Component.extend(config);
export default AddWfInit