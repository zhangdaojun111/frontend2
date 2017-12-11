/**
 * @author qiumaoyun、 luyang
 * 驳回节点操作
 */
import template from './approval-dialog.html';
import Component from '../../../lib/component';
import Mediator from '../../../lib/mediator';
import '../../../assets/scss/core/common.scss'
import WorkFlow from '../workflow-drawflow/workflow';
import {PMAPI,PMENUM} from "../../../lib/postmsg";
import '../../../assets/scss/workflow/workflow-base.scss';
import {CreateFormServer} from '../../../services/formService/CreateFormServer';
import {workflowService} from '../../../services/workflow/workflow.service';
import msgBox from '../../../lib/msgbox';

let serchStr = location.search.slice(1),nameArr=[],obj = {},focus=[],is_view,tree=[],staff=[];
serchStr.split('&').forEach(res => {
    let arr = res.split('=');
    obj[arr[0]] = arr[1];
});

let config = {
    // template: template.replace(/(\")/g, '\''),
    template: template,
    data: {
        workflowData:null,
	    obj:{}
    },
	actions: {
		async approveWorkflow(para) {
			let key = this.data.obj.key;
			let formData = CreateFormServer.getFormValue(this.data.obj.table_id),
				//comment = this.el.find('#comment').val();
            comment=$('.content .editor').val();
			para.data = JSON.stringify(formData);
			para.comment = comment;
			para.focus_users = JSON.stringify(focusArr);
			let res = await  workflowService.approveWorkflowRecord({
				url: '/approve_workflow_record/',
				data: para
			});
			if (res.success === 1) {
				msgBox.alert(`操作成功`);
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
	afterRender: function () {
		let serchStr = location.search.slice(1);
		let _this=this;
		serchStr.split('&').forEach(res => {
			let arr = res.split('=');
			console.log(_this.data);
			_this.data.obj[arr[0]] = arr[1];
		});
		this.data.comment = '';
		Mediator.subscribe('approvalRejToAny: data', (res) => {
			PMAPI.sendToParent({
				type: PMENUM.close_dialog,
				key: this.data.obj.key,
				data: {
					data: res
				}
			});
		});
		PMAPI.getIframeParams(this.data.obj.key).then(res => {
			// WorkFlow.createFlow({flow_id: res.data.flow_id, record_id: res.data.record_id, el: "#approvalDialog-box"});
			WorkFlow.createFlow({flow_id: res.data.flow_id, record_id: res.data.record_id, el: this.el.find("#approvalDialog-box")});
		});
		this.el.on('click', '.draged-item', function () {
			WorkFlow.rejectNode(this);
		});
	},
	beforeDestory: function () {
		Mediator.removeAll('approval:rejToAny');
	}
};
class ApprovalDialog extends Component{
	constructor(extendConfig){
		super($.extend(true, {}, config, extendConfig));
	}
}

export default ApprovalDialog

