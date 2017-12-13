﻿/**
 *@author yudeping
 *表单主要逻辑
 */

import Component from '../../../lib/component';
import MSG from '../../../lib/msgbox';
import './base-form.scss';
import TextArea from '../textarea-control/textarea-area'
import Radio from '../radio-control/radio-control';
import Input from '../input-control/input-control';
import Readonly from '../readonly-control/readonly-control';
import Password from '../encrypt-input-control/encrypt-input-control';
import Hidden from '../hidden-control/hidden-control';
import SelectControl from "../select-control/select-control";
import YearControl from "../year-control/year-control";
import BuildInControl from "../buildIn-control/buildIn-control";
import MultiLinkageControl from "../multi-linkage-control/multi-linkage-control";
import YearMonthControl from "../year-month-control/year-month-control";
import TimeControl from "../time-control/time-control";
import DateControl from "../date-control/date-control";
import DateTimeControl from "../datetime-control/datetime-control";
import Mediator from "../../../lib/mediator";
import {FormService} from "../../../services/formService/formService"
import {fieldTypeService, FIELD_TYPE_MAPPING} from "../../../services/dataGrid/field-type-service"
import MultiSelectControl from "../multi-select-control/multi-select-control";
import EditorControl from "../editor-control/editor";
import SettingTextareaControl from "../setting-textarea-control/setting-textarea";
import AddItem from '../add-item/add-item';
import {PMAPI, PMENUM} from '../../../lib/postmsg';
import History from '../history/history'
import AddEnrypt from '../encrypt-input-control/add-enrypt'
import {md5} from '../../../services/login/md5';
import AttachmentControl from "../attachment-control/attachment-control";
import SettingPrint from '../setting-print/setting-print'
import Songrid from '../songrid-control/songrid-control';
import Correspondence from '../correspondence-control/correspondence-control';
import ContractControl from "../contract-control/contract-control";
import '../../../../node_modules/jquery-ui/ui/widgets/tabs';
import {CreateFormServer} from "../../../services/formService/CreateFormServer";

