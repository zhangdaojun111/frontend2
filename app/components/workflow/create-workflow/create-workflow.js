import Component from "../../../lib/component";
import Mediator from "../../../lib/mediator";
import WorkFlowForm from '../../../components/workflow/workflow-form/workflow-form'
import WorkFlowGrid from '../../../components/workflow/workflow-grid/workflow-grid';
import WorkflowInitial from '../../../components/workflow/workflow-initial/workflow-initial';
import WorkFlow from '../../../components/workflow/workflow-drawflow/workflow'
import msgBox from '../../../lib/msgbox'
import FormEntrys from '../../../entrys/form'
import Grid from '../../../components/dataGrid/data-table-page/data-table-agGrid/data-table-agGrid'
import {workflowService} from '../../../services/workflow/workflow.service'
import {CreateFormServer} from '../../../services/formService/CreateFormServer';

let config = {
	template: '',
	data: {
		wfObj: '',
		temp_ids: [],
		timer: null,
		formSave: false,
		formValue: '',
		isSuccessSubmit: '',
		isFormCreated:false,
	},
	actions: {
		createWorkFlow() {
			WorkFlow.saveCallBack(this.data.workInit.actions.getDefaultFocusUsers);
			WorkFlow.createFlow({flow_id: this.data.wfObj.id, el: this.el.find("#flow-node")});
			return workflowService.validateDraftData({form_id: this.data.wfObj.formid});
		},
		async intervalSave(data) {
			let postData = {
				flow_id: this.data.wfObj.id,
				is_draft: 1,
				data: {}
			};
			postData.data = JSON.stringify(data);
			let res = await workflowService.createWorkflowRecord(postData);
			if (res.success === 1) {
				msgBox.showTips('自动保存成功！');
			}
		},
		autoSaving() {
			this.data.timer = setInterval(() => {
				let formNew = CreateFormServer.getFormValue(this.data.wfObj.tableid, false);
				let formNewStr = JSON.stringify(formNew);
				if (formNewStr != this.data.formValue && this.data.isSuccessSubmit) {
					this.data.formValue = formNewStr;
					this.actions.intervalSave(CreateFormServer.getFormValue(this.data.wfObj.tableid, false));
				}
			}, 15 * 1000);
		},
		async draftInit(res) {
			let is_draft;
            if(res.success===1){
                $('#draftBtn').show();
            }
			if (res.the_last_draft != '') {
				is_draft = await msgBox.confirm(`您于${res.the_last_draft}时填写该工作表单尚未保存，是否继续编辑？（选择【取消】或者关闭弹窗会清除草稿）`)
			} else {
				is_draft = 0;
			}
			is_draft = is_draft == true ? 1 : 0;
			this.actions.createForm(is_draft);
		},
		createForm(is_draft) {
			this.el.find('#place-form').html('');
			FormEntrys.initForm({
				reload_draft_data: is_draft,
				table_id: this.data.wfObj.tableid,
				flow_id: this.data.wfObj.id,
				el: this.el.find('#place-form'),
				real_id: '',
				from_workflow: 1,
				form_id: this.data.wfObj.formid,
				btnType: 'none',
				is_view: 0
			});
			clearInterval(this.data.timer);
			this.actions.autoSaving();
		},
		async chooseCb(msg) {
			this.data.wfObj.tableid?CreateFormServer.destoryForm(this.data.wfObj.tableid):'';
			this.data.wfObj = msg;
			this.data.isSuccessSubmit = true;
			this.actions.domChange();
			let res = await this.actions.createWorkFlow();
			this.actions.draftInit(res);
			this.data.workInit.actions.chooseCb(msg);
		},
		domChange() {
			this.el.find("#singleFlow").click();
			this.el.find("#submitWorkflow").show();
			this.el.find("#startNew").hide();
			this.el.find('#addFollower').show();
		},
		clearCloseTimer() {
			clearInterval(this.data.timer);
		},
		clearOpenTimer(msg) {
			clearInterval(this.data.timer);
			if (msg == 1) {
				this.actions.autoSaving();
			}
		},
		subscribe() {
			Mediator.subscribe('workFlow:formValueChange', (res) => {
				this.data.formValue = JSON.stringify(res);
			});
			//审批记录
			Mediator.subscribe('workFlow:record_info', (res) => {
				if(res.data && res.data.temp_id &&res.data.temp_id.value){
					this.data.temp_id=res.data.temp_id.value || '';
				}
			});
			Mediator.subscribe("form:formAlreadyCreate", () => {
				this.data.isFormCreated=true;
			});
		},
		async getGridinfo() {
			let res = await workflowService.getGridinfo({
				table_id: this.data.wfObj.tableid,
				formId: this.data.wfObj.formid,
				is_view: 0,
				parent_table_id: null,
				parent_real_id: null,
				parent_temp_id: null,
			});
			let AgGrid = new Grid({
				data:{
                    parentTempId: this.data.temp_id,
                    tableId: res.table_id,
                    viewMode: "createBatch"
                }
            });
			AgGrid.actions.returnBatchData =(ids) => {
				this.data.temp_ids = ids;
			};
			AgGrid.render(this.el.find("#J-aggrid"));
		},
		reloadForm(res) {
			if (res.success === 1) {
				this.data.isSuccessSubmit = false;
				this.el.find('#place-form').empty();
				this.data.isFormCreated=false;
				 FormEntrys.initForm({
					record_id: res.record_id,
					form_id: this.data.wfObj.formid,
					is_view: 1,
					reload_draft_data: 0,
					from_approve: 1,
					btnType: 'none',
					el: this.el.find('#place-form'),
				})
				msgBox.showTips(`执行成功`);
				let isdraft = true
				this.el.find('#addFollower').hide();
				this.el.find("#startNew").show().on('click', () => {
					console.log('点击时');
					console.log(this.data.isFormCreated);
					if (isdraft && this.data.isFormCreated) {
						this.actions.chooseCb(this.data.wfObj);
						this.el.find("#startNew").hide();
						this.el.find("#submitWorkflow").show();
						isdraft = false;
					}
				});
				WorkFlow.createFlow({
					flow_id: this.data.wfObj.id,
					record_id: res.record_id,
					el: this.el.find("#flow-node")
				});
			} else {
				msgBox.alert(`${res.error}`);
				this.el.find("#submitWorkflow").show();
			}
		},
		async submitData(data) {
			if (this.el.find("#workflow-form:visible").length > 0) {
				let formData = CreateFormServer.getFormValue(this.data.wfObj.tableid, true, true);
				if (formData.error) {
					msgBox.alert(`${formData.errorMessage}`);
				} else {
					let f_user = [];
					for(let k in data){
						f_user.push(k)
					}
					msgBox.showLoadingSelf();
					this.el.find("#submitWorkflow").hide();
					let postData = {
						flow_id: this.data.wfObj.id,
						focus_users: JSON.stringify(f_user) || [],
						data: JSON.stringify(formData.formValue),
						cache_new: JSON.stringify(formData.obj_new),
						cache_old: JSON.stringify(formData.obj_old),
					};
					let res = await workflowService.createWorkflowRecord(postData);
					msgBox.hideLoadingSelf();
					if(res.success===1 && res.error=='执行成功'){
						this.data.isSuccessSubmit=false;
						// CreateFormServer.changeToView(wfObj.tableid);
						this.el.find('#place-form').empty();
						this.data.isFormCreated=false;
						FormEntrys.initForm({
							record_id: res.record_id,
							form_id: this.data.wfObj.formid,
							is_view: 1,
							reload_draft_data:0,
							from_approve:1,
							btnType:'none',
							el:this.el.find('#place-form'),
						})
						msgBox.showTips(`执行成功`);
						let isdraft = true;
						this.el.find('#addFollower').hide();
						this.el.find("#startNew").show().on('click',()=>{
							if(isdraft && this.data.isFormCreated){
								this.actions.chooseCb(this.data.wfObj);
								this.el.find("#startNew").hide();
								this.el.find("#submitWorkflow").show();
								isdraft = false;
							}
						});
						WorkFlow.createFlow({flow_id:this.data.wfObj.id,record_id:res.record_id,el:this.el.find("#flow-node")});
					}else{
						msgBox.alert(`${res.error}`);
						this.el.find("#submitWorkflow").show();
					}
				}
			} else {
				let postData = {
					type: 1,
					temp_ids: JSON.stringify(this.data.temp_ids),
					flow_id: this.data.wfObj.id,
					unique_check: 0
				};
				if (this.data.temp_ids.length) {
					msgBox.showLoadingSelf();
					this.el.find("#submitWorkflow").hide();
					let res = await workflowService.createWorkflowRecord(postData);
					msgBox.hideLoadingSelf();
					if (res.success === 1) {
						msgBox.showTips(`执行成功`);
						this.el.find('#addFollower').hide();
						let isdraft = true;
						this.el.find("#startNew").show().on('click', () => {
							this.actions.chooseCb(this.data.wfObj);
							this.el.find("#startNew").hide();
							this.el.find("#submitWorkflow").show();
							isdraft = false;
						});
						WorkFlow.createFlow({flow_id: this.data.wfObj.id, record_id: res.record_id, el: this.el.find("#flow-node")});
					} else {
						msgBox.alert(`${res.error}`);
						this.el.find("#submitWorkflow").show();
					}
					this.data.temp_ids = [];
				} else {
					msgBox.alert(`请上传数据`);
				}
			}
		}
	},
	afterRender() {
		let _this=this;
		let actions = {
			chooseCb(msg) {
				_this.actions.chooseCb(msg);
			},
			clearCloseTimer() {
				_this.actions.clearCloseTimer();
			},
			clearOpenTimer(msg) {
				_this.actions.clearOpenTimer(msg);
			},
			getGridinfo() {
				_this.actions.getGridinfo();
			},
			submitData(res) {
				_this.actions.submitData(res);
			}
		}
		this.data.workInit = new WorkflowInitial({events:actions});
		this.data.workInit.render(this.el);
		this.data.workForm = new WorkFlowForm();
		this.data.workForm.render(this.el.find('#workflow-form'));
		this.data.workGrid = new WorkFlowGrid();
		this.data.workGrid.render(this.el.find('#workflow-grid'));
		this.actions.subscribe();
	}
}
let CreateWorkflow = Component.extend(config);
export default CreateWorkflow