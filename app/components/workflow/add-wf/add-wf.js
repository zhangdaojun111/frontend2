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
			});
		}
	},
	afterRender(){
		this.data.addWf=new AddWf({data:obj:this.data.obj});
		this.data.addWf.render(this.el);
		this.data.workFlowForm=new WorkFlowForm();
		this.data.workFlowForm.render(this.el.find('#workflow-form'));
		this.actions.subscribe();

	}
}

export default class AddWfInit extends Component{
	constructor(extendConfig){
		super($.extend(true, {}, config, extendConfig));
	}
}