let config = {
	template: '',
	data: {
		//其他字段的数据
		dataOfOtherFields: '',
		//父表填充子表的id集合
		idsOfSonDataByParent: [],
		//本地存储已经触发默认值的数组
		baseIdsLocal: [],
		//本地存储默认值数据的dict，{ dfield: value }
		baseIdsLocalDict: {},
		//用于比较统计数据dict的dict
		myUseFields: {},
		//所有选择对应的选项
		optionsToItem: {},
		//流程Id
		flowId: '',
		//本地存储默认值数据的dict，{ dfield: value }
		baseIdsLocalDict: {},
		//用于比较字段插件配置的list
		myPluginFields: [],
		//是否验证必填
        validation_required: true,
		vote_value:'',
		vote_key:'',
		submitKey:[],
		validation_required: true,
		postData: [],
		isSongCount: false,
		webCalc: {},
		SongridRef:false,
	},
	binds: [{
		event: 'click',
		selector: '.save',
		//阻止表单数据提交之前多次提交
		callback: function () {
			if (this.data.isBtnClick) {
				return;
			}
			this.data.isBtnClick = true;
			this.actions.onSubmit();
		}
	}, {
		event: 'click',
		selector: '.changeEdit',
		//阻止用户连续快速切换编辑模式
		callback: function () {
			if (this.data.isBtnClick) {
				return;
			}
			this.data.isBtnClick = true;
			this.actions.changeToEdit();
		}
	}],
	actions: {
		md5: md5,
		//子表填充父表的数据
		setDataFromParent() {
			// if(!this.globalService.fromSongridControl){return false;}
			if (this.data.parentTableId !== "" && window.top.frontendRelation[this.data.parentTableId] && window.top.frontendRelation[this.data.parentTableId][this.data.tableId]) {
				//父子表对应的kv关系
				let kvDict = window.top.frontendRelation[this.data.parentTableId][this.data.tableId]["pdfield_2_cdfield"];
				//父表的this.form.value
				let formDataFromParent = window.top.frontendParentFormValue[this.data.parentTableId];
				//组装子表所需列表或表单中内置或相关的父表中数据
				let parentData = FormService.packageParentDataForChildData(kvDict, formDataFromParent, this.data.parentTableId);
				//子表的this.newData
				let newDataFromSongrid = window.top.frontendParentNewData[this.data.tableId];
				this.actions.setValueForChild(kvDict,parentData,newDataFromSongrid);
				this.actions.idsInChildTableToParent();
			}
		},

		//循环给子表赋值
		setValueForChild(kvDict,parentData,newDataFromSongrid){
			for (let key in kvDict) {
				let val = parentData[key];
				//子表的dfield
				let songridDfield = kvDict[key];
				//判断子表类型
				if (newDataFromSongrid.hasOwnProperty(songridDfield)) {
					this.data.idsOfSonDataByParent.push(songridDfield);
					let dinput_type = newDataFromSongrid[songridDfield]["dinput_type"] || "";
					let options = [{value: val, label: val}];
					if (FIELD_TYPE_MAPPING.SELECT_TYPE.indexOf(dinput_type) != -1) {
						let options = [{value: val, label: val}];
						this.data.data[songridDfield]["options"] = options;
						if (this.data.childComponent[songridDfield]) {
							this.data.childComponent[songridDfield].data["options"] = options;
						}
					}
					if (val || val == '') {
						this.actions.setFormValue(songridDfield, val);
					}
					// this.actions.triggerSingleControl(songridDfield);
				}
			}
		},

		idsInChildTableToParent(){
			if (window.top.idsInChildTableToParent.hasOwnProperty(this.data.tableId)) {
				window.top.idsInChildTableToParent[this.data.tableId].concat(this.data.idsOfSonDataByParent);
			} else {
				window.top.idsInChildTableToParent[this.data.tableId] = JSON.parse(JSON.stringify(this.data.idsOfSonDataByParent));
			}
		},

		//主动触发指定字段的所有事件
		triggerSingleControl(key,noCount) {
			let val = this.data.data[key]["value"];
			if (val.toString() != "" || !$.isEmptyObject(val)) {
				if ($.isArray(val)) {
					if (val.length != 0) {
						this.actions.checkValue(this.data.data[key],noCount);
					}
				} else {
					this.actions.checkValue(this.data.data[key],noCount);
				}
			}
		},

		//给子表统计赋值
		async setCountData(dfield) {
    		MSG.showLoadingSelf();
    		this.data.postData.push(dfield);
			this.data.isSongCount = true;
			this.actions.getDataForForm();
    		MSG.hideLoadingSelf();
		},

		//给外部提供formValue格式数据
		//@param isCheck判断是否需要执行表单校验
		getFormValue(isCheck) {
			// this.actions.changeValueForChildTable(this.data.data);
			return isCheck ? this.actions.createFormValue(this.data.data, true) : this.actions.createFormValue(this.data.data);
		},

		//根据dfield查找控件类型
		findTypeByDfield(dfield) {
			let type = '';
			for (let obj of this.data.formData) {
				if (obj["dfield"] == dfield) {
					type = obj["type"];
				}
			}
			return type;
		},

		//把子表内置父表的值都改成parent_temp_id
		changeValueForChildTable(data) {
			for (let key in data) {
				let type = this.actions.findTypeByDfield(key);
				let val = data[key];
				let parentTempId = data["parent_temp_id"];
				if ((window.top.idsInChildTableToParent[this.data.tableId] && window.top.idsInChildTableToParent[this.data.tableId].indexOf(key) != -1 ) && val != "" && parentTempId != "" && (type == 'Buildin' || type == 'Select')) {
					data[key] = data["parent_temp_id"];
				}
			}
		},

		//创建cache数据
		//@param formData原始表单数据,val当前表单数据,isNew 是否是cacheNew
		createCacheData(formData, val, isNew) {
			let obj = {};
			for (let key in formData) {
				//自增编号old_cache置为空
				let data = formData[key];
				if (data.dinput_type && data.dinput_type == '14' && !isNew) {
					obj[data.dfield] = "";
				}
				for (let key in val) {
					if (key == data.dfield) {
						if (FormService.dataSelectFrom[data.type]) {
							let select = FormService.dataSelectFrom[data.type];
							if (data.type == "MultiSelect") {
								this.actions.changeMultiSelectCacheValue(isNew,data,val,obj,key)
							} else if (data.type == "MultiLinkage") {
								this.actions.changeMultiLinkageCacheValue(isNew,data,val,obj,key);
							} else if (data.type == "SettingTextarea") {//周期规则
								this.actions.changeSettingTextareaCacheValue(isNew,data,val,obj,key);
							} else {
								this.actions.changeSelectCacheValue(isNew,data,val,obj,key,select);
							}
						} else {
							this.actions.checkNumberData(isNew,data,val,obj,key);
						}
					}
				}
			}
			return obj;
		},
		changeSelectCacheValue(isNew,data,val,obj,key,select){
			for (let option of data[select]) {
				if (isNew) {
					if (option.value == val[key]) {
						obj[key] = option.label;
					}
				} else {
					if (option.value == data.value) {
						obj[key] = option.label;
					}
				}
			}
		},
		changeSettingTextareaCacheValue(isNew,data,val,obj,key){
			obj[key] = '';
			if (isNew) {
				obj[key] = val[key][-1];
			} else {
				obj[key] = data.value[-1] || ''
			}
		},
		changeMultiLinkageCacheValue(isNew,data,val,obj,key){
			obj[key] = [];
			let list = data['dataList'];
			if (isNew) {
				obj[key] = JSON.stringify(list[val[key]]);
			} else {
				obj[key] = JSON.stringify(list[data.value]);
			}
		},
		changeMultiSelectCacheValue(isNew,data,val,obj,key){
			obj[key] = [];
			for (let option of data['options']) {
				if (isNew) {
					if (val[key].indexOf(option.value) != -1) {
						obj[key].push(option.label);
					}
				} else {
					if (data.value.indexOf(option.value) != -1) {
						obj[key].push(option.label);
					}
				}
			}
			obj[key] = JSON.stringify(obj[key]);
		},

		checkNumberData(isNew,data,val,obj,key){
			if (isNew) {
				if (data['real_type'] && ( data['real_type'] == '10' || data['real_type'] == '11' )) {
					obj[key] = Number(val[key]);
				} else {
					obj[key] = val[key];
				}
			} else {
				if (data['real_type'] && ( data['real_type'] == '10' || data['real_type'] == '11' )) {
					obj[key] = Number(data.value);
				} else {
					obj[key] = data.value;
				}
			}
		},

		//提交检查
		//@param allData全部控件属性,formvalue 表单值格式
		validForm(allData, formValue) {
			let error = false;
			let errorMsg = "";
			let errArr = [];
			for (let key in formValue) {
				let data = allData[key];
				//如果该dfield是父表填充子表的，那就不验证
				if (this.data.idsOfSonDataByParent.indexOf(key) != -1) {
					continue;
				}
				if(data.be_control_condition){
					continue;
				}
				let type = data["type"];
				if (type == 'Songrid') {
					continue;
				}
				let val = formValue[key];
				//必填检查
				if (data["required"]&&this.data.validation_required) {
					if (( ( val == "" ) && ( ( val + '' ) != '0' ) ) || val == "[]" || JSON.stringify(val) == "{}") {
						error = true;
						errArr.push(data["label"] + '是必填项!');
						errorMsg = errArr.join(' ');
						continue;
					}
				}
				//子表必填 对应关系必填
				for (let d in allData) {
					if (allData[d].type == 'Songrid' && allData[d].required && allData[d].total == 0) {
						error = true;
						errArr.push('子表字段:' + allData[d].label + '是必填!');
						errorMsg = Array.from(new Set(errArr)).join(' ');
						break;
					}
					if(allData[d].type=='Correspondence' && allData[d].required && !allData[d].correspondenceHasValue){
						error = true;
						errArr.push('对应关系:' + allData[d].label + '是必填!');
						errorMsg = Array.from(new Set(errArr)).join(' ');
						break;
					}
				}
				//正则检查
				if (val != "" && data["reg"] !== "") {
					for (let r in data["reg"]) {
						let reg;
						//有待优化
						if (r.startsWith('/') && r.endsWith('/')) {
							// r = r.substring(1)
							// r = r.substring(0, r.length - 1);
							reg = eval(r);
						} else {
							reg = new RegExp(r);
						}
						let flag = reg.test(val);
						if (!flag) {
							error = true;
							errorMsg = data["reg"][r];
							break;
						}
					}
				}
				//数字范围检查
				if (val.toString() != "" && data["numArea"]) {
					let label = data["label"];
					let minNum = data["numArea"]["min"] || '';
					let maxNum = data["numArea"]["max"] || '';
					if(data["numArea"]["min"].toString()=='0'){
                        minNum = '0';
					}
					if(data["numArea"]["max"].toString()=='0'){
                        maxNum = '0';
					}
					let errorInfo = data["numArea"]["error"];
					if (minNum !== "" && maxNum === "") {
						if (val < minNum) {
							error = true;
							if (errorInfo === "") {
								errorMsg = `“${ label }”字段不能小于${ minNum }`;
							} else {
								errorMsg = errorInfo;
							}
							break;
						}
					} else if (minNum === "" && maxNum !== "") {
						if (val > maxNum) {
							error = true;
							if (errorInfo === "") {
								errorMsg = `“${ label }”字段不能大于${ minNum }`;
							} else {
								errorMsg = errorInfo;
							}
							break;
						}
					} else {
						if (val < minNum || val > maxNum) {
							error = true;
							if (errorInfo === "") {
								errorMsg = `“${ label }”字段的取值范围在${ minNum } 和 ${ maxNum }内`;
							} else {
								errorMsg = errorInfo;
							}
							break;
						}
					}
				}
				//函数检查
				if (val != "" && !$.isEmptyObject(data["func"])) {
					for (let r in data["func"]) {
						let flag = FormService[r](val);
						if (!flag) {
							error = true;
							errorMsg = data["func"][r];
							break;
						}
					}
				}
				//数字位数限制
				if (data["real_type"] == fieldTypeService.FLOAT_TYPE) {
					if (formValue[key] >= 100000000000) {
						error = true;
						errorMsg = "小数不能超过12位！无法保存！";
						break;
					}
				}
			}
			return {
				error,
				errorMsg
			};
		},

		//审批数据是删除情况不可编辑
		//暂时无用
		editDelWork(res) {
			if (res && res == this.formId) {
				for (let key in this.data.data) {
					this.data.data[key]['is_view'] = 1;
					this.data.childComponent[key].data['is_view'] = 1;
					this.data.childComponent[key].reload();
				}
			}
		},

		//检查是否是默认值的触发条件
		async validDefault(originalData, val) {
			if (this.data.baseIdsLocal.indexOf(originalData["dfield"]) == -1) {
				this.data.baseIdsLocal.push(originalData["dfield"]);
			}
			this.data.baseIdsLocalDict[originalData["dfield"]] = val;
			if (this.data.base_fields.sort().toString() == this.data.baseIdsLocal.sort().toString()) {
				//请求默认值
				let json = {
					flow_id: this.data.flowId || "",
					base_field_2_value: JSON.stringify(this.data.baseIdsLocalDict),
					temp_id: this.data.data.temp_id["value"]
				};
                MSG.showLoadingSelf();
				let res = await FormService.getDefaultValue(json);
				this.actions.setValueForDefault(res)
                MSG.hideLoadingSelf();
			}
		},

		//设置默认值
		setValueForDefault(res){
			for (let key in res["data"]) {
				//排除例外字段
				if (this.data.exclude_fields.indexOf(key) == -1) {
					if (this.data.data.hasOwnProperty(key)) {
						let data = this.data.data[key];
						let tableId = this.data.tableId;
						let type = data["type"];
						let value = res["data"][key];
						//如果是对应关系,传回来的是空串，那就不对它赋值
						if (type == 'correspondence' && value == "") {
							continue;
						}

						this.actions.setFormValue(key, value);
					}
				}
			}
		},

		checkDefaultFieldType(key,type,value,data){
			//如果是对应关系回显默认值
			if (type == 'correspondence' && value != "") {
				this.actions.setCorrespondenceDefaultValue(key,data);
			}
			//如果是内联子表默认值
			if (type == 'songrid') {
				this.actions.setSongridDefaultValue(key,data);
			}
			//如果是多级内置
			if (type == 'multi-linkage') {
				this.actions.setMultiLinkageDefaultValue(key,value);
			}
			//如果是日期控件
			if (type == 'datetime') {
				this.actions.setDatetimeDefaultValue(key,value);
			}
			//如果是周期规则
			if (type == 'setting-textarea') {
				this.actions.setSettingTextareaDefaultValue(key,value);
			}
		},

		setCorrespondenceDefaultValue(key,data){
			this.data.childComponent[key].actions.correspondenceDefault(data['value']);
		},
		setSongridDefaultValue(key,data){
			this.data.childComponent[key].actions.songridDefault(data['value']);
		},
		setMultiLinkageDefaultValue(key,value){
			if (value.length != 0) {
				this.data.childComponent[key].actions.multiLinkageDefaultData(value);
			} else {
				this.data.childComponent[key].actions.multiLinkageDefaultData('none');
			}
		},
		setDatetimeDefaultValue(key,value){
			value = value.replace(" ", "T");
			this.setFormValue(key, value);
		},
		setSettingTextareaDefaultValue(key,value){
			this.data.childComponent[key].actions.loadSettingtextarea(value);
		},

		//主动触发一遍所有事件
		//二次确认挂有关系的数据的准确性
		triggerControl: function () {
			let data = this.data.data;
			for (let key in data) {
				let val = data[key]["value"];
				if (val != "" || !$.isEmptyObject(val)) {
					if ($.isArray(val)) {
						if (val.length != 0) {
							this.actions.checkValue(data[key]);
						}
					} else {
						this.actions.checkValue(data[key]);
					}
				}
			}
		},

		//通过枚举选项的id，寻找对应的text
		getTextByOptionID(dfield, value) {
			let text = '';
			let options;
			let data = this.data.data;
			if (data[dfield].hasOwnProperty("options")) {
				options = data[dfield]["options"];
			}
			else if (data[dfield].hasOwnProperty("group")) {
				options = data[dfield]["group"];
			}
			for (let key in options) {
				if (options[key]["value"] == value) {
					text = options[key]["label"];
				}
			}
			return `${ text}`;
		},

		//为控件赋值前检验
		set_value_for_form(result, f) {
			let data = this.data.data[f];
			if (typeof result === 'string') {
				//条件表达式赋值
				this.actions.setFormValue(f, result);
			} else if (isNaN(result) || !isFinite(result)) {
				//容错
				this.actions.setFormValue(f, "");
			} else {
				//如果是整数
				if (data["real_type"] == 11) {
					this.actions.setFormValue(f, result);
				} else {
					if (FIELD_TYPE_MAPPING.NUMBER_TYPE.indexOf(data["real_type"]) != -1) {
						let reg = /^((-?\d+.?\d*)[Ee]{1}([+-]?\d+))$/;
						if (reg.test(data.value)) {
							data.value = data.value + "(不支持科学计数法！无法保存！)"
							this.actions.setFormValue(f, data.value);
							return;
						}
					}
					//如果是浮点数
					//数据处理（如果数据已经限定了小数位数，如果不满足，四舍五入让其满足）
					let accuracy = data["accuracy"];
					result = result.toFixed(accuracy);
					this.actions.setFormValue(f, result);

					//数据溢出出现科学计数法时
					if (FIELD_TYPE_MAPPING.NUMBER_TYPE.indexOf(data["real_type"]) != -1) {
						let reg = /^((-?\d+.?\d*)[Ee]{1}([+-]?\d+))$/;
						if (reg.test(data.value)) {
							data.value = data.value + "(不支持科学计数法！无法保存！)"
							this.actions.setFormValue(f, data.value);
							return;
						}
						//浮点数数据溢出时（后台浮点数最大位数为11位，超过11位便会返回科学计数法）
						else if (data["real_type"] == fieldTypeService.FLOAT_TYPE) {
							if (result >= 100000000000) {
								if (data.value.indexOf("(") == -1) {
									data.value = data.value + "(小数不能超过12位！无法保存！)"
									this.actions.setFormValue(f, data.value);
								}
								return;
							}
						}
					}
				}
			}
			//统计功能
			// this.actions.countFunc(f);
			//字段插件配置
			this.actions.pluginForFields(f);
		},

		//字段插件配置
		pluginForFields(dfield) {
			if (this.data.myPluginFields.indexOf(dfield) == -1) {
				this.data.myPluginFields.push(dfield);
			}
			for (let hasThisFieldList of this.data.plugin_fields) {
				if (hasThisFieldList.indexOf(dfield) != -1) {
					let isAllInclude = true;
					this.actions.pluginAllInclude(isAllInclude,hasThisFieldList);
					//触发
					if (isAllInclude) {
						this.actions.allIncludeIsTrue(hasThisFieldList);
					}
				}
			}
		},
		pluginAllInclude(isAllInclude,hasThisFieldList){
			for (let item of hasThisFieldList) {
				if (this.data.myPluginFields.indexOf(item) == -1) {
					isAllInclude = false;
				}
			}
		},
		allIncludeIsTrue(hasThisFieldList){
			let dfield2value = {};
			let formValue = this.actions.getFormValue();
			for (let i of hasThisFieldList) {
				dfield2value[i] = formValue[i];
			}
			FormService.execFieldPlugin({
				form_id: this.data.formId,
				temp_id: this.data.temp_id["value"],
				real_id: this.data.real_id["value"],
				dfield2value: JSON.stringify(dfield2value)
			});
		},
		/**
		 * 从编辑转到查看模式
		 */
		async changeToView() {
			for (let key in this.data.data) {
				if (this.data.childComponent[key]) {
					this.data.childComponent[key].data.is_view = this.data.data[key].is_view = 1;
					this.data.childComponent[key].reload();
				}
			}
			this.actions.triggerControl();
		},

		/**
		 *  表达式主要方法
		 *  此data结构为{val: 自身的value,effect: [] 被影响的dfield集合}
		 *  暂时只有后端表达式计算，以后需要加上前端表达式判断
		 */
		async calcExpression(data) {
			// let send_exps = [];
			if (!data["effect"] || !data["effect"].length > 0) {
				return false;
			}else{
				return true;
			}
		},

		//改变选择框的选项
		changeOptions() {
			this.actions.saveChangeOptions();
			for (let key in this.data.data) {
				let data = this.data.data[key];
				let obj = {'Select':'options','Radio':'group','MultiSelect':'options','Readonly':'options'};
				if (!_.isEmpty(data['linkage'])) {
					let j = 0;
					let arr = [];
					j=this.actions.checkHasChangeOptions(data,arr,j);
					if (j == 0) {
						this.actions.notHaveChangeOptions(arr,obj);
					}
				}
			}
		},

		notHaveChangeOptions(arr,obj){
			for (let field of arr) {
				this.data.data[field][obj[this.data.data[field]['type']]] = this.data.optionsToItem;
				if(this.data.childComponent[field].data){
					this.data.childComponent[field].data[obj[this.data.data[field]['type']]] = this.data.optionsToItem[field];
					this.data.childComponent[field].reload();
				}
			}
		},

		checkHasChangeOptions(data,arr,j){
			for (let value in data['linkage']) {
				for (let k in data['linkage'][value]) {
					arr.push(k);
				}
				if (value == data['value']) {
					j++;
					//改变选择框的选项
					this.actions.changeOptionOfSelect(data, data['linkage'][value]);
				}
			}
			return j;
		},

		saveChangeOptions(){
			for(let key in this.data.data){
				let data = this.data.data[key];
				let obj = FormService.selectObj;
				let affectType = data['type'];
				if (!obj[affectType]) {
					continue;
				}
				let affectOptions = data[obj[affectType]];
				if (!this.data.optionsToItem[key]) {
					this.data.optionsToItem[key] = [];
					for (let o of affectOptions) {
						this.data.optionsToItem[key].push(o);
					}
				}
			}
		},

		//改变选择框的选项
		changeOptionOfSelect(data, l) {
			let obj = {'Select': 'options', 'Radio': 'group', 'MultiSelect': 'options'};
			let linkage = l;
			// let field = data['dfield'];
			let type = data['type'];
			for (let key in linkage) {
				let affectData = this.data.data[key];
				let affectType = affectData['type'];
				let arr = [];
				let srcOptions = this.data.optionsToItem[key];
				for (let opIndex in srcOptions) {
					if (linkage[key].indexOf(srcOptions[opIndex].value) != -1) {
						arr.push(srcOptions[opIndex]);
					}
				}
				this.data.data[key][obj[affectType]] = arr;
				if(this.data.childComponent[key]){
					this.data.childComponent[key].data[obj[affectType]] = arr;
					this.data.childComponent[key].reload();
				}
				// if (affectType == 'multi-select') {
				// 	this.data.data[key]['value'] = [];
				// } else {
				// 	this.data.data[key]['value'] = '';
				// }
				// this.data.childComponent[this.data.data[key]['dfield']].actions.changeOption(this.data.data[key]['dfield']);
			}
		},

		//修改必填性功能
		requiredCondition(editConditionDict, value) {
			let arr = [];
			for (let key in editConditionDict["required_condition"]) {
				if (key == 'and') {
					this.actions.andRequiredCondition(editConditionDict,key,value);
				} else {
					this.actions.otherRequiredCondition(editConditionDict,key,value,arr);
				}
			}
		},

		otherRequiredCondition(editConditionDict,key,value,arr){
			for (let dfield of editConditionDict["required_condition"][key]) {
				if (arr.indexOf(dfield) != -1) {
					continue;
				}
				this.data.data[dfield]["required"] = this.data.childComponent[dfield].data['required'] = (key == value) ? 1 : 0;
				if (this.data.childComponent[dfield].data['required']) {
					this.data.childComponent[dfield].data['requiredClass'] = this.data.childComponent[dfield].data.value == '' ? 'required' : 'required2';
				}
				this.data.childComponent[dfield].reload();
				if (key == value) {
					arr.push(dfield);
				}
			}
		},

		andRequiredCondition(editConditionDict,key,value){
			let andData = editConditionDict["required_condition"][key];
			for (let f in andData) {
				let i = 0;
				for (let d of andData[f]) {
					for (let b of value) {
						if (d == b) {
							i++;
						}
					}
				}
				this.data.data[f]["required"] = this.data.childComponent[f].data['required'] = (i == andData[f].length) ? 1 : 0;
				if (this.data.childComponent[f].data['required']) {
					this.data.childComponent[f].data['requiredClass'] = this.data.childComponent[f].data.value == '' ? 'required' : 'required2';
				}
				this.data.childComponent[f].reload();
			}
		},

		//创建表单数据格式 形如{dfield:value}
		//@param data为当前表单最新的数据，isCheck 是否执行表单校验
		createFormValue(data, isCheck) {
			let formValue = {};
			this.actions.replaceStringValue(data,formValue);
			if (isCheck) {
				//外部调用需要验证表单
				let {error, errorMsg} = this.actions.validForm(this.data.data, formValue);
				if (error) {
					return {
						error: error,
						errorMessage: errorMsg
					}
				} else {
					this.actions.checkOhterField(formValue);
					return formValue;
				}
			} else {
				return formValue;
			}

		},

		replaceStringValue(data,formValue){
			for (let key in data) {
				if(data[key].dtype == 1 && typeof data[key].value == 'string'){
					formValue[key] = Number(data[key].value.replace(/,/g,''));
				}else{
					formValue[key] = data[key].value;
				}
			}
		},

		//判断一下日期的类型，并且进行限制
		//当数据不符格式限制时，要将对应表单值设为空
		checkDateType(data) {
			for (let i in this.data.data) {
				let temp = this.data.data[i];
				let dfield = this.data.data[i]['dfield'];//f8
				if (this.data.data[i]['type'] == 'Date') {

					if (temp['timeType'] == 'after') {
						this.actions.afterDate(data,dfield);
					} else if (this.data.data[i]['type'] == 'before') {
						this.actions.beforeDate(data,dfield);
					}
				}
				if (this.data.data[i]['type'] == 'Datetime') {
					if (temp['timeType'] == 'after') {
						this.actions.afterDateTime(data,dfield);
					} else if (this.data.data[i]['type'] == 'before') {
						this.actions.beforeDateTime(data,dfield);
					}
				}
			}
		},

		afterDateTime(data,dfield){
			let vals = data[dfield].split(" ")[0].split("-");
			//let vals = val.split("-");//[2011,11,11];
			let myData = new Date();
			let dates = [myData.getFullYear(), myData.getMonth() + 1, myData.getDate()];
			for (let i = 0; i < 3; i++) {
				if (vals[i] < dates[i]) {
					data[dfield] = '';
				}
			}
		},

		beforeDateTime(data,dfield){
			let vals = data[dfield].split(" ")[0].split("-");
			//let vals = val.split("-");//[2011,11,11];
			let myData = new Date();
			let dates = [myData.getFullYear(), myData.getMonth() + 1, myData.getDate()];
			for (let i = 0; i < 3; i++) {
				if (vals[i] < dates[i]) {
					data[dfield] = '';
				}
			}
		},

		beforeDate(data,dfield){
			let vals = data[dfield].split("-");
			//let vals = val.split("-");//[2011,11,11];
			let myData = new Date();
			let dates = [myData.getFullYear(), myData.getMonth() + 1, myData.getDate()];
			for (let i = 0; i < 3; i++) {
				if (vals[i] < dates[i]) {
					data[dfield] = '';
				}
			}
		},

		afterDate(data,dfield){
			let vals = data[dfield].split("-");
			//let vals = val.split("-");//[2011,11,11];
			let myData = new Date();
			let dates = [myData.getFullYear(), myData.getMonth() + 1, myData.getDate()];
			for (let i = 0; i < 3; i++) {
				if (vals[i] < dates[i]) {
					data[dfield] = '';
				}
			}
		},

		//多字段统计提前修改myUseFields
		myUseFieldsofcountFunc() {
			this.data.myUseFields = JSON.parse(JSON.stringify(this.data['use_fields']))
		},

		//统计功能
		async countFunc(dfield) {
			let isPush = false;
			for (let key in this.data['use_fields']) {
				let data = this.data.myUseFields[key];
				if (this.data['use_fields'][key].indexOf(dfield) != -1) {
					if (!data) {
						data = [];
					}
					if (data.indexOf(dfield) == -1) {
						data.push(dfield);
					}
					if (this.data['use_fields'][key].sort().toString() == data.sort().toString()) {
						isPush = true;
                        }
				}
			}
			return isPush;
		},

		//处理表单数据，根据real_type转换数据
		handleFormData(formData) {
			for (let dfield in formData) {
				let data = this.data.data[dfield];
				let fData = formData[dfield];
				if (data["real_type"]) {
					if (data["real_type"] == 10 || data["real_type"] == 11) {
						try {
							let result;
							if (fData != "") {
								result = Number(fData);
							}
							if (result != null && result != undefined && !isNaN(result)) {
								fData = Number(fData);
							}
						} catch (e) {
							console.error("转换数字类型失败");
						}
					}
					if (data["real_type"] == 5 && !!fData) {
						fData = fData.replace("T", " ");
					}
				}
			}
			return formData;
		},

		//必填性改变
		requiredChange(_this) {
			if (_this.data.value === '' || _this.data.value.length === 0 || JSON.stringify(_this.data.value) === "{}") {
				_this.el.find('#requiredLogo').removeClass().addClass('required');
			} else {
				_this.el.find('#requiredLogo').removeClass().addClass('required2');
			}
			//富文本必填性改变
			if (_this.data.type == 'Editor' && ( _this.data.value.replace(/<.*?>/ig, "").replace(/\s/g, "") === '' )) {
				_this.el.find('#requiredLogo').removeClass().addClass('required');
			}
		},
		setRadioCheck(data){
			for (let obj of data.group) {
				obj['name'] = data.dfield;
				if (obj.value == data.value) {
					obj['checked'] = true;
				} else {
					obj['checked'] = false;
				}
			}
		},
		//赋值
		setFormValue(dfield, value,noCount) {
			let count = !noCount ? true : false;
			let data = this.data.data[dfield];
			if (data) {
				data["value"] = value;
				let childComponet = this.data.childComponent[dfield];
				if(data.type=='Radio'){
					this.actions.setRadioCheck(data);
				}
				if (childComponet) {
					childComponet.data["value"] = value
					if(data.type=='Radio'){
						this.actions.setRadioCheck(childComponet.data);
					}
					childComponet.reload();
				}
				this.actions.triggerSingleControl(dfield,count);
			}
		},
		//给相关赋值
		setAboutData(id, value) {
			let buildin_fields = {};
			buildin_fields[id] = value;
			this.data.buildin_fields = buildin_fields;
		},
		//快捷添加后回显
		addNewItem(data) {
			let dfield = this.data['quikAddDfield'];
			let fieldData = this.data.data[dfield];
			if (fieldData["options"]) {
				this.data.childComponent[dfield]['data']['options'] = fieldData["options"] = data['newItems'];
			} else {
				this.data.childComponent[dfield]['data']['group'] = fieldData["group"] = data['newItems'];
			}
			this.data.childComponent[dfield].reload();
		},

		firstGetData() {
			let buildin_fields = {}
			for (let index in this.data.data) {
				let data = this.data.data[index];
				if (data.type == 'Buildin') {
					this.actions.checkBuildValue(data,buildin_fields);
				} else {
					if ((data.value || (data.effect &&data.effect.length &&data.effect.length>0)) && data.dfield.startsWith('f') && !(~this.data.postData.indexOf(data.dfield))) {
						if(typeof data.value=='string' && data.value.trim()=='' && data.effect.length==0){
							continue;
						}
						this.data.postData.push(data.dfield);
					}
				}
			}
			this.data.buildin_fields = buildin_fields;
			this.actions.getDataForForm();
		},

		checkBuildValue(data,buildin_fields){
			let id = data["id"];
			let value;
			for (let obj of data['options']) {
				if (obj.value == data.value) {
					value = obj.value;
					break;
				}
			}
			if (value && value != '') {
				buildin_fields[id] = value;
			}
		},

		async getDataForForm() {
			let data = {};
			data.data = this.actions.createFormValue(this.data.data);
			data.count_data = this.actions.createFormValue(this.data.data);
			for (let key in this.data.data) {
				let d = this.data.data[key];
				if (d.type == 'Buildin' || d.type == 'Select' || d.type=='Radio') {
					data.data[key] = this.actions.getTextByOptionID(d.dfield, data.data[key]);
				}
			}
			data.change_fields = this.data.postData;
			if (!_.isEmpty(this.data.buildin_fields)) {
				data.buildin_fields = this.data.buildin_fields;
			}
			if (this.data.isSongCount) {
				data.child_table_id = this.data.sonTableId;
				data.record_id = this.data.sonTableId;
			}
			let res = await FormService.getAllCountData(data);
			this.actions.setValueFromDataForForm(res);
			this.actions.afterGetDataForForm();
		},

		setValueFromDataForForm(res){
			for (let k in res["data"]) {
				console.log('k:'+k);
				let data = this.data.data;
				//如果是周期规则
				if (data.hasOwnProperty(k) && data[k].hasOwnProperty("real_type") && data[k]["real_type"] == '27') {
					if (res["data"][k]["-1"]) {
						this.actions.setFormValue.bind(this)(k, res["data"][k]["-1"]);
					}
				} else {
					this.actions.setFormValue.bind(this)(k, res["data"][k]);
				}
			}
		},

		afterGetDataForForm(){
			this.data.buildin_fields = {};
			this.data.child_table_id = '';
			this.data.postData = [];
			this.data.isSongCount = false;
			this.actions.afterCalc();
			setTimeout(() => {
				this.data.SongridRef = false;
			}, 3000);
		},

		//移除其它字段隐藏的字段信息
		checkOhterField(data, obj_new, obj_old) {
            if(this.data['show_other_fields']){
                return;
            }
			let delKey = [];
			for (let index in this.data.data) {
				if (this.data.data[index]['is_other_field'] && this.data.submitKey.indexOf(this.data.data[index]['id']) == -1) {
					delKey.push(this.data.data[index]['dfield']);
				}
			}
			for (let obj of delKey) {
				if (data) {
					delete data[obj];
				}
				if (obj_new) {
					delete obj_new[obj];
				}
				if (obj_old) {
					delete obj_old[obj];
				}
			}
		},

		//密码框回显
		addEnrypt(data) {
			let value = this.actions.md5(data.newItems);
			let psField = this.data['addPassWordField'];
			this.data.data[psField].value = value;
			this.data.childComponent[psField].actions.hasChangeValue(this.data.data[psField]);
		},

		createSubmitPostJson(){
			let data = this.actions.handleFormData(formValue);
			let formDataOld = this.data.oldData;
			//如果有其他字段的数据，这里是拼approvedFormData
			this.actions.checkDateType(formValue);
			let obj_new = this.actions.createCacheData(formDataOld, data, true, this);
			let obj_old = this.actions.createCacheData(formDataOld, data, false, this);
			this.actions.changeValueForChildTable(data);
			if (this.data.hasOtherFields == 0) {
				this.actions.checkOhterField(data, obj_new, obj_old);
			}
			let json = {
				data: JSON.stringify(data),
				cache_new: JSON.stringify(obj_new),
				cache_old: JSON.stringify(obj_old),
				table_id: this.data.tableId,
				flow_id: this.data.flowId,
				focus_users: this.data.focusUsers || '[]',
				parent_table_id: this.data.parentTableId || "",
				parent_real_id: this.data.parentRealId || "",
				parent_temp_id: this.data.parentTempId || "",
				parent_record_id: this.data.parentRecordId || ""
			};
			//如果是批量审批，删除flow_id
			if (this.data.isBatch == 1) {
				delete json["flow_id"];
			}
			if (this.data.isAddBuild) {
				json['buildin_id'] = this.data.buildId;
			}
			return json;
		},
		//提交表单数据
		async onSubmit() {
            if(!this.data.data['real_id']['value']){
                delete window.top.miniFormVal[this.data.data['table_id']['value']];
            }else {
                window.top.miniFormValRealId = '';
            }
			let formValue = this.actions.createFormValue(this.data.data);
			let {error, errorMsg} = this.actions.validForm(this.data.data, formValue);
			if (error) {
				MSG.alert(errorMsg);
				this.data.isBtnClick = false;
				return;
			}
			let json=this.actions.createSubmitPostJson();
			let res = await FormService.saveAddpageData(json);
			if (res.succ == 1) {
				this.actions.submitSuccessCb(res);
			} else {
				MSG.alert(res.error);
			}
			this.data.isBtnClick = false;
		},

		submitSuccessCb(res){
			MSG.showTips('保存成功');
			Mediator.publish('updateForm:success:' + this.data.tableId, true);
			if (this.data.isAddBuild && !this.flowId) {
				PMAPI.sendToRealParent({
					type: PMENUM.close_dialog,
					key: this.data.key,
					data: {new_option: res.new_option},
				});
			} else {
				PMAPI.sendToRealParent({
					type: PMENUM.close_dialog,
					key: this.data.key,
					data: 'success',
				});
			}
			//清空子表内置父表的ids
			delete window.top.idsInChildTableToParent[this.data.tableId];
		},

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
			} else if (this.data.fromApprove && this.data.realId == '') {//审批流程
				json = {
					form_id: this.data.formId,
					record_id: this.data.recordId,
					is_view: this.data.isView,
					from_approve: this.data.fromApprove,
					from_focus: this.data.fromFocus,
					table_id: this.data.tableId
				}
			}
			else {
				json = this.actions.pickJson();
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
				} else {
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
			this.actions.checkTemp(json);
			return json;
		},

		checkTemp(json){
			//如果是临时表，传temp_id，否则是real_id
			if (this.data.inProcess == 1 || this.data.isBatch == 1) {
				json["temp_id"] = this.data.realId;
			} else {
				json["real_id"] = this.data.realId;
			}
			if (this.data.tempId) {
				json["temp_id"] = this.data.tempId;
				if (json["real_id"]) {
					delete json["real_id"];
				}
			}
		},

		checkCustomTable() {
			if (this.data.custom_table_form_exists) {
				if (this.data.table_name == '人员信息') {
					for (let key in this.data.data) {
						if (this.data.data[key].label == '用户名') {
							this.data.data[key].is_view = 1;
							this.data.childComponent[key].data.is_view = 1;
							this.data.childComponent[key].reload();
						}
					}
				}
			}
		},

		//转到编辑模式
		async changeToEdit() { //重新获取动态数据 （temp_id会变）
			this.data.isView = 0;
			let json = this.actions.createPostJson();
			let res = await FormService.getDynamicData(json);
			for (let key in res.data) {
				if (res.data[key].options) {
					if (!this.data.data[key].options) {
						this.data.data[key].options = [];
					}
					res.data[key].options = this.data.data[key].options.concat(res.data[key].options);
				}
				this.data.data[key] = Object.assign({}, this.data.data[key], res.data[key]);
				if (this.data.childComponent[key]) {
					this.data.childComponent[key].data = Object.assign({}, this.data.childComponent[key].data, res.data[key]);
					this.data.childComponent[key].reload();
				}
			}
			this.actions.afterChangeToEdit();
		},
		afterChangeToEdit(){
			if (this.data.isOtherChangeEdit) {

				this.data.btnType = 'none';
			} else {
				this.data.btnType = 'new';
			}
			this.actions.addBtn();
			this.actions.checkCustomTable();
			this.actions.triggerControl();
			this.actions.setDataFromParent();
			this.data.isBtnClick = false;
		},
		//修改可修改性
		reviseCondition: function (editConditionDict, value) {
			// if(this.dfService.isView){return false;}
			let arr = [];
			for (let key in editConditionDict["edit_condition"]) {
				if (key == 'and') {
					this.actions.andReviseCondition(editConditionDict,key);
				} else {
					this.actions.otherReviseCondition(editConditionDict,key,arr,value);
				}
			}
		},

		otherReviseCondition(editConditionDict,key,arr,value){
			for (let dfield of editConditionDict["edit_condition"][key]) {
				if (arr.indexOf(dfield) != -1) {
					continue;
				}
				//如果有字段的负责性，再开始下面的逻辑
				let data = this.data.data[dfield];
				if (this.data.data[dfield]["required_perm"] == 1) {
					this.actions.selectReviseCondition(data,value,key,arr,dfield);
				}
				if (this.data.childComponent[dfield]) {
					this.data.childComponent[dfield].data = data;
					this.data.childComponent[dfield].reload();
				}
			}
		},

		selectReviseCondition(data,value,key,arr,dfield){
			//针对多选下拉框，只要包含就可以
			if (value instanceof Array) {
				data["be_control_condition"] = value.indexOf(key) != -1 ? 0 : 1;
			} else {
				data["be_control_condition"] = (key == value) ? 0 : 1;
			}
			if (this.data.data[data.dfield]) {
				console.log('checkValue data.data');
				console.dir(data);
				this.data.data[data.dfield] = _.defaultsDeep({}, data);
			}
		},

		andReviseCondition(editConditionDict,key){
			let andData = editConditionDict["edit_condition"][key];
			for (let f in andData) {
				let i = 0;
				for (let d of andData[f]) {
					for (let b of value) {
						if (d == b) {
							i++;
						}
					}
				}
				this.data.data[f]["is_view"] = ( i == andData[f].length ) ? 0 : 1;
				this.data.childComponent[f].data = this.data.data[f];
				this.data.childComponent[f].reload();
			}
		},

		checkAboutData(data){
			let id = data["id"];
			let value;
			if(data.type == 'Buildin'){
				for (let obj of data['options']) {
					if(data.value == ''){
						value = '';
						break;
					}
					if (obj.value == data.value ) {
						value = obj.value;
						break;
					}
				}
			}else{
				value=data.value;
			}
			this.actions.setAboutData(id, value);
		},

		checkDefaultValue(data,noCount){
			if (this.data.flowId != "" && this.data['base_fields'].indexOf(data["dfield"]) != -1 && !noCount) {
				if (data.type == 'Input') {
					if(!this.data.timer){
						this.data.timer=setTimeout(()=>{
							this.actions.validDefault(data, data['value']);
							this.data.timer=null;
						},3000);
					}else{
						clearTimeout(this.data.timer);
						this.data.timer=setTimeout(()=>{
							this.actions.validDefault(data, data['value']);
							this.data.timer=null;
						},3000);
					}
				} else {
					this.actions.validDefault(data, data['value']);
				}
			}
		},

		checkChangeOptions(data){
			if (!_.isEmpty(data['linkage'])) {
				let j = 0;
				let arr = [];
				for (let value in data['linkage']) {
					for (let k in data['linkage'][value]) {
						arr.push(k);
					}
					if (value == data['value']) {
						j++;
						//改变选择框的选项
						this.actions.changeOptionOfSelect(data, data['linkage'][value]);
					}
				}
				if (j == 0) {
					let obj = FormService.selectObj;
					for (let field of arr) {
						this.data.data[field][obj[this.data.data[field]['type']]] = this.data.optionsToItem[field];
						this.data.childComponent[field] && (this.data.childComponent[field].data[obj[this.data.data[field]['type']]]=this.data.optionsToItem[field]) && this.data.childComponent[field].reload();
					}
				}
			}
		},
		//触发事件检查
		checkValue:async function (data,noCount) {
			let isPustToPostData1 = false;
			let isPustToPostData2 = false;
			if (!this.data.childComponent[data.dfield]) {
				return;
			}
			if (this.data.data[data.dfield]) {
				this.data.data[data.dfield] = _.defaultsDeep({}, data);
			}
			if ((data.type == 'Buildin' || data.type == 'MultiLinkage') && !this.data.isInit && !noCount) {
					this.actions.checkAboutData(data);
			}
			//检查是否是默认值的触发条件
			// if(this.flowId != "" && this.data.baseIds.indexOf(data["dfield"]) != -1 && !isTrigger) {
			this.actions.checkDefaultValue(data,noCount);
			//统计功能
			this.actions.myUseFieldsofcountFunc();
			if (!noCount) {
				isPustToPostData2 = this.actions.countFunc(data.dfield);
			}
			//改变选择框的选项
			this.actions.checkChangeOptions(data);

			//修改负责
			if (data["edit_condition"] && data["edit_condition"] !== "") {
				setTimeout(() => {
					this.actions.reviseCondition(data, data.value);
				}, 0);
			}
			//修改必填性功能
			if (data["required_condition"] && data["required_condition"] !== "") {
				this.actions.requiredCondition(data, data['value']);
			}

			if (!noCount) {
				isPustToPostData1 = this.actions.webCalcExpression(data)
			}
			if (!this.data.isInit && (isPustToPostData1 || isPustToPostData2)) {
				this.data.postData.push(data.dfield);
			}
			if (data.required) {
				this.actions.requiredChange(this.data.childComponent[data.dfield]);
			}
			if (this.data["frontend_cal_parent_2_child"]) {
				window.top.frontendParentFormValue[this.data.tableId] = this.actions.createFormValue(this.data.data);
			}
			if (!this.data.isInit && !noCount) {
				console.log('getDataForForm');
				this.actions.getDataForForm();
			}
		},

		replaceSymbol(data) {
			let reg = /\@f\d+\@/g;
			let items = data.match(reg);
			let str_ = data.indexOf("\"else\"")!=-1?('\\\"'):('\"');
			let formValue=this.actions.createFormValue(this.data.data);
			for(let item of items) {
				item = item.replace("@", "").replace("@", "");
				let v = formValue[item];
				let num = formValue[item]
				let flag = false;
				if( typeof(num) == 'string' ){
					flag = true;
				}
				else{
					flag = false;
				}
				if(flag == true){
					if( num.indexOf(",") != -1 && num.replace(/,/g,"") == parseInt(num.replace(/,/g,""))){
						if(num.indexOf(".0") == -1){
							v = v.replace(/,/g,"") + ".0";
						}else{
							v = v.replace(/,/g,"")
						}
					}
					if( data.indexOf('count_time_sum') != -1 && num.indexOf('T') != -1) {
						v = v.replace(/T/g, " ");
					}
				}
				let isUndefined=false;
				if(v == undefined){
					isUndefined=true;
				}
				let type = "";
				let dinput_type = "";
				if(this.data.data[item].hasOwnProperty("real_type")) {
					type = this.data.data[item]["real_type"];
				}
				if(this.data.data[item].hasOwnProperty("dinput_type")) {
					dinput_type = this.data.data[item]["dinput_type"];
				}
				if(FIELD_TYPE_MAPPING.SELECT_TYPE.indexOf(dinput_type) != -1) {
					//枚举类型 or 各种内置
					v = this.actions.getTextByOptionID(item,formValue[item]);
				}
				if(FIELD_TYPE_MAPPING.NUMBER_TYPE.indexOf(type) != -1) {
					//整数或者小数处理下去掉，解决发起工作流回显为空的bug
					try{
						v = v.replace(/,/g,"")
						//整数或者小数
						v = v === ""  ? 0 : v;
					}catch(e){
					}
				}else {
					v = (v === "") ? (str_+str_) : (str_+v+str_);
				}
				if(isUndefined){
					data = data.replace("@"+item+"@",'\\\"\\\"');
				}else{
					data = data.replace("@"+item+"@",v);
				}
				if(fieldTypeService.DATETIME == dinput_type) {
					v = v.replace("T"," ");
				}
				data = data.replace("@"+item+"@",v);
			}
			data = data.replace(/\#/g,'this.');
			return data;
		},

		afterCalc() {
			for (let f in this.data.webCalc) {
				try{
					let expressionStr = this.data.webCalc[f];
					let expression = this.actions.replaceSymbol(expressionStr)
					expression = expression.replace(/this/,'FormService')
					this.actions.set_value_for_form(eval(expression), f);
				}catch(err){
					delete this.data.webCalc[f];
				}
			}
			this.data.webCalc = {};
		},

		webCalcExpression(data,FormService) {
            let calcData = {
                val: data['value'],
                effect: data["effect"],
                id: data['id']
            };
			let isCalc;
			for (let index in data["effect"]) {
				let f=data["effect"][index];
				let expression;
				let bool = false;
				if (this.data.data.hasOwnProperty(f)) {
					let expressionStr = this.data.data[f]["expression"];
					if (expressionStr !== "" ) {
						expression = this.actions.replaceSymbol(expressionStr);
						try {
							if (expression.indexOf("$^$") == -1) {
								try {
									// if (this.data.data[expressionStr.split("@")[1]]["is_view"] != 1) {
                                    expression = expression.replace(/this/,'FormService')
									this.data.webCalc[f] = expressionStr;
									isCalc = true;
									// }
								} catch (err) {
									console.log('不能执行前端表达式计算');
                                    bool = true;
								}
							}else{
                                bool = true;
							}
						} catch (err) {
							console.log('不能执行前端表达式计算');
                            bool = true;
						}
					}else{
                        bool = true;
					}
				}else{
                    bool = true;
				}
                if(bool){
	                isCalc = this.actions.calcExpression(calcData, data['value'])
                }
			}
			return isCalc;
		},
		//小数显示精度
        showAccuracy(dfield, value) {
            let data = this.data.data[dfield];
            if(data){
                if(FIELD_TYPE_MAPPING.NUMBER_TYPE.indexOf(data["real_type"]) != -1) {
                    value = new Number(value);
                    let accuracy = data["accuracy"];
                    value = value.toFixed(accuracy);
                }
                return value;
            }
            return value;
        },
		//添加按钮组
		addBtn() {
			this.el.find('.ui-btn-box').remove();
			//添加提交按钮
			// let $wrap = this.el.find('table').parentsUntil(this.data.el);
			let $wrap = this.el;
			if (this.data.btnType == 'new' || this.data.btnType == 'edit') {
				this.actions.btnNew($wrap);
			} else if (this.data.btnType == 'view') {
				this.actions.btnView($wrap);
			} else if (this.data.btnType == 'none') {

			} else if (this.data.btnType == 'confirm') {
				this.actions.btnConfirm($wrap);
			}
		},

		btnConfirm($wrap){
			$wrap.append(`<div class="noprint ui-btn-box"><div >
                    <button class="btn btn-normal">
                        <span>确定</span>
                        <div class="btn-ripple ripple"></div>
                    </button>
                </div></div>`)
		},

		btnView($wrap){
			$wrap.append(`<div class="noprint ui-btn-box"><div >
                    <!--<button class="btn btn-normal mrgr" id="print" >-->
                        <!--<span>打印</span>-->
                        <!--<div class="btn-ripple ripple"></div>-->
                    <!--</button>-->
                    <button class="btn btn-normal changeEdit" >
                        <span>转到编辑模式</span>
                        <div class="btn-ripple ripple"></div>
                    </button>
                </div></div>`)
		},

		btnNew($wrap){
			$wrap.append(`<div class="noprint ui-btn-box"><div>
                    <!--<button class="btn btn-normal mrgr" id="print">-->
                        <!--<span>打印</span>-->
                        <!--<div class="btn-ripple ripple"></div>-->
                    <!--</button>-->
                    <button class="btn btn-normal ceshi save" >
                        <span>提交</span>
                        <div class="btn-ripple ripple"></div>
                    </button>
                </div></div>`)
		},

		//创建events函数
		createActions() {
			let actions = {
				changeValue: (data) => {
					this.actions.checkValue(data);
				},
				emitHistory: (data) => {
					this.actions.openHistoryDialog(data);
				},
				openCorrespondence: (data) => {
					this.actions.openCorrespondence(data);
				},
				openSongGrid: (data) => {
					this.actions.openSongGrid(data);
				},
				changeOption: (data) => {
					this.actions.changeOption(data);
				},
				addItem: (data) => {
					this.actions.addItem(data);
				},
				addPassword: (data) => {
					this.actions.addPassword(data);
				},
				selectChoose: (data) => {
					this.actions.selectChoose(data);
				},
				addNewBuildIn: (data) => {
					this.actions.addNewBuildIn(data);
				},
				userSysOptions: (data) => {
					this.actions.changeMainDepart(true, data);
				},
				emitOpenCount: (data) => {
					this.actions.openCount(data);
				},
				emitDataIfInline: (data) => {
					this.actions.emitDataIfInline(data);
				},
				CorrespondenceRequiredChange:(data)=>{
					this.actions.CorrespondenceRequiredChange(data);
				}
			}
			return actions;
		},

		//对应关系必填改变
		CorrespondenceRequiredChange(data){
			this.data.data[data.dfield].correspondenceHasValue=data.correspondenceHasValue;
		},
		//内联子表刷新事件
		emitDataIfInline(data) {
			this.data.can_not_open_form = data.can_not_open_form;
			let type = data["type"];
			let isView = data["is_view"];
			if (type == 'popup') {
				this.data.sonTableId = data["value"];
				if (isView == '0') {
					this.data.viewMode = 'normal';
				} else {
					this.data.viewMode = 'viewFromSongrid';
				}
			} else {
				this.data.sonTableId = data["value"];
				if (isView == '0' && !this.data.SongridRef && !this.data.isInit && !data.isInit) {
					this.data.SongridRef = true;
					this.actions.setCountData(data.dfield);
				}
			}
			//保存父表数据
			this.data.data[data['dfield']].total = data['total'];
			window.top.frontendParentFormValue[this.data.tableId] = this.actions.createFormValue(this.data.data);
		},
		//打开统计穿透
		openCount(data) {
			let childId = data['field_content']['count_table'];
			let showName = `${this.data['table_name']}->${data['field_content']['child_table_name']}`;
			if (this.data.realId) {
				PMAPI.openDialogByIframe(`/iframe/sourceDataGrid/?tableName=${showName}&parentTableId=${this.data.tableId}&viewMode=count&tableId=${childId}&rowId=${this.data.realId}&tableType=count&fieldId=${data.id}`, {
					title: showName,
					width: 1400,
					height: 800,
				})
			} else {
				let formValue = this.actions.getFormValue();
				let d = {
					table_id: this.data.tableId,
					data: JSON.stringify(formValue),
					field_id: data.id
				};
				PMAPI.openDialogByIframe(`/iframe/sourceDataGrid/?viewMode=newFormCount&tableId=${childId}&fieldId=${data.id}`, {
					title: showName,
					width: 1200,
					height: 800,
				}, {d});
			}
		},
		//打开内置快捷添加
		addNewBuildIn(data) {
			let _this = this;
			_this.data['quikAddDfield'] = data.dfield;
			PMAPI.openDialogByIframe(`/iframe/addWf/?table_id=${data.source_table_id}&isAddBuild=1&id=${data.id}&key=${this.key}&btnType=new`, {
				width: 800,
				height: 600,
				title: `快捷添加内置字段`,
				modal: true
			}).then((data) => {
				if (!data.new_option) {
					return;
				}
				_this.actions.addNewBuildCb(data);
			});
		},

		addNewBuildCb(data){
			let options = this.data.childComponent[this.data['quikAddDfield']].data['options'];
			//默认选中新添加选项
			if (options[0] && options[0]['label'] == '请选择' || options[0]['label'] == '') {
				options.splice(1, 0, data.new_option);
			} else {
				options.splice(0, 0, data.new_option);
			}
			this.data.childComponent[this.data['quikAddDfield']].data.value = data.new_option.value;
			this.data.childComponent[_this.data['quikAddDfield']].data.showValue = data.new_option.label;
			this.data.data[this.data['quikAddDfield']] = this.data.childComponent[this.data['quikAddDfield']].data;
			this.data.childComponent[this.data['quikAddDfield']].reload();
			this.actions.triggerControl();
		},

		//打开选择器
		selectChoose(data) {
			let _this = this;
			PMAPI.openDialogByIframe(`/iframe/choose?fieldId=${data.id}&key=${this.data.key}`, {
				width: 900,
				height: 600,
				title: `选择器`,
				modal: true
			}, {
				data: data
			}).then((res) => {
				if (res.value) {
					_this.actions.selectChooseCb(res,data);
				}
			});
		},

		selectChooseCb(res,data){
			this.actions.setFormValue(data.dfield, res.value, res.label);
			this.actions.checkValue(data);
		},

		//打开密码框弹窗
		addPassword(data) {
			let _this = this;
			_this.data['addPassWordField'] = data.dfield;
			PMAPI.openDialogByComponent(AddEnrypt, {
				width: 800,
				height: 600,
				title: '修改内容',
				modal: true
			}).then((data) => {
				if (!data.cancel) {
					_this.actions.addEnrypt(data);
				}
			});
		},

		//打开快捷添加弹窗
		addItem(data) {
			this.data['quikAddDfield'] = data.dfield;
			let originalOptions;
			if (data.hasOwnProperty("options")) {
				originalOptions = data["options"];
			} else {
				originalOptions = data["group"];
			}
			this.actions.createAddItemComponent(originalOptions,data);
		},

		createAddItemComponent(originalOptions,data){
			let _this = this;
			AddItem.data.originalOptions = _.defaultsDeep({}, originalOptions);
			AddItem.data.fieldId = data.id;
			// AddItem.data.data=_.defaultsDeep({},data);
			PMAPI.openDialogByComponent(AddItem, {
				width: 800,
				height: 600,
				title: '添加新选项',
				modal: true
			}).then((data) => {
				if (data.onlyclose) {
					return;
				}
				_this.actions.addNewItem(data);
			});
		},
		//打开打印页眉设置弹窗 现由工作流负责此功能，以防万一先放着
		async printSetting() {
			let res = await FormService.getPrintSetting()
			// if(res.succ == 1){
			if (res.data && res.data.length && res.data.length != 0) {
				SettingPrint.data['printTitles'] = res['data'];
				SettingPrint.data['key'] = this.data.key;
				SettingPrint.data['myContent'] = res['data'][0]['content'] || '';
				SettingPrint.data['selectNum'] = parseInt(res['data']['index']) || 1;
			}
			PMAPI.openDialogByComponent(SettingPrint, {
				width: 500,
				height: 300,
				title: '自定义页眉',
				modal: true
			})
		},

		//打开子表弹窗
		openSongGrid(data) {
			let _this = this;
			// 保存父表数据
			_this.data.can_not_open_form = data.can_not_open_form;
			let type = data["popup"];
			let isView = data["is_view"];
			if (type == 1) {
				this.actions.openType1SongGrid(_this,data);
			} else {
				_this.data.sonTableId = data["value"];
				if (isView == '0') {
					_this.actions.setCountData(data.dfield);
				}
			}
			window.top.frontendParentFormValue[_this.tableId] = _this.actions.createFormValue(_this.data.data);
		},

		openType1SongGrid(_this,data){
			_this.data.sonTableId = data["value"];
			if (isView == '0') {
				_this.data.viewMode = 'EditChild';
			} else {
				_this.data.viewMode = 'ViewChild';
			}
			PMAPI.openDialogByIframe(`/iframe/sourceDataGrid/?tableId=${_this.data.sonTableId}&parentTableId=${data.parent_table_id}&parentRealId=${data.parent_real_id}&parentTempId=${data.temp_id}&rowId=${data.parent_temp_id}&tableType=child&viewMode=${_this.data.viewMode}`, {
				width: 1100,
				height: 600,
				title: `子表`,
				modal: true
			}).then(data => {
				if (_this.viewMode == 'EditChild') {
					_this.actions.setCountData(data.dfield);
				}
			})
		},

		//打开对应关系弹窗
		openCorrespondence(data) {
			let isView = data["is_view"];
			this.data.sonTableId = data["value"];
			if (isView == '0') {
				this.data.viewMode = 'editFromCorrespondence';
			} else {
				this.data.viewMode = 'viewFromCorrespondence';
			}
			let _this = this;
			let w = 1400,h = 800;
            if(window.innerWidth<1300){
                w = 900;
                h = 600;
            }
			PMAPI.openDialogByIframe(`/iframe/sourceDataGrid/?tableId=${data.value}&parentTableId=${CreateFormServer.data.tableId}&parentTempId=${data.temp_id}&recordId=${data.record_id}&viewMode=${this.data.viewMode}&showCorrespondenceSelect=true&correspondenceField=${data.dfield}`, {
				width: w,
				height: h,
				title: `对应关系`,
				modal: true
			}).then(res => {
				//关闭对应关系后的回调刷新
				_this.data.childComponent[data.dfield].data.dataGrid.actions.getGridData();
			})
		},

		//打开历史值弹窗
		openHistoryDialog(data) {
			let history = _.defaultsDeep({}, data.history_data);
			let i = 1;
			for (let k in history) {
				history[k]['index'] = i++;
			}
			this.actions.checkHistoryValue(data,history);
			History.data.history_data = history;
			PMAPI.openDialogByComponent(History, {
				width: 800,
				height: 600,
				title: `${data.label}历史修改记录`,
				modal: true
			})
		},

		checkHistoryValue(data,history){
			//处理周期规则值回车符
			if (data.type == 'SettingTextarea') {
				this.actions.checkSettingTextAreaHistoryValue(history);
			}
			//处理文本区回车符
			if (data.type == 'Textarea') {
				this.actions.checkTextAreaHistoryValue(history);
			}
			//处理富文本模板标签
			if (data.type == 'Editor') {
				this.actions.checkEditorHistoryValue(history);
			}
		},

		checkTextAreaHistoryValue(history){
			for (let key in history) {
				history[key]['new_value'] = history[key]['new_value'].replace(/\n/g, ";");
				history[key]['old_value'] = history[key]['old_value'].replace(/\n/g, ";");
			}
		},

		checkEditorHistoryValue(history){
			for (let key in history) {
				history[key]['new_value'] = history[key]['new_value'].replace(/<.*?>/ig, "");
				history[key]['old_value'] = history[key]['old_value'].replace(/<.*?>/ig, "");
			}
		},

		checkSettingTextAreaHistoryValue(history){
			for (let key in history) {
				if (_.isObject(history[key]['new_value'])) {
					history[key]['new_value'] = history[key]['new_value']['-1'].replace(/\n/g, ";");
				}
				if (_.isObject(history[key]['old_value'])) {
					history[key]['old_value'] = history[key]['old_value']['-1'].replace(/\n/g, ";");
				}
			}
		},

		beforeCreateFormControl(data,key){
			if(this.data.isEdit == 0 && this.data.isCalendar === '1') {
				data[key].is_view = 1;
			}
			let single = this.el.find('div[data-dfield=' + data[key].dfield + ']');
			let type=single.data('type');
			if(single.parent().find('div').length >2){
				single.css('display','inline-block');
			}
			if (data[key].required) {
				data[key]['requiredClass'] = data[key].value == '' ? 'required' : 'required2';

				if (type == 'Songrid') {
					data[key]['requiredClass'] = data[key].total == 0 ? 'required' : 'required2';
				}
			}
			if (single.data('width')) {
				data[key]['width'] = single.data('width') + 'px';
			} else {

				data[key]['width'] = '240px';
			}
			//数据填充后，根据修改条件对不同框进行只读操作
			let _this = this;
			setTimeout(() => {
				_this.actions.reviseCondition(data[key], data[key].value);
			}, 0);
			return {single,type};
		},

		renderAndSaveFormControl(formComponent,data,key,single){
			formComponent.render(single);
			this.data.childComponent[data[key].dfield] = formComponent;
		},

		createInputControl(data,key,single,actions){
			this.actions.renderAndSaveFormControl(new Input({data:data[key], events:actions}),data,key,single);
		},

		createCorrespondenceControl(data,key,single,actions){
			data[key]['temp_id'] = data['temp_id']['value'];
			data[key]['correspondenceHasValue']=false;
			let correspondence = new Correspondence({data:data[key], events:actions});
			this.actions.renderAndSaveFormControl(correspondence,data,key,single);
		},

		createSongridControl(data,key,single,actions){
			let popupType = single.data('popuptype') || 0;
			data[key]['temp_id'] = data['temp_id']['value'];
			data[key]['popup'] = popupType;
			//获取表单数据（子表导入用）
			let formData = {};
			for (let k in data) {
				formData[k] = data[k].value || '';
			}
			let songrid = new Songrid({data:Object.assign(data[key], {
				fromApprove: this.data.fromApprove,
				popupType: popupType,
				formData: JSON.stringify(formData)
			}), events:actions});
			this.actions.renderAndSaveFormControl(songrid,data,key,single);
		},

		createRadioControl(data,key,single,actions){
			this.actions.setRadioCheck(data[key]);
			let radio = new Radio({data:data[key], events:actions});
			this.actions.renderAndSaveFormControl(radio,data,key,single);
		},

		createTextareaControl(data,key,single,actions){
			let textArea = new TextArea({data:data[key], events:actions});
			this.actions.renderAndSaveFormControl(textArea,data,key,single);
		},

		createReadonlyControl(data,key,single,actions){
			if(this.data.tempId){
				data[key].canNotOpen=false;
			}
			if(data[key].real_type == 9 || data[key].real_type == 23 || data[key].real_type == 33){
				data[key]['read_only']=1;
				let attachmentControl = new AttachmentControl({data:data[key], events:actions});
				this.actions.renderAndSaveFormControl(attachmentControl,data,key,single);
				return;
			}
			let readonly = new Readonly({data:data[key], events:actions});
			this.actions.renderAndSaveFormControl(readonly,data,key,single);
		},

		createEnctyptInputControl(data,key,single,actions){
			let password = new Password({data:data[key], events:actions});
			this.actions.renderAndSaveFormControl(password,data,key,single);
		},

		createHiddenControl(data,key,single,actions){
			let hidden = new Hidden({data:data[key]});
			this.actions.renderAndSaveFormControl(hidden,data,key,single);
		},

		createSelectControl(data,key,single,actions){
			let selectControl = new SelectControl({data:data[key], events:actions});
			this.actions.renderAndSaveFormControl(selectControl,data,key,single);
		},

		createYearControl(data,key,single,actions){
			let yearControl = new YearControl({data:data[key], events:actions});
			this.actions.renderAndSaveFormControl(yearControl,data,key,single);
		},

		createYearmonthtimeControl(data,key,single,actions){
			let yearMonthControl = new YearMonthControl({data:data[key], events:actions});
			this.actions.renderAndSaveFormControl(yearMonthControl,data,key,single);
		},

		async createBuildinControl(data,key,single,actions){
			if(data[key].options=='other_place'){
				if(!this.data.buildin_options ||(this.data.buildin_options[data[key].id] && this.data.buildin_options[data[key].id].length==0)){
					let res=await FormService.getFormStaticBuildinData(this.actions.createPostJson());
					this.data.oldData[key].options=data[key].options=(res.data && res.data.buildin_options)?res.data.buildin_options:[{value:'',label:''}];
				}else{
					this.data.oldData[key].options=data[key].options=this.data.buildin_options[data[key].id];
				}
			}
			let buildInControl = new BuildInControl({data:data[key], events:actions});
			this.actions.renderAndSaveFormControl(buildInControl,data,key,single);
		},

		async createMultiLinkageControl(data,key,single,actions){
			if(data[key].dataList=='other_place'){
				if(!this.data.buildin_options ||(this.data.buildin_options[data[key].id] && $.isEmptyObject(this.data.buildin_options[data[key].id]))){
					let res=await FormService.getFormStaticBuildinData(this.actions.createPostJson());
					this.data.oldData[key].dataList=data[key].dataList=(res.data && res.data.buildin_options)?res.data.buildin_options:{' ':{value:'',label:''}};
				}else{
					this.data.oldData[key].dataList=data[key].dataList=this.data.buildin_options[data[key].id];
				}
			}
			let multiLinkageControl = new MultiLinkageControl({data:data[key], events:actions});
			this.actions.renderAndSaveFormControl(multiLinkageControl,data,key,single);
		},

		createMultiSelectControl(data,key,single,actions){
			if (single.data('childData')) {
				data[key].childData = single.data('childData');
			}
			if (single.data('selectType')) {
				data[key].childData = single.data('selectType');
			}
			data[key].is_special = data[key].field_content['special_multi_choice'] == 1 ? true : false;
			let multiSelectControl = new MultiSelectControl({data:data[key], events:actions});
			this.actions.renderAndSaveFormControl(multiSelectControl,data,key,single);
		},

		createEditorControl(data,key,single,actions){
			let editorControl = new EditorControl({data:data[key], events:actions});
			this.actions.renderAndSaveFormControl(editorControl,data,key,single);
		},

		createSettingTextareaControl(data,key,single,actions){
			let settingTextareaControl = new SettingTextareaControl({data:data[key], events:actions});
			this.actions.renderAndSaveFormControl(settingTextareaControl,data,key,single);
		},

		createPictureControl(data,key,single,actions){
			let attachmentControl = new AttachmentControl({data:data[key], events:actions});
			this.actions.renderAndSaveFormControl(attachmentControl,data,key,single);
		},

		createTimeControl(data,key,single,actions){
			let timeControl = new TimeControl({data:data[key], events:actions});
			this.actions.renderAndSaveFormControl(timeControl,data,key,single);
		},

		createDateControl(data,key,single,actions){
			let dateControl = new DateControl({data:data[key], events:actions});
			this.actions.renderAndSaveFormControl(dateControl,data,key,single);
		},

		createDatetimeControl(data,key,single,actions){
			let dateTimeControl = new DateTimeControl({data:data[key], events:actions});
			this.actions.renderAndSaveFormControl(dateTimeControl,data,key,single);
		},

		createeditControlControl(data,key,single,actions){
			data[key]['real_id'] = data['real_id']['value'];
			data[key]['table_id'] = data['table_id']['value'];
			data[key]['temp_id'] = data['temp_id']['value'];
			data[key]['iframe_key'] = window.config.key;
			let contractControl = new ContractControl({data:data[key], events:actions});
			this.actions.renderAndSaveFormControl(contractControl,data,key,single);
		},

		//动态创建组件
		async createFormControl() {
			this.setData('childComponent', {});
			let data = this.data.data;
			this.setData('oldData', _.defaultsDeep({}, data));
			let actions = this.actions.createActions();
			for (let key in data) {
				let {single,type}=this.actions.beforeCreateFormControl(data,key);
				//在这里根据type创建各自的控件
				switch (type) {
					case 'Correspondence':
						this.actions.createCorrespondenceControl(data,key,single,actions);
						break;
					case 'Songrid':
						this.actions.createSongridControl(data,key,single,actions);
						break;
					case 'Radio':
						this.actions.createRadioControl(data,key,single,actions);
						break;
					case 'Input':
						this.actions.createInputControl(data,key,single,actions);
						break;
					case 'Textarea':
						this.actions.createTextareaControl(data,key,single,actions);
						break;
					case 'Readonly':
						this.actions.createReadonlyControl(data,key,single,actions);
						break;
					case 'EnctyptInput':
						this.actions.createEnctyptInputControl(data,key,single,actions);
						break;
					case 'Hidden':
						this.actions.createHiddenControl(data,key,single,actions);
						break;
					case 'Select':
						this.actions.createSelectControl(data,key,single,actions);
						break;
					case 'Year':
						this.actions.createYearControl(data,key,single,actions);
						break;
					case 'Yearmonthtime':
						this.actions.createYearmonthtimeControl(data,key,single,actions);
						break;
					case 'Buildin':
						await this.actions.createBuildinControl(data,key,single,actions);
						break;
					case 'MultiLinkage':
						await this.actions.createMultiLinkageControl(data,key,single,actions);
						break;
					case 'MultiSelect':
						this.actions.createMultiSelectControl(data,key,single,actions)
						break;
					case 'Editor':
						this.actions.createEditorControl(data,key,single,actions);
						break;
					case 'SettingTextarea':
						this.actions.createSettingTextareaControl(data,key,single,actions)
						break;
					case 'Attachment':
					case 'Picture':
						this.actions.createPictureControl(data,key,single,actions)
						break;
					case 'Time':
						this.actions.createTimeControl(data,key,single,actions);
						break;
					case 'Date':
						this.actions.createDateControl(data,key,single,actions);
						break;
					case 'Datetime':
						this.actions.createDatetimeControl(data,key,single,actions)
						break;
					case 'editControl':
						this.actions.createeditControlControl(data,key,single,actions)
						break;
				}
			}
			$(function () {
				$("#form-paging-tabs-control").tabs();
			});
		},

		//改变人员信息表主岗选项
		changeMainDepart(isClick, _this) {
			let arr = [{value: '', label: '请选择'}];
			//判断是否需要将主岗部门置为请选择
			if (isClick) {
				let arr_1 = [];
				for (let i = 1; i < _this.department["options"].length; i++) {
					arr_1.push(_this.department["options"][i]["value"]);
				}
				if (arr_1.length != _this.value.length) {
					this.actions.setFormValue(_this.form_department, '');
				}
			}
			//改变主岗部门option
			for (let i = 0; i < _this.value.length; i++) {
				for (let j in _this.main_depart) {
					if (_this.main_depart[j]["value"] === _this.value[i]) {
						arr.push(_this.main_depart[j]);
					}
				}
			}
			this.data.data[_this.department.dfield]["options"] = arr;
			this.data.childComponent[_this.department.dfield].data["options"] = arr;
			this.data.childComponent[_this.department.dfield].reload();
		},
		//给外部提供cacheNew cacheOld
		getCacheData() {
			let formValue = this.actions.createFormValue(this.data.data, true);
			if (formValue.error) {
				return formValue;
			}
			let data = this.actions.handleFormData(formValue);
			let formDataOld = this.data.oldData;
			let obj_new = this.actions.createCacheData(formDataOld, data, true, this);
			let obj_old = this.actions.createCacheData(formDataOld, data, false, this);
			return {
				obj_new,
				obj_old
			}
		},
		setVoteValue(res){
			let value=res.value;
			this.data.submitKey=res.submitKey;
			if(value){
				for(let key in this.data.data){
					if(this.data.data[key].id == value){
						let val
						if(this.data.vote_value){
							if( this.data.vote_value == value){
								break;
							}else{
								val=this.data.data[this.data.vote_key].value-1;
								this.actions.setFormValue(this.data.vote_key,val,true);
								val=this.data.data[key].value+1;
								this.actions.setFormValue(key,val,true);
								this.data.vote_value=value;
								this.data.vote_key=key;
								break;
							}
						}else{
							val=this.data.data[key].value+1;
							this.actions.setFormValue(key,val,true);
							this.data.vote_value=value;
							this.data.vote_key=key;
							break;
						}
					}
				}
				setTimeout(()=>{
					Mediator.publish('form:voteAllready',true)
				},0);
			}
		},
		saveParentRelation(){
			//存父子表关系
			if (!window.top.frontendRelation) {
				window.top.frontendRelation = {};
			}
			if (!window.top.frontendParentNewData) {
				window.top.frontendParentNewData = {};
			}
			if (!window.top.isSonGridDataNeedParentTepmId) {
				window.top.isSonGridDataNeedParentTepmId = '';
			}
			if (!window.top.idsInChildTableToParent) {
				window.top.idsInChildTableToParent = {};
			}
			if (!window.top.frontendParentFormValue) {
				window.top.frontendParentFormValue = {};
			}
			window.top.frontendRelation[this.data.tableId] = this.data["frontend_cal_parent_2_child"];
			//存父表的newData
			window.top.frontendParentNewData[this.data.tableId] = _.defaultsDeep({},this.data.data);
			window.top.isSonGridDataNeedParentTepmId = this.data.data['temp_id'] && this.data.data['temp_id']['value']?this.data.data['temp_id']['value'] : '';
		},
		formStyle(){
			//默认表单样式
			if (this.el.find('table').hasClass('form-version-table-user') || this.el.find('table').hasClass('form-version-table-department')){
				this.el.find('table').parents('.form-print-position').css("margin-bottom","40px");
			}
			this.el.find("#form-paging-tabs-control  .paging-tabs-tabform").on('click', function () {
				$(this).css('background','#ffffff').siblings().css('background','#F2F2F2');
			})
		},
		initForm(){
			this.actions.saveParentRelation();
			this.data.isInit = true;
			this.actions.createFormControl();
			if (this.data.is_view == 1) {
				this.actions.checkCustomTable();
			}
			// this.actions.triggerControl();
			this.actions.firstGetData();
			this.actions.changeOptions();
			this.actions.setDataFromParent();
			if (this.data.btnType != 'none') {
				this.actions.addBtn();
			}
            if(window.top.miniFormVal && !this.data.data['real_id']['value']){
				let miniFormVal =  window.top.miniFormVal[this.data.data['table_id']['value']]
				for(let k in miniFormVal){
					let val = miniFormVal[k];
					this.actions.setFormValue(k,val)
				}
			}
			window.top.frontendParentFormValue[this.data.tableId] = this.actions.createFormValue(this.data.data);
			this.actions.formStyle();
			this.data.isInit = false;
		},
	},
	afterRender() {
        this.actions.initForm();
	},

	firstAfterRender(){
		Mediator.subscribe('workflow:voteconfirm',(res)=>{
			this.actions.setVoteValue(res);
		})
	},

	beforeDestory() {
		delete window.top.frontendParentFormValue[this.tableId];
		this.el.off();
	}
}

let BaseForm = Component.extend(config)
export default BaseForm
