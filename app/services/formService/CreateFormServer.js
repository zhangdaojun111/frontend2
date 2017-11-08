import FormBase from '../../components/form/base-form/base-form';
import {FormService} from './formService'
import Mediator from '../../lib/mediator';
import {CreateForm} from '../../components/form/createFormVersionTable/createForm'

export const CreateFormServer={
	//存储所有创建的baseForm组件
	childForm: {},
	//是否是系统表
	isloadCustomTableForm: false,
	//是否加载工作流
	isloadWorkflow: false,
	//存储其它模块传来的数据
	data: {},
	//初始化配置数据
	init(config = {}) {
		this.data = {}
		//表名
		this.data.tableId = config.table_id || '';
		//父表真实字段
		this.data.parentRealId = config.parent_real_id || '';
		//父表临时字段
		this.data.parentTempId = config.parent_temp_id || '';
		//数据id
		this.data.realId = config.real_id || '';
		this.data.tempId = config.temp_id || '';
		//父表表名
		this.data.parentTableId = config.parent_table_id || '';
		this.data.parentRecordId = config.parent_record_id || '';
		//可编辑（0）or不可编辑（1）
		this.data.isView = config.is_view || 0;
		this.data.isBatch = config.is_batch || 0;//是否是批量工作流
		this.data.inProcess = config.in_process || 0;//是否是在途
		this.data.recordId = config.record_id || '';
		this.data.el = config.el || '';//form的外层dom
		this.data.reloadDraftData = config.reload_draft_data || 0;//工作流接口用到
		this.data.formId = config.form_id || '';//表单ID
		this.data.fromWorkFlow = config.from_workflow || 0;//是否来自工作流
		this.data.flowId = config.flow_id || '';//流程ID
		this.data.fieldId = config.field_Id || '';//字段ID
		this.data.key = config.key || '';//iframe的key
		this.data.fromApprove = config.from_approve || '';//是否来自审批
		this.data.isAddBuild = config.isAddBuild || 0;//是否是快捷添加内置
		this.data.buildId = config.id || '';//快捷添加的key
		this.data.btnType = config.btnType || 'new';//按钮
		this.data.viewMode = config.viewMode || '0';//aggrid权限
        this.data.requestFormData = config.requestFormData=='1'?1:0;//不请求表单数据
        this.data.noRequestFormData = config.noRequestFormData||[];//不请求表单数据时候的表单数据
		this.data.inProcess = config.in_process || '0';//是否查询临时数据
		this.data.data_from_row_id = config.data_from_row_id || '';//半触发操作
		this.data.operation_id = config.operation_id || '';//半触发操作
	}
	,
	//静态数据里是否有这个key
	hasKeyInFormDataStatic(key, staticData) {
		let isExist = false;
		for (let dict of staticData["data"]) {
			if (dict["dfield"] == key) {
				isExist = true;
			}
		}
		return isExist;
	},
	//找到加载表单数据的formId和加载节点的flowId
	findFormIdAndFlowId(res) {
		if (res["data"] && res["data"]["flow_data"].length != 0) {
			if (this.data.flowId) {
				let selectItems = res["data"]["flow_data"];
				for (let item of selectItems) {
					if (item["flow_id"] == this.data.flowId) {
						this.data.formId = item["form_id"];
					}
				}
			} else {
				//默认的form_id和flow_id取第一个select
				this.data.formId = res["data"]["flow_data"][0]["form_id"];
				this.data.flowId = res["data"]["flow_data"][0]["flow_id"];
				//循环一遍，查看是否有默认值，如果有，则form_id和flow_id改变
				for (let d of res["data"]["flow_data"]) {
					if (d["selected"] == 1) {
						this.data.formId = d["form_id"];
						this.data.flowId = d["flow_id"];
					}
				}
			}
		}
		if (res["data"] && res["data"]["form_id"] != 0) {
			this.data.formId = res["data"]["form_id"];
			this.data.isloadCustomTableForm = true;
		} else {
			this.data.isloadWorkflow = true;
		}
	},
	//拼装发送json
	createPostJson() {
		let json;
		//如果是发起工作流
		if (this.data.fromWorkFlow && this.data.realId == '') {
			json = {
				form_id: this.data.formId,
				record_id: this.data.recordId,
				reload_draft_data: this.data.reloadDraftData,
				from_workflow: this.data.fromWorkFlow,
				table_id: this.data.tableId
			}
			this.data.isloadWorkflow = true;
		} else if (this.data.fromApprove && this.data.realId == '') {//审批流程
			json = {
				form_id: this.data.formId,
				record_id: this.data.recordId,
				is_view: this.data.isView,
				from_approve: this.data.fromApprove,
				from_focus: this.data.fromFocus || 0,
				table_id: this.data.tableId
			}
			this.data.isloadWorkflow = true;
		}
		else {
			json = this.pickJson();
		}
		if( this.data.inProcess == 1 ){
			json = {
				form_id: this.data.formId,
				record_id: this.data.recordId,
				is_view: this.data.isView,
				from_approve: 1,
				from_focus: 0,
				table_id: this.data.tableId
			}
		}
		//如果有tempId优先传tempId
		if( this.data.tempId ){
			json['temp_id'] = this.data.tempId
			json['real_id'] = ''
		}
		if( this.data.data_from_row_id ){
			json['data_from_row_id'] = this.data.data_from_row_id;
			json['operation_id'] = this.data.operation_id;
		}
		return json;
	},
	//非工作流请求json
	pickJson() {
		let json = {};
		if (this.data.fieldId !== "") {
			//加载单元格数据
			json = {
				field_id: this.data.fieldId,
				is_view: this.data.isView,
				parent_table_id: this.data.parentTableId || "",
				parent_real_id: this.data.parentRealId || "",
				parent_temp_id: this.data.parentTempId || ""
			}
		} else {
			//加载表单中所有数据，当有form_id时，不要为table_id赋值，保证缓存的可复用性
			if (this.data.formId) {
				json = {
					form_id: this.data.formId,
					table_id: this.data.tableId,
					is_view: this.data.isView,
					parent_table_id: this.data.parentTableId || "",
					parent_real_id: this.data.parentRealId || "",
					parent_temp_id: this.data.parentTempId || ""
				}
				this.data.isloadCustomTableForm = true;
			} else {
				//默认表单数据
				json = {
					form_id: "",
					table_id: this.data.tableId,
					is_view: this.data.isView,
					parent_table_id: this.data.parentTableId || "",
					parent_real_id: this.data.parentRealId || "",
					parent_temp_id: this.data.parentTempId || ""
				}
			}
		}
		//如果是临时表(在途，批量工作流)，传temp_id，否则是real_id
		if (this.data.inProcess == 1 || this.data.isBatch == 1 ) {
			json["temp_id"] = this.data.realId;
		}
		else {
			json["real_id"] = this.data.realId;
		}
		return json;
	},
	//merge static和dynamic数据,将dynamic中的动态数据 替换掉static中的静态数据，保证数据正确
	mergeFormData(staticData, dynamicData) {
		for (let dfield in dynamicData["data"]) {
			if (this.hasKeyInFormDataStatic(dfield, staticData)) {
				for (let dict of staticData["data"]) {
					if (dict["dfield"] == dfield) {
						for (let k in dynamicData["data"][dfield]) {
							if(k == 'options'){
								dict[k]=dict[k].concat(dynamicData["data"][dfield][k]);
							}else{
								dict[k] = dynamicData["data"][dfield][k];
							}
						}
					}
				}
			} else {
				staticData["data"].push(dynamicData["data"][dfield]);
			}
		}
		staticData["record_info"] = dynamicData["record_info"];
		staticData["parent_table_id"] = dynamicData["parent_table_id"];
		staticData["frontend_cal_parent_2_child"] = dynamicData["frontend_cal_parent_2_child"];
		staticData["error"] = dynamicData["error"];
		let data = {};
		if (!this.data.formId || staticData['form_id'] == this.data.formId) {
			this.parseRes(staticData);
		}
		//存储初始表单数据
		staticData.formData = staticData.data;
		//转换存储格式，用dfield当做key来存储data
		for (let obj of staticData.data) {
			data[obj.dfield] = obj;
		}
		staticData.data = data;
		//将外部模块的值赋值给baseForm
		_.defaultsDeep(staticData, this.data)
		staticData.tableId = staticData['table_id'] || this.data.tableId;
		return staticData;

	},
	//处理字段数据,换了个变量名
	parseRes(res) {
		if (res !== null) {
			let formData = res["data"];
			if (formData.length != 0) {
				let myDate = new Date();
				let myYear = myDate.getFullYear();
				let parentRealId = '';
				let parentTableId = '';
				let parentTempId = '';
				for (let data of formData) {
					if (data['id'] == 'real_id') {
						parentRealId = data['value'];
					} else if (data['id'] == 'table_id') {
						parentTableId = data['value'];
					} else if (data['id'] == 'temp_id') {
						parentTempId = data['value'];
					}
				}
				for (let data of formData) {
					data['tableId'] = this.tableId;
					if (data.type == "Year") {
						if (data.value == "") {
							data.value = String(myYear);
						}
					} else if (data.type == "Correspondence") {
						data['parent_real_id'] = parentRealId;
						data['parent_table_id'] = parentTableId;
						data['parent_temp_id'] = parentTempId;
					} else if (data.type == "Datetime") {
						// if( data.value.length == 19 ){
						//     data.value = data.value.slice( 0,16 )
						// }
					}
				}

				if (res['record_info']['id']) {
					let recordId = res['record_info']['id'];
					res.recordId = res['record_info']['id'];
					for (let d of res.data) {
						if (d['type'] == 'Songrid') {
							d['recordId'] = recordId;
						}
					}
				}
			}
		}
	},
	//清除所有已建form
	destoryAll() {
		for (let key in this.childForm) {
			this.childForm[key].destroySelf();
			delete this.childForm[key];
		}
	},
	//销毁单个form实例
	destoryForm(tableID) {
		if (this.childForm[tableID]) {
			this.childForm[tableID].destroySelf();
			delete this.childForm[tableID];
		}
	},
	//检查所要打开的表单类型
	async checkFormType(data, res) {
		//获取公司名称
		let company = data["company_name"];
		//获取是否加载定制表单
		let isloadCustom = data["custom_form_exists"] == 1;
		//获取是否加载各个公司定制的系统表
		let companyCustomTableFormExists = data["company_custom_table_form_exists"] == '1';
		//是否加载系统自带的系统表
		let customTableFormExists = data["custom_table_form_exists"] == '1';
		//是否有其他字段
		data.hasOtherFields = data["show_other_fields"];
		//sys_type
		let sys_type = data["sys_type"];
		//审批中的提示信息
		let record_tip = data["record_tip"];
		let html = '';
		//加载表单
		if (companyCustomTableFormExists) {
			try {
				//加载各个公司定制的系统表
				cosnole.log('加载公司定制系统表');
			} catch (e) {
				console.error(`加载${ company }定制的系统表，table_id为：${ this.data.tableId }的表单失败`);
				console.error(e);
			}
		} else if (customTableFormExists) {
			try {
				//加载系统定制的系统表
				console.log('加载系统定制表');
				sys_type == "normal" ? sys_type = this.data.tableId : sys_type;
				html = await CreateForm.creatSysTable(sys_type, data);
			} catch (e) {
				console.error(`加载系统表，table_id为${ this.data.tableId }的表单失败`);
				console.error(e);
			}
		} else if (this.data.formId !== "") {
			if (isloadCustom) {
				try {
					//加载定制表单
					console.log('加载定制表单')
				} catch (e) {
					console.error(`加载${ company }的定制表单，form_id为：${ this.data.formId }的表单失败`);
					console.error(e);
				}
			} else if (this.data.isloadCustomTableForm || this.data.isloadWorkflow) {
				try {
					//加载个人制作的表单
					console.log('加载个人制作表单');
					if(res[2]['data']['content']){
						html = res[2]['data']['content'];
					}else{
						html = CreateForm.formDefaultVersion(res[0].data);
					}

				} catch (e) {
					console.error(`加载${ company }的个人制作的表单，form_id为：${ this.data.formId }的表单失败`);
					console.error(e);
				}
			} else {
				try {
					console.log('加载默认表单')
					html = CreateForm.formDefaultVersion(res[0].data);
				} catch (e) {
					console.error(`加载系统自带的默认表单失败`);
					console.error(e);
				}
			}
		} else {
			try {
				console.log('加载默认表单')
				html = CreateForm.formDefaultVersion(res[0].data);
			} catch (e) {
				console.error(`加载系统自带的默认表单失败`);
				console.error(e);
			}
		}
		return html;
	},

	//转到编辑模式

	changeToEdit(tableId) {
		this.childForm[tableId].data.isOtherChangeEdit = true;//如果是外部模块的转编辑模式
		this.childForm[tableId].actions.changeToEdit();
	},

	//审批删除时重置表单可编辑性
	//暂时无用
	editDelWorkFlow(tableId, formId) {
		this.childForm[tableId].actions.editDelWork(formId);
	},

	//接收关注人信息
	//暂时无用
	setUserIdList(tableId, data) {
		if (!this.childForm[tableId]) {
			return;
		}
		this.childForm[tableId].data.focus_users = data;
	},

	//对外部模块提供获取表单数据接口
	//@param tableId表名 isCheck是否需要baseform执行表单数据验证
	getFormValue(tableId, isCheck,needCache) {
		if (!this.childForm[tableId]) {
			return;
		}
		return needCache?Object.assign({formValue:this.childForm[tableId].actions.getFormValue(isCheck)},this.childForm[tableId].actions.getCacheData()):this.childForm[tableId].actions.getFormValue(isCheck);
	},

	//转到查看模式

	changeToView(tableId) {
		this.childForm[tableId].data.isOtherChangeView = true;//如果是外部模块的转编辑模式
		this.childForm[tableId].actions.changeToView();
	},

	async getData(){
			let res;
			if(this.data.requestFormData!=1){
				if (!this.data.formId) {
					//获取表单的form_id
					res = await  FormService.getPrepareParmas({table_id: this.data.tableId});
					this.findFormIdAndFlowId(res);
				}
				//创建请求
				let json = this.createPostJson();
				res=await FormService.getFormData(json);
				//将表单名称发送给工作流
			}else {
				console.log("不请求表单数据。")
				res = this.data.noRequestFormData;
			}
			//将表单名称发送给工作流
			return  res
	},

	checkRes(res){
		Mediator.emit('form: dataRes', res);
		Mediator.publish('workflow:getWorkflowTitle', res[0].table_name);
		if(res[1]['error'] == '您没有数据查看权限' || res[1]['error'] == '您没有查看该条数据的权限' || res[0]['error'] == '您没有数据查看权限' || res[0]['error'] == '您没有查看该条数据的权限'  ) {
			this.data.el.find('.form-print-position').append('<p style="font-size:20px;text-align: center;margin-top: 35px;margin-bottom: 3px;">您没有数据查看权限</p>');
            Mediator.publish('form:formAlreadyCreate', 'success');
			Mediator.publish('form:formAlreadyCreate' + this.tableId, 'success');
			return false;
		}
		return true;
	},

	async createFormData(res){
		//处理static,dynamic数据
		let data = this.mergeFormData(res[0], res[1]);
		//检查表单类型
		let template = await this.checkFormType(data, res);
		//发送审批记录
		Mediator.publish('workFlow:record_info', data);
		return {
			template: template,
			data: data,
		};
	},

	async renderForm(res){
		let formBase = new FormBase(await this.createFormData(res));
		this.childForm[this.data.tableId] = formBase;
		let $newWrap = this.data.el.find('.form-print-position');
		formBase.render($newWrap);
		Mediator.publish('form:formAlreadyCreate', 'success');
		Mediator.publish('form:formAlreadyCreate'+this.tableId, 'success');
		console.timeEnd('form创建时间');
		//给工作流传表单初始数据
		let valueChange = this.getFormValue(this.data.tableId, false)
		Mediator.publish('workFlow:formValueChange', valueChange);
	}
}