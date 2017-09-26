/**
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
            //待跟aggrid协定
            // if(!this.globalService.fromSongridControl){return false;}
            if (this.data.parent_table_id !== "" && FormService.frontendRelation[this.data.parent_table_id] && FormServicefrontendRelation[this.data.parent_table_id][this.data.tableId]) {
                //父子表对应的kv关系
                let kvDict = FormService.frontendRelation[this.data.parent_table_id][this.data.tableId]["pdfield_2_cdfield"];
                //父表的this.form.value
                let formDataFromParent = FormService.frontendParentFormValue[this.data.parent_table_id];
                //组装子表所需列表或表单中内置或相关的父表中数据
                let parentData = FormService.packageParentDataForChildData(kvDict, formDataFromParent, this.data.parent_table_id);
                //子表的this.newData
                let newDataFromSongrid = FormService.frontendParentNewData[this.data.tableId];
                //循环给子表赋值
                for (let key in kvDict) {
                    let val = parentData[key];
                    //子表的dfield
                    let songridDfield = kvDict[key];
                    //判断子表类型
                    if (newDataFromSongrid.hasOwnProperty(songridDfield)) {
                        this.data.idsOfSonDataByParent.push(songridDfield);
                        let dinput_type = newDataFromSongrid[songridDfield]["dinput_type"] || "";
                        let options = [{value: val, label: val}];
                        if (FIELD_TYPE_MAPPING.SELECT_LIST.indexOf(dinput_type) != -1) {
                            let options = [{value: val, label: val}];
                            this.data.data[songridDfield]["options"] = options;
                        }
                        this.actions.setFormValue(songridDfield, val);
                        this.actions.triggerSingleControl(songridDfield);
                    }
                }
                if (FormService.idsInChildTableToParent.hasOwnProperty(this.data.tableId)) {
                    FormService.idsInChildTableToParent[this.data.tableId].concat(this.data.idsOfSonDataByParent);
                } else {
                    FormService.idsInChildTableToParent[this.data.tableId] = JSON.parse(JSON.stringify(this.data.idsOfSonDataByParent));
                }
            }
        },

        //给子表统计赋值
        async setCountData() {
            let res = await FormService.getCountData({
                //传给后台当前表单所有控件的值
                data: this.actions.createFormValue(this.data.data),
                //传子表id
                child_table_id: this.data.sonTableId
            });
            //给统计赋值
            for (let d in res["data"]) {
                this.actions.setFormValue(d, res["data"][d]);
            }
        },

        //给外部提供formValue格式数据
        //@param isCheck判断是否需要执行表单校验
        getFormValue(isCheck) {
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
                if ((FormService.idsInChildTableToParent[this.data.tableId] && FormService.idsInChildTableToParent[this.data.tableId].indexOf(key) != -1 ) && val != "" && parentTempId != "" && (type == 'Buildin' || type == 'Select')) {
                    data[key] = data["parent_temp_id"];
                }
            }
        },

        //创建cache数据
        //@param formData原始表单数据,val当前表单数据,isNew 是否是cacheNew
        createCacheData(formData, val, isNew, com) {
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
                            } else if (data.type == "MultiLinkage") {
                                obj[key] = [];
                                let list = data['dataList'];
                                if (isNew) {
                                    obj[key] = JSON.stringify(list[val[key]]);
                                } else {
                                    obj[key] = JSON.stringify(list[data.value]);
                                }
                            } else if (data.type == "SettingTextarea") {//周期规则
                                obj[key] = '';
                                if (isNew) {
                                    obj[key] = val[key][-1];
                                } else {
                                    obj[key] = data.value[-1] || ''
                                }
                                // }else if(data.type == 'Radio'){
                                //     Object.getOwnPropertyNames(data[select]).forEach(option=>{
                                //         if( isNew) {
                                //             if(option == val[key]){
                                //                 obj[key] = data[select][option];
                                //             }
                                //         }else {
                                //             if(option == data.value){
                                //                obj[key] = data[select][option];
                                //             }
                                //         }
                                //     })
                            } else {
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
                            }
                        } else {
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
                        }
                    }
                }
            }
            return obj;
        },

        //提交检查
        //@param allData全部控件属性,formvalue 表单值格式
        validForm(allData, formValue) {
            let error = false;
            let errorMsg = "";
            for (let key in formValue) {
                let data = allData[key];
                //如果该dfield是父表填充子表的，那就不验证
                if (this.data.idsOfSonDataByParent.indexOf(key) != -1) {
                    continue;
                }
                let type = data["type"];
                if (type == 'songrid') {
                    continue;
                }
                let val = formValue[key];
                //必填检查
                if (data["required"]) {
                    if (( ( val == "" ) && ( ( val + '' ) != '0' ) ) || val == "[]") {
                        error = true;
                        errorMsg = `${ data["label"] }是必填项!`;
                        break;
                    }
                }
                //正则检查
                if (val != "" && data["reg"] !== "") {
                    for (let r in data["reg"]) {
                        //有待优化
                        if (r.startsWith('/') && r.endsWith('/')) {
                            r = r.substring(1)
                            r = r.substring(0, r.length - 1);
                        }
                        let reg = new RegExp(r);
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
            for (let d in allData) {
                if (allData[d].type == 'songrid' && allData[d].required && allData[d].total == 0) {
                    error = true;
                    errorMsg = '子表字段:' + allData[d].label + '是必填！';
                    break;
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
                this.baseIdsLocal.push(originalData["dfield"]);
            }
            this.data.baseIdsLocalDict[originalData["dfield"]] = val;
            if (this.data.base_fields.sort().toString() == this.data.baseIdsLocal.sort().toString()) {
                //请求默认值
                let json = {
                    flow_id: this.data.flowId || "",
                    base_field_2_value: JSON.stringify(this.data.baseIdsLocalDict),
                    temp_id: this.data.temp_id["value"]
                };
                let res = await FormService.getDefaultValue(json);
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
                            //如果是对应关系回显默认值
                            if (type == 'correspondence' && value != "") {
                                this.data.childComponents[key].actions.correspondenceDefault(data['value']);
                            }
                            //如果是内联子表默认值
                            if (type == 'songrid') {
                                this.data.childComponents[key].actions.songridDefault(data['value']);
                            }
                            //如果是多级内置
                            if (type == 'multi-linkage') {
                                if (value.length != 0) {
                                    this.data.childComponents[key].actions.multiLinkageDefaultData(value);
                                } else {
                                    this.data.childComponents[key].actions.multiLinkageDefaultData('none');
                                }
                            }
                            //如果是周期规则
                            if (type == 'datetime') {
                                value = value.replace(" ", "T");
                                this.setFormValue(key, value);
                            }
                            //如果是周期规则
                            if (type == 'setting-textarea') {
                                this.data.childComponents[key].actions.loadSettingtextarea(value);
                            }
                            this.setFormValue(key, value);
                        }
                    }
                }
            }
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

        //替换表达式中的字段
        //暂时无用
        replaceSymbol(data) {
            let reg = /\@f\d+\@/g;
            let items = data.match(reg);
            let str_ = data.indexOf("\"else\"") != -1 ? ('\\\"') : ('\"');
            for (let item of items) {
                item = item.replace("@", "").replace("@", "");
                let itemData = this.data.data[item];
                let v = ['value'];
                let isUndefined = false;
                if (v == undefined) {
                    isUndefined = true;
                }
                let type = "";
                let dinput_type = "";
                if (itemData.hasOwnProperty("real_type")) {
                    type = itemData["real_type"];
                }
                if (itemData.hasOwnProperty("dinput_type")) {
                    dinput_type = itemData["dinput_type"];
                }
                if (FIELD_TYPE_MAPPING.SELECT_TYPE.indexOf(dinput_type) != -1) {
                    //枚举类型 or 各种内置
                    v = this.actions.getTextByOptionID(item, itemData['value']);
                }
                if (FIELD_TYPE_MAPPING.NUMBER_TYPE_LIST.indexOf(type) != -1) {
                    //整数或者小数
                    v = v === "" ? 0 : v;
                } else {
                    v = (v === "") ? (str_ + str_) : (str_ + v + str_);
                }
                if (isUndefined) {
                    data = data.replace("@" + item + "@", '\\\"\\\"');
                } else {
                    data = data.replace("@" + item + "@", v);
                }
                if (fieldTypeService.DATETIME == dinput_type) {
                    v = v.replace("T", " ");
                }
                data = data.replace("@" + item + "@", v);
            }
            data = data.replace(/\#/g, 'this.');
            return data;
        },

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
                    if (FIELD_TYPE_MAPPING.NUMBER_TYPE_LIST.indexOf(data["real_type"]) != -1) {
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
                    if (FIELD_TYPE_MAPPING.NUMBER_TYPE_LIST.indexOf(data["real_type"]) != -1) {
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
            this.actions.countFunc(f);
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
                    for (let item of hasThisFieldList) {
                        if (this.data.myPluginFields.indexOf(item) == -1) {
                            isAllInclude = false;
                        }
                    }
                    //触发
                    if (isAllInclude) {
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
                    }
                }
            }
        },

        /**
         *  表达式主要方法
         *  此data结构为{val: 自身的value,effect: [] 被影响的dfield集合}
         *  暂时只有后端表达式计算，以后需要加上前端表达式判断
         */
        async calcExpression(data) {
            // let send_exps = [];
            if (!data["effect"] || !data["effect"].length > 0) {
                return;
            }
            let fields = {};
            //不需要的字段
            let continue_key = FormService.continue_key;
            //需要的字段
            let need_key = FormService.need_key;
            for (let f in this.data.data) {
                if (continue_key.indexOf(f) != -1) {
                    continue
                }
                let temp_field = this.data.data[f];
                fields[f] = {}
                for (let i in need_key) {
                    fields[f][need_key[i]] = temp_field[need_key[i]];
                }
            }
            let new_data = {};
            let old_data = this.actions.createFormValue(this.data.data);
            for (let d in old_data) {
                if (continue_key.indexOf(d) != -1) {
                    continue
                }
                new_data[d] = old_data[d];
            }
            for (let key in new_data) {
                if (this.data.data[key].effect && this.data.data[key].effect.length > 0 && (this.data.data[key]['options'] || this.data.data[key]['group'])) {
                    //需要传递text值
                    new_data[key] = this.actions.getTextByOptionID(key, new_data[key]);
                }
            }
            let res = await FormService.expEffect({
                data: new_data,
                fields: fields,
                change_fields: [data.id]
            });
            for (let j in res['data']) {
                this.actions.set_value_for_form(res['data'][j], j);
            }
            //直接传给后台判断 后期会添加前端验证
            // for(let f of data["effect"]) {
            //     //如果这个字段存在的话，再进行下面的逻辑
            //     let expression;
            //     if(this.data.data.hasOwnProperty(f)) {
            //         let expressionStr = this.data.data[f]["expression"];
            //         let real_type = this.data.data[f]["real_type"];
            //         if(expressionStr !== ""){
            //             expression = this.actions.replaceSymbol(expressionStr);
            //             try {
            //                 if (expression.indexOf("$^$")==-1){
            //                     try {
            //                         if(this.data[expressionStr.split("@")[1]]["is_view"] != 1){
            //                             this.actions.set_value_for_form(eval(expression), f);
            //                         }
            //                     } catch (e) {
            //                         send_exps.push({"f": f, "expression": expression,"real_type":real_type});
            //                     }
            //                 }else{
            //                     send_exps.push({"f": f, "expression": expression,"real_type":real_type});
            //                 }
            //             } catch (e) {
            //                 console.error("没有解析成功，1,解析错误2，可能是没有此函数"+e);
            //             }
            //         }
            //     }
            // }
            // if (send_exps.length!=0) {
            //     let _this=this;
            //     FormService.get_exp_value(encodeURIComponent(JSON.stringify(send_exps))).then(res=>{
            //         for (let j in res['data']){
            //             _this.actions.set_value_for_form(res['data'][j], j);
            //         }
            //     });
            // }
        },

        //改变选择框的选项
        changeOptions() {
            for (let key in this.data.data) {
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
                if (data['linkage'] != {}) {
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
                        for (let field of arr) {
                            this.data.data[field][obj[this.data.data[field]['type']]] = this.data.optionsToItem[field];
                        }
                    }
                }
            }
        },

        //改变选择框的选项
        changeOptionOfSelect(data, l) {
            let obj = {'select': 'options', 'radio': 'group', 'multi-select': 'options'};
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
                if (affectType == 'multi-select') {
                    this.data.data[key]['value'] = [];
                } else {
                    this.data.data[key]['value'] = '';
                }
                this.data.childComponent[this.data.data[key]['dfield']].actions.changeOption(this.data.data[key]['dfield']);
            }
        },

        //修改必填性功能
        requiredCondition(editConditionDict, value) {
            let arr = [];
            for (let key in editConditionDict["required_condition"]) {
                if (key == 'and') {
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
                        this.data.childComponent[f].reload();
                    }
                } else {
                    for (let dfield of editConditionDict["required_condition"][key]) {
                        if (arr.indexOf(dfield) != -1) {
                            continue;
                        }
                        this.data.data[dfield]["required"] = this.data.childComponent[dfield].data['required'] = (key == value) ? 1 : 0;
                        this.data.childComponent[dfield].reload();
                        if (key == value) {
                            arr.push(dfield);
                        }
                    }
                }
            }
        },

        //创建表单数据格式 形如{dfield:value}
        //@param data为当前表单最新的数据，isCheck 是否执行表单校验
        createFormValue(data, isCheck) {
            let formValue = {};
            for (let key in data) {
                formValue[key] = data[key].value;
            }
            if (isCheck) {
                //外部调用需要验证表单
                let {error, errorMsg} = this.actions.validForm(this.data.data, formValue);
                if (error) {
                    return {
                        error: error,
                        errorMessage: errorMsg
                    }
                } else {
                    return formValue;
                }
            } else {
                return formValue;
            }
        },

        //判断一下日期的类型，并且进行限制
        //当数据不符格式限制时，要将对应表单值设为空
        checkDateType(data) {
            for (let i in this.data.data) {
                if (this.data.data[i]['type'] == 'Date') {
                    let temp = this.data.data[i];
                    let dfield = this.data.data[i]['dfield'];//f8
                    if (temp['timeType'] == 'after') {
                        let vals = data[dfield].split("-");
                        //let vals = val.split("-");//[2011,11,11];
                        let myData = new Date();
                        let dates = [myData.getFullYear(), myData.getMonth() + 1, myData.getDate()];
                        for (let i = 0; i < 3; i++) {
                            if (vals[i] < dates[i]) {
                                data[dfield] = '';
                            }
                        }
                    } else if (this.data.data[i]['type'] == 'before') {
                        let vals = data[dfield].split("-");
                        //let vals = val.split("-");//[2011,11,11];
                        let myData = new Date();
                        let dates = [myData.getFullYear(), myData.getMonth() + 1, myData.getDate()];
                        for (let i = 0; i < 3; i++) {
                            if (vals[i] < dates[i]) {
                                data[dfield] = '';
                            }
                        }
                    }
                }
                if (this.data.data[i]['type'] == 'Datetime') {
                    let temp = this.data.data[i];
                    let dfield = this.data.data[i]['dfield'];//f8
                    if (temp['timeType'] == 'after') {
                        let vals = data[dfield].split(" ")[0].split("-");
                        //let vals = val.split("-");//[2011,11,11];
                        let myData = new Date();
                        let dates = [myData.getFullYear(), myData.getMonth() + 1, myData.getDate()];
                        for (let i = 0; i < 3; i++) {
                            if (vals[i] < dates[i]) {
                                data[dfield] = '';
                            }
                        }
                    } else if (this.data.data[i]['type'] == 'before') {
                        let vals = data[dfield].split(" ")[0].split("-");
                        //let vals = val.split("-");//[2011,11,11];
                        let myData = new Date();
                        let dates = [myData.getFullYear(), myData.getMonth() + 1, myData.getDate()];
                        for (let i = 0; i < 3; i++) {
                            if (vals[i] < dates[i]) {
                                data[dfield] = '';
                            }
                        }
                    }
                }
            }
        },

        //统计功能
        async countFunc(dfield) {
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
                        let formValue = this.actions.createFormValue(this.data.data);
                        let res = await FormService.getCountData({data: JSON.stringify(formValue)})
                        //给统计赋值
                        for (let d in res["data"]) {
                            this.actions.setFormValue(d, res["data"][d]);
                        }
                    }
                }
            }
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
            if (_this.data.value === '') {
                _this.el.find('#requiredLogo').removeClass().addClass('required');
            } else {
                _this.el.find('#requiredLogo').removeClass().addClass('required2');
            }
        },
        //赋值
        setFormValue(dfield, value) {
            let data = this.data.data[dfield];
            if (data) {
                let childComponet = this.data.childComponent[dfield];
                childComponet.data["value"] = data["value"] = value;
                childComponet.reload();
            }
        },
        //给相关赋值
        async setAboutData(id, value) {
            let res = await FormService.getAboutData({buildin_field_id: id, buildin_mongo_id: value});
            for (let k in res["data"]) {
                //如果是周期规则
                let data = this.data.data;
                if (data.hasOwnProperty(k) && data[k].hasOwnProperty("real_type") && data[k]["real_type"] == '27') {
                    if (res["data"][k]["-1"]) {
                        this.actions.setFormValue.bind(this)(k, res["data"][k]["-1"]);
                    }
                } else {
                    this.actions.setFormValue.bind(this)(k, res["data"][k]);
                }
            }
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
        //密码框回显
        addEnrypt(data) {
            let value = this.actions.md5(data.newItems);
            let psField = this.data['addPassWordField'];
            this.data.data[psField].value = value;
            this.data.childComponent[psField].actions.hasChangeValue(this.data.data[psField]);
        },
        //提交表单数据
        async onSubmit() {
            let formValue = this.actions.createFormValue(this.data.data);
            let {error, errorMsg} = this.actions.validForm(this.data.data, formValue);
            if (error) {
                MSG.alert(errorMsg);
                this.data.isBtnClick = false;
                return;
            }
            let data = this.actions.handleFormData(formValue);
            let formDataOld = this.data.oldData;
            //如果有其他字段的数据，这里是拼approvedFormData
            this.actions.checkDateType(formValue);
            let obj_new = this.actions.createCacheData(formDataOld, data, true, this);
            let obj_old = this.actions.createCacheData(formDataOld, data, false, this);
            this.actions.changeValueForChildTable(data);
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
            let res = await FormService.saveAddpageData(json);
            if (res.succ == 1) {
                MSG.alert('保存成功')
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
            } else {
                MSG.alert(res.error);
            }
            this.data.isBtnClick = false;
            //清空子表内置父表的ids
            delete FormService.idsInChildTableToParent[this.data.tableId];
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
            //如果是临时表，传temp_id，否则是real_id
            if (this.data.inProcess == 1 || this.data.isBatch == 1) {
                json["temp_id"] = this.data.realId;
            } else {
                json["real_id"] = this.data.realId;
            }
            return json;
        },

        checkCustomTable(){
            console.log(this.data.custom_table_form_exists);
            if (this.data.custom_table_form_exists) {
                console.log(this.data.table_name);
                if (this.data.table_name == '人员信息') {
                    for (let key in this.data.data) {
                        console.log(this.data.data[key].label);
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
            let res = await FormService.getDynamicDataImmediately(json);
            for (let key in res.data) {
                this.data.data[key] = Object.assign({}, this.data.data[key], res.data[key]);
                if (this.data.childComponent[key]) {
                    this.data.childComponent[key].data = Object.assign({}, this.data.childComponent[key].data, res.data[key]);
                    this.data.childComponent[key].reload();
                }
            }
            if (this.data.isOtherChangeEdit) {
                this.data.btnType = 'none';
            } else {
                this.data.btnType = 'new';
            }
            this.actions.addBtn();
            this.actions.checkCustomTable();
            this.actions.triggerControl();
            this.data.isBtnClick = false;
        },
        //修改可修改性
        reviseCondition: function (editConditionDict, value) {
            // if(this.dfService.isView){return false;}
            let arr = [];
            for (let key in editConditionDict["edit_condition"]) {
                if (key == 'and') {
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
                } else {
                    for (let dfield of editConditionDict["edit_condition"][key]) {
                        if (arr.indexOf(dfield) != -1) {
                            continue;
                        }
                        //如果有字段的负责性，再开始下面的逻辑
                        let data = this.data.data[dfield];
                        // console.log('dd  ',data)
                        if (this.data.data[dfield]["required_perm"] == 1) {
                            let data = this.data.data[dfield];


                            //针对多选下拉框，只要包含就可以
                            if (value instanceof Array) {
                                data["be_control_condition"] = value.indexOf(key) != -1 ? 0 : 1;
                            } else {
                                data["be_control_condition"] = (key == value) ? 0 : 1;
                            }
                            if (data["is_view"] == 0) {
                                arr.push(dfield);
                            }
                        }
                        this.data.childComponent[dfield].data = data;
                        this.data.childComponent[dfield].reload();
                    }
                }
            }
        },
        //触发事件检查
        checkValue: function (data) {
            if (!this.data.childComponent[data.dfield]) {
                return;
            }
            if (this.data.data[data.dfield]) {
                this.data.data[data.dfield] = _.defaultsDeep({}, data);
            }
            if (data.type == 'Buildin') {
                let id = data["id"];
                let value;
                for (let obj of data['options']) {
                    if (obj.value == data.value) {
                        value = obj.value;
                        break;
                    }
                }
                this.actions.setAboutData(id, value);
            }
            //检查是否是默认值的触发条件
            // if(this.flowId != "" && this.data.baseIds.indexOf(data["dfield"]) != -1 && !isTrigger) {
            if (this.data.flowId != "" && this.data['base_fields'].indexOf(data["dfield"]) != -1) {
                this.actions.validDefault(data, data['value']);
            }
            //统计功能
            this.actions.countFunc(data.dfield);
            //改变选择框的选项
            if (data['linkage'] != {}) {
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
                        this.data.data[field][obj[this.data[field]['type']]] = this.data.optionsToItem[field];
                    }
                }
            }

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

            let calcData = {
                val: data['value'],
                effect: data["effect"],
                id: data['id']
            };
            this.actions.calcExpression(calcData, data['value']);
            if (data.required) {
                this.actions.requiredChange(this.data.childComponent[data.dfield]);
            }
        },
        //添加按钮组
        addBtn() {
            this.el.find('.ui-btn-box').remove();
            //添加提交按钮
            // let $wrap = this.el.find('table').parentsUntil(this.data.el);
            let $wrap = this.el;
            if (this.data.btnType == 'new' || this.data.btnType == 'edit') {
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
            } else if (this.data.btnType == 'view') {
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
            } else if (this.data.btnType == 'none') {

            } else if (this.data.btnType == 'confirm') {
                $wrap.append(`<div class="noprint ui-btn-box"><div >
                    <button class="btn btn-normal">
                        <span>确定</span>
                        <div class="btn-ripple ripple"></div>
                    </button>
                </div></div>`)
            }
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
                }
            }
            return actions;
        },
        //打开统计穿透
        openCount(data) {
            let childId = data['field_content']['count_table'];
            let showName = `${this.data['table_name']}=>${data['field_content']['child_table_name']}`;
            if (this.data.realId) {
                PMAPI.openDialogByIframe(`/iframe/sourceDataGrid/?tableName=${showName}&parentTableId=${this.data.tableId}&viewMode=count&tableId=${childId}&rowId=${this.data.realId}&tableType=count&fieldId=${data.id}`, {
                    title: showName,
                    width: 1200,
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
                let options = _this.data.childComponent[_this.data['quikAddDfield']].data['options'];
                //默认选中新添加选项
                if (options[0] && options[0]['label'] == '请选择' || options[0]['label'] == '') {
                    options.splice(1, 0, data.new_option);
                } else {
                    options.splice(0, 0, data.new_option);
                }
                _this.data.childComponent[_this.data['quikAddDfield']].data.value = data.new_option.value;
                _this.data.childComponent[_this.data['quikAddDfield']].data.showValue = data.new_option.label;
                _this.data.data[_this.data['quikAddDfield']] = _this.data.childComponent[_this.data['quikAddDfield']].data;
                _this.data.childComponent[_this.data['quikAddDfield']].reload();
            });
        },
        //打开选择器
        selectChoose(data) {
            let _this = this;
            PMAPI.openDialogByIframe(`/iframe/choose?fieldId=${data.id}`, {
                width: 900,
                height: 600,
                title: `选择器`,
                modal: true
            }).then((res) => {
                if (res.value) {
                    _this.actions.setFormValue(data.dfield, res.value, res.label);
                    _this.actions.checkValue(data);
                }
            });
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
            let _this = this;
            _this.data['quikAddDfield'] = data.dfield;
            let originalOptions;
            if (data.hasOwnProperty("options")) {
                originalOptions = data["options"];
            } else {
                originalOptions = data["group"];
            }
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
            _this.data.can_not_open_form = data.can_not_open_form;
            let type = data["popup"];
            let isView = data["is_view"];
            if (type == 1) {
                _this.data.sonTableId = data["value"];
                if (isView == '0') {
                    _this.data.viewMode = 'EditChild';
                } else {
                    _this.data.viewMode = 'ViewChild';
                }
                PMAPI.openDialogByIframe(`/iframe/sourceDataGrid/?tableId=${_this.data.sonTableId}&parentTableId=${data.parent_table_id}&parentTempId=${data.temp_id}&rowId=${data.parent_temp_id}&tableType=child&viewMode=${_this.data.viewMode}`, {
                    width: 800,
                    height: 600,
                    title: `子表`,
                    modal: true
                }).then(data => {
                    if (_this.viewMode == 'EditChild') {
                        _this.actions.setCountData();
                    }
                })
            } else {
                _this.data.sonTableId = data["value"];
                if (isView == '0') {
                    _this.actions.setCountData();
                }
            }
            // 保存父表数据
            FormService.frontendParentFormValue[_this.tableId] = _this.actions.createFormValue(_this.data.data);
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
            PMAPI.openDialogByIframe(`/iframe/sourceDataGrid/?tableId=${data.value}&parentTableId=${data.tableId}&parentTempId=${data.temp_id}&recordId=${data.record_id}&viewMode=${this.data.viewMode}&showCorrespondenceSelect=true&correspondenceField=${data.dfield}`, {
                width: 1550,
                height: 600,
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
            //处理周期规则值回车符
            if (data.type == 'SettingTextarea') {
                for (let key in history) {
                    if (_.isObject(history[key]['new_value'])) {
                        history[key]['new_value'] = history[key]['new_value']['-1'].replace(/\n/g, ";");
                    }
                    if (_.isObject(history[key]['old_value'])) {
                        history[key]['old_value'] = history[key]['old_value']['-1'].replace(/\n/g, ";");
                    }
                }
            }
            //处理文本区回车符
            if (data.type == 'Textarea') {
                for (let key in history) {
                    history[key]['new_value'] = history[key]['new_value'].replace(/\n/g, ";");
                    history[key]['old_value'] = history[key]['old_value'].replace(/\n/g, ";");
                }
            }
            History.data.history_data = history;
            PMAPI.openDialogByComponent(History, {
                width: 800,
                height: 600,
                title: `${data.label}历史修改记录`,
                modal: true
            })
        },
        //动态创建组件
        createFormControl() {
            let _this = this;
            this.setData('childComponent', {});
            let data = this.data.data;
            this.setData('oldData', _.defaultsDeep({}, data));
            let actions = this.actions.createActions();
            for (let key in data) {
                let single = this.el.find('div[data-dfield=' + data[key].dfield + ']');
                let type = single.data('type');
                if (data[key].required) {
                    data[key]['requiredClass'] = data[key].value == '' ? 'required' : 'required2';
                }
                if (single.data('width')) {
                    data[key]['width'] = single.data('width') + 'px';
                } else {
                      data[key]['width'] = '240px';
                }
                //数据填充后，根据修改条件对不同框进行只读操作
                setTimeout(() => {
                    _this.actions.reviseCondition(data[key], data[key].value);
                }, 0);
                //在这里根据type创建各自的控件
                switch (type) {
                    case 'Correspondence':
                        data[key]['temp_id'] = data['temp_id']['value'];
                        let correspondence = new Correspondence(data[key], actions);
                        correspondence.render(single);
                        this.data.childComponent[data[key].dfield] = correspondence;
                        break;
                    case 'Songrid':
                        let popupType = single.data('popupType') || 0;
                        data[key]['temp_id'] = data['temp_id']['value'];
                        let songrid = new Songrid(Object.assign(data[key], {popupType: popupType}), actions);
                        songrid.render(single);
                        this.data.childComponent[data[key].dfield] = songrid;
                        break;
                    case 'Radio':
                        for (let obj of data[key].group) {
                            obj['name'] = data[key].dfield;
                            if (obj.value == data[key].value) {
                                obj['checked'] = true;
                            } else {
                                obj['checked'] = false;
                            }
                        }
                        let radio = new Radio(data[key], actions);
                        radio.render(single);
                        this.data.childComponent[data[key].dfield] = radio;
                        break;
                    case 'Input':
                        let input = new Input(data[key], actions);
                        input.render(single);
                        this.data.childComponent[data[key].dfield] = input;
                        break;
                    case 'Textarea':
                        let textArea = new TextArea(data[key], actions);
                        textArea.render(single);
                        this.data.childComponent[data[key].dfield] = textArea;
                        break;
                    case 'Readonly':
                        let readonly = new Readonly(data[key], actions);
                        readonly.render(single);
                        this.data.childComponent[data[key].dfield] = readonly;
                        break;
                    case 'EnctyptInput':
                        let password = new Password(data[key], actions);
                        password.render(single);
                        this.data.childComponent[data[key].dfield] = password;
                        break;
                    case 'Hidden':
                        let hidden = new Hidden(data[key]);
                        hidden.render(single);
                        this.data.childComponent[data[key].dfield] = hidden;
                        break;
                    case 'Select':
                        let selectControl = new SelectControl(data[key], actions);
                        selectControl.render(single);
                        this.data.childComponent[data[key].dfield] = selectControl;
                        break;
                    case 'Year':
                        let yearControl = new YearControl(data[key], actions);
                        yearControl.render(single);
                        this.data.childComponent[data[key].dfield] = yearControl;
                        break;
                    case 'Yearmonthtime':
                        let yearMonthControl = new YearMonthControl(data[key], actions);
                        yearMonthControl.render(single);
                        this.data.childComponent[data[key].dfield] = yearMonthControl;
                        break;
                    case 'Buildin':
                        let buildInControl = new BuildInControl(data[key], actions);
                        buildInControl.render(single);
                        this.data.childComponent[data[key].dfield] = buildInControl;
                        break;
                    case 'MultiLinkage':
                        let multiLinkageControl = new MultiLinkageControl(data[key], actions);
                        multiLinkageControl.render(single);
                        this.data.childComponent[data[key].dfield] = multiLinkageControl;
                        break;
                    case 'MultiSelect':
                        if (single.data('childData')) {
                            data[key].childData = single.data('childData');
                        }
                        if (single.data('selectType')) {
                            data[key].childData = single.data('selectType');
                        }
                        data[key].is_special = data[key].field_content['special_multi_choice'] == 1 ? true : false;
                        let multiSelectControl = new MultiSelectControl(data[key], actions);
                        multiSelectControl.render(single);
                        this.data.childComponent[data[key].dfield] = multiSelectControl;
                        break;
                    case 'Editor':
                        let editorControl = new EditorControl(data[key], actions);
                        editorControl.render(single);
                        this.data.childComponent[data[key].dfield] = editorControl;
                        break;
                    case 'SettingTextarea':
                        let settingTextareaControl = new SettingTextareaControl(data[key], actions);
                        settingTextareaControl.render(single);
                        this.data.childComponent[data[key].dfield] = settingTextareaControl;
                        break;
                    case 'Attachment':
                    case 'Picture':
                        let attachmentControl = new AttachmentControl(data[key], actions);
                        attachmentControl.render(single);
                        this.data.childComponent[data[key].dfield] = attachmentControl;
                        break;
                    case 'Time':
                        let timeControl = new TimeControl(data[key], actions);
                        timeControl.render(single);
                        this.data.childComponent[data[key].dfield] = timeControl;
                        break;
                    case 'Date':
                        let dateControl = new DateControl(data[key], actions);
                        dateControl.render(single);
                        this.data.childComponent[data[key].dfield] = dateControl;
                        break;
                    case 'Datetime':
                        let dateTimeControl = new DateTimeControl(data[key], actions);
                        dateTimeControl.render(single);
                        this.data.childComponent[data[key].dfield] = dateTimeControl;
                        break;
                    case 'editControl':
                        data[key]['real_id'] = data['real_id']['value'];
                        data[key]['table_id'] = data['table_id']['value'];
                        let contractControl = new ContractControl(data[key], actions);
                        contractControl.render(single);
                        this.data.childComponent[data[key].dfield] = contractControl;
                        break;
                }
            }
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
                    console.log()
                    if (_this.main_depart[j]["value"] === _this.value[i]) {
                        arr.push(_this.main_depart[j]);
                    }
                }
            }
            this.data.data[_this.department.dfield]["options"] = arr;
            this.data.childComponent[_this.department.dfield].data["options"] = arr;
            this.data.childComponent[_this.department.dfield].reload();
        },
    },
    afterRender() {
        this.actions.createFormControl();
        this.actions.checkCustomTable();
        this.actions.triggerControl();
        this.actions.changeOptions();
        this.actions.setDataFromParent();
        if (this.data.btnType != 'none') {
            this.actions.addBtn();
        }

        //默认表单样式
        if (this.el.find('table').hasClass('form-version-table-user') || this.el.find('table').hasClass('form-version-table-department') || this.el.find('table').hasClass('form-default')) {
            this.el.find('table').parents('.detail-form').css("background", "#F2F2F2");
        }
        //选择器、快捷添加内置字段、修改历史icon隐藏时位置右移
        let icon_selector = this.el.find(' .ui-selector').css('visibility');
        let icon_add = this.el.find(' .add-item').css('visibility');
        let icon_history = this.el.find(' .ui-history').css('visibility');

        if(icon_selector == 'hidden') {
            this.el.find(' .ui-selector').addClass('icon-fr')
        }
        if(icon_add == 'hidden') {
            this.el.find(' .add-item').addClass('icon-fr')
        }
        if(icon_history == 'hidden') {
            this.el.find(' .ui-history').addClass('icon-fr')
        }
    },
    beforeDestory() {
        this.el.off();
    }
}

class BaseForm extends Component {
    constructor(formData) {
        config.template = formData.template;
        //存父子表关系
        FormService.frontendRelation[formData.data.tableId] = formData.data["frontend_cal_parent_2_child"];
        //存父表的newData
        FormService.frontendParentNewData[formData.data.tableId] = formData.data.data;
        super(config, formData.data);
    }

}
export default BaseForm
