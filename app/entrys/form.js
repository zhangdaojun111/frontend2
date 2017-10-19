import Mediator from '../lib/mediator';
import {CreateFormServer} from "../services/formService/CreateFormServer";
import '../assets/scss/form.scss'
import '../assets/scss/core/print.scss'
import '../assets/scss/form/form.scss';

let FormEntrys = {
	createHtml() {
		$(`<div data-id="form-${CreateFormServer.data.tableId}" style="" class="table-wrap wrap detail-form"><div class="form-print-position"></div></div>`).prependTo(CreateFormServer.data.el);
	},
	emitTableName(res) {
		Mediator.publish('workflow:getWorkflowTitle', res[0].table_name);
	},
	async createForm(config = {}) {
		console.time('获取表单数据的时间');
		this.createHtml();
		let res = await CreateFormServer.getData();
		//将表单名称发送给工作流
		this.emitTableName(res);
		if (!CreateFormServer.checkRes(res)) {
			return;
		}
		;
		console.timeEnd('获取表单数据的时间');
		console.time('form创建时间');
		CreateFormServer.renderForm(res);
	},
	initForm(config) {
		//初始化数据
		CreateFormServer.init(config);
		this.createForm();
	}
}
export default FormEntrys