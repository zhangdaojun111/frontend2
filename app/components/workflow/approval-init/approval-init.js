import Component from '../../../lib/component';
import Mediator from '../../../lib/mediator';
import msgBox from '../../../lib/msgbox';
import {PMAPI, PMENUM} from '../../../lib/postmsg';
import ApprovalWorkflow from '../../../components/workflow/approval-workflow/approval-workflow';
import ApprovalHeader from '../../../components/workflow/approval-header/approval-header'
import WorkflowRecord from '../../../components/workflow/approval-record/approval-record';
import WorkFlowGrid from '../../../components/workflow/workflow-grid/workflow-grid';
import WorkFlowForm from '../../../components/workflow/workflow-form/workflow-form';
import FormEntrys from '../../../entrys/form';
import {workflowService} from '../../../services/workflow/workflow.service';
import {CreateFormServer} from '../../../services/formService/CreateFormServer';
import WorkflowSeal from '../../../components/workflow/workflow-seal/workflow-seal';
import Grid from '../../../components/dataGrid/data-table-page/data-table-agGrid/data-table-agGrid'

let config = {
	data: {
		nameArr: [],
		obj: {},
		focus: [],
		is_view: '',
		tree: [],
		staff: [],
		agorfo: true,
		is_batch: 0,
		focusArr: [],
	},
	actions: {
		subscribe() {
			Mediator.subscribe("form:formAlreadyCreate", () => {
				this.data.approvalWorkflow.hideLoading();
			});
			let _this=this;
			Mediator.subscribe('workFlow:record_info', async (res) => {
				let count = 0;
				for (let comment of res.record_info.approve_tips) {
					comment['index'] = count;
					count += 1;
				}
				this.data.approvalHeader=new ApprovalHeader(res.record_info,{
					getFormTrans(res){
						_this.data.workForm.actions.getFormTrans(res);
					}
				});
				this.data.approvalHeader.render(this.el.find('#approval-info'));
				this.data.approvalHeader.hideLoading();
				this.data.workflowRecord=new WorkflowRecord(res.record_info);
				this.data.workflowRecord.render(this.el.find('#workflow-record'));
				this.data.workflowRecord.hideLoading();
				let current_node_arr = res.record_info.current_node.split('、');
				if (current_node_arr.indexOf(window.config.name) == -1) {
					this.data.is_view = 1;
					this.el.find('.for-hide').hide();
				};
				if (res.record_info.status === "已驳回到发起人" && res.record_info.start_handler === window.config.name) {
					this.el.find('.for-hide').hide();
					if (!this.data.is_view) {
						this.el.find('#re-app').show();
					}
				};
				if (res.record_info.status === "已撤回" && res.record_info.start_handler === window.config.name) {
					this.el.find('.for-hide').hide();
					if (!this.data.is_view) {
						this.el.find('#re-app').show();
					}
				};
				if (this.data.is_view) {
					this.el.find('#add-home').find('#addFollower').hide();
				}
				//审批工作流
				let result = await workflowService.getWorkflowInfo({
					url: '/get_workflow_info/',
					data: {
						flow_id: this.data.obj.flow_id,
						record_id: this.data.obj.record_id
					}
				});
				Mediator.publish('workflow:getImgInfo', result);
				Mediator.publish('workflow:gotWorkflowInfo', result);
				let a = result.data[0].updateuser2focususer;
				for (let i in a) {
					for (let j in a[i]) {
						this.data.focus.push(a[i][j]);
					}
				}
				this.data.approvalWorkflow.actions.workflowFocused(this.data.focus);
				let users = await workflowService.getWorkflowInfo({url: '/get_all_users/'});
				for (let i in this.data.focus) {
					this.data.nameArr.push(`<span class="selectSpan">${users.rows[this.data.focus[i]].name}</span>`);
				}
				this.el.find('#add-home #addFollowerList').html(this.data.nameArr);
				current_node_arr = res.record_info.current_node.split('、');
				if (this.data.nameArr.indexOf(window.config.name) > -1 && current_node_arr.indexOf(window.config.name) == -1) {
					this.el.find('.for-hide').hide();
					this.el.find('#re-app').hide();
				};
			});
			Mediator.subscribe("workflow:loaded", (e) => {
				if (e === 1) {
					if (this.data.obj.is_focus == 1 || this.data.obj.btnType === 'view') {
						this.el.find('.for-hide').hide();
					}
				}
			});
			Mediator.subscribe('workflow:focus-users', (res) => {
				this.data.focusArr = res;
			});
		},
		//驳回至发起人,重新发起
		async reApp(){
			let key =workflowService.GetQueryString('key');
			let formData = CreateFormServer.getFormValue(this.data.obj.table_id, true);
			if (formData.error) {
				msgBox.alert(`${formData.errorMessage}`);
			} else {
				let postData = {
					flow_id: this.data.obj.flow_id,
					focus_users: JSON.stringify(this.data.focusArr) || [],
					data: JSON.stringify(formData),
					record_id: this.data.obj.record_id
				};
				let res = await workflowService.createWorkflowRecord(postData);
				if (res.success === 1) {
					msgBox.alert(`${res.error}`);
				} else {
					msgBox.alert(`失败：${res.error}`);
				}
				PMAPI.sendToParent({
					type: PMENUM.close_dialog,
					key: key,
					data: {refresh: true}
				})
			}
		},
		rejToAny(res){
			this.actions.approveWorkflow({
				record_id: this.data.obj.record_id,
				action: 6,
				node_id: res.data.rejectId,
				comment: res.data.data.comment,
				comment_attachment: JSON.stringify(res.data.data['attachment']),
			});
		},
		appPass(){
			this.data.workForm.actions.appPass();
		},
		sendImgInfo(res){
			this.data.approvalWorkflow.actions.sendImgInfo(res)
		},
		signUser(signObj){
			this.actions.approveWorkflow({
				record_id: this.data.obj.record_id,
				action: 9,
				sigh_type: signObj.sigh_type,
				sigh_user_id: signObj.sigh_user_id,
				comment: signObj.comment,
				comment_attachment: JSON.stringify(signObj.attachment),
			});
		},
		recordRejStart(ispass){
			if (ispass.determine) {
				this.actions.approveWorkflow({
					record_id: this.data.obj.record_id,
					action: 2,
					comment_attachment: JSON.stringify(ispass['attachment']),
					comment: ispass['comment'],
				});
			}
		},
		appRejUp(ispass){
			if (ispass.determine) {
				this.actions.approveWorkflow({
					record_id: this.data.obj.record_id,
					action: 1,
					comment_attachment: JSON.stringify(ispass['attachment']),
					comment: ispass['comment'],
				});
			}
		},
		recordPass(data){
			this.actions.approveWorkflow({
				record_id: this.data.obj.record_id,
				action: 0, // 0：通过 1：驳回上一级 2:驳回发起人 3：作废 4：取消 5：撤回 6：驳回任意节点 7：撤回审批 8：自动拨回到发起人 9：加签
				node_id: null, //驳回节点id
				sigh_type: 0, //加签类型  0：前 1：后
				sigh_user_id: '',
				sign: data['imgInfo'][0],
				delSign: data['imgInfo'][1],
				comment_attachment: JSON.stringify(data['comment']['attachment']),
				comment: data['comment']['comment'],
			});
		},
		async init() {
			let res = await workflowService.getRecordInfo(
				{
					flow_id: this.data.obj.flow_id,
					form_id: this.data.obj.form_id,
					record_id: this.data.obj.record_id,
					is_view: this.data.is_view,
					from_approve: 1,
					from_focus: 0,
					// is_view:0,
					table_id: this.data.obj.table_id,
				}
			)
			let cannotopenform = '';
			if (res['record_info']['status'] === '已完成') {
				cannotopenform = '1';
			}
			this.data.approvalWorkflow.actions.aggridorform(res);
			this.data.is_batch = res.record_info.is_batch;
			if (this.data.is_batch == 1) {
				this.data.agorfo = false;
			}
			let AgGrid = new Grid({
				data:{
                    batchIdList: res.record_info.temp_ids,
                    tableId: this.data.obj.table_id,
                    recordId: this.data.obj.record_id,
                    viewMode: "approveBatch",
                    cannotopenform: cannotopenform,
                    parentRecordId: res['record_info']['id'],
                }
            });
			AgGrid.actions.returnBatchData =(ids) =>{
				this.data.temp_ids = ids;
			};
			AgGrid.render(this.el.find("#J-aggrid"));
		},
		async approveWorkflow(para) {
			let key = workflowService.GetQueryString('key');
			let validation_required = true
			let action_arr = [1, 2, 6, 8];
			if ((para.sigh_type == '0' && para.sigh_user_id != '') || action_arr.indexOf(para.action) != -1) {
				validation_required = false;
			}
			let formData = CreateFormServer.getFormValue(this.data.obj.table_id, true, false, validation_required);
			// comment=$('#comment').val();
			para.data = {};
			if (this.data.agorfo) {
				if (formData.error) {
					msgBox.alert(`${formData.errorMessage}`);
					return;
				} else {
					para.data = JSON.stringify(formData);
				}
			}
			para.focus_users = JSON.stringify(this.data.focusArr);
			msgBox.showLoadingSelf();
			let res =await workflowService.approveWorkflowRecord({
				url: '/approve_workflow_record/',
				data: para
			})
			msgBox.hideLoadingSelf();
			if (res.success === 1) {
				msgBox.alert(`操作成功`);
				PMAPI.sendToParent({
					type: PMENUM.close_dialog,
					key: key,
					data: {refresh: true}
				})
			} else {
				msgBox.alert(`失败：${res.error}`);
			}
		},
		async getStmpImg(){
			let data=await workflowService.getStmpImg();
			let len = data.file_ids.length;
			let obj = new Array();
			for(let i=0;i<len;i++){
				let url = {};
				url['url']= `/download_attachment/?file_id=${data.file_ids[i]}&download=0`,
					url["id"]=data.file_ids[i];
				obj.push(url);
			}
			data.url = obj;
			let _this=this;
			this.data.workSeal=new WorkflowSeal(data,{
				hideImg(){
					_this.data.workForm.actions.hideImg();
				},
				showImg(){
					_this.data.workForm.actions.showImg();
				}
			})
			this.data.workSeal.render(this.el.find('#workflow-seal'));
		}
	},
	afterRender() {
		let serchStr = location.search.slice(1);
		serchStr.split('&').forEach(res => {
			let arr = res.split('=');
			this.data.obj[arr[0]] = arr[1];
		});
		let _this=this;
		let actions={
			reApp(){
				_this.actions.reApp();
			},
			rejToAny(res){
				_this.actions.rejToAny(res);
			},
			signUser(res){
				_this.actions.signUser(res);
			},
			recordRejStart(res){
				_this.actions.recordRejStart(res);
			},
			appRejUp(res){
				_this.actions.appRejUp(res);
			},
			recordPass(res){
				_this.actions.recordPass(res);
			},
			appPass(){
				_this.actions.appPass();
			}
		}
		this.data.is_view = this.data.obj.btnType === 'view' ? 1 : 0;
		PMAPI.getIframeParams(this.data.obj.key).then(res => {
			if (res.data.current_node) {
				if (res.data.current_node.indexOf(window.config.name) === -1) {
					this.data.is_view = 1;
				}
			}
			this.data.approvalWorkflow = new ApprovalWorkflow({},actions);
			this.data.approvalWorkflow.render(this.el);
			this.data.workForm = new WorkFlowForm({},{
				sendImgInfo(res){
					_this.actions.sendImgInfo(res);
				}
			});
			this.data.workForm.render(this.el.find('#workflow-form'));
			this.data.workGrid = new WorkFlowGrid();
			this.data.workGrid.render(this.el.find('#workflow-grid'));
			FormEntrys.initForm({
				el: this.el.find('#place-form'),
				form_id: this.data.obj.form_id,
				record_id: this.data.obj.record_id,
				is_view: this.data.is_view,
				from_approve: 1,
				from_focus: 0,
				btnType: 'none',
				table_id: this.data.obj.table_id
			});
		});
		this.actions.subscribe();
		this.actions.init();
		this.actions.getStmpImg();
	},
}
export default class ApprovalInit extends Component {
	constructor(data, newConfig) {
		super($.extend(true, {}, config, newConfig), data);
	}

}