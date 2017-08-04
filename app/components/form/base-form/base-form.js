import Component from '../../../lib/component';
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
import {EditorControl} from '../editor-control/editor';
import Mediator from "../../../lib/mediator";
import {HTTP} from "../../../lib/http";
import {FormService} from "../../../services/formService/formService"
import MultiSelectControl from "../multi-select-control/multi-select-control";

let config = {
    template: '',
    data: {
        myUseFields: {},
        optionsToItem: {},
        flowId: '',
        baseIdsLocalDict: {},
    },
    childComponent: {},
    actions: {

        //检查是否是默认值的触发条件
        validDefault(originalData, val) {
            if (this.data.baseIdsLocal.indexOf(originalData["dfield"]) == -1) {
                this.baseIdsLocal.push(originalData["dfield"]);
            }
            this.data.baseIdsLocalDict[originalData["dfield"]] = val;
            if (this.data['base_fields'].sort().toString() == this.databaseIdsLocal.sort().toString()) {
                //告诉外围现在正在读取默认值
                // this.wfService.isReadDefaultData.next(true);
                //请求默认值
                let json = {
                    flow_id: this.data.flowId || "",
                    base_field_2_value: JSON.stringify(this.data.baseIdsLocalDict),
                    temp_id: this.data.temp_id["value"]
                };
                let res = FormService.getDefaultValue(json);
                for (let key in res["data"]) {

                    //排除例外字段
                    if (this.data['exclude_fields'].indexOf(key) == -1) {
                        if (this.data.data.hasOwnProperty(key)) {
                            let type = this.data[key]["type"];
                            let value = res["data"][key];
                            //如果是对应关系,传回来的是空串，那就不对它赋值
                            if (type == 'correspondence' && value == "") {
                                continue;
                            }
                            //如果是对应关系回显默认值
                            // if(type == 'correspondence' && value != ""){
                            //     this.wfService.correspondenceDefaultData.next( this.newData[key]['value'] );
                            // }
                            //如果是内联子表默认值
                            // if(type == 'songrid'){
                            //     this.wfService.songridDefaultData.next( this.newData[key]['value'] );
                            // }
                            //如果是多级内置
                            // if(type == 'multi-linkage'){
                            //     if(value.length != 0){
                            //         this.wfService.multiLinkageDefaultData.next( value );
                            //     }else{
                            //         this.wfService.multiLinkageDefaultData.next( 'none' );
                            //     }
                            // }
                            //如果是周期规则
                            if (type == 'datetime') {
                                value = value.replace(" ", "T");
                                this.setFormValue(key, value);
                            }
                            //如果是周期规则
                            if (type == 'setting-textarea') {
                                // this.globalService.loadSettingtextarea.next(value);
                            }
                            this.setFormValue(key, value);
                        }
                    }
                }
                //告诉外围现在正在读取默认值
                // this.wfService.isReadDefaultData.next(false);
            }
        },

        //改变控件的disabled
        changeControlDisabled: function (dfield) {

        },

        //替换表达式中的字段
        replaceSymbol(data) {
            let reg = /\@f\d+\@/g;
            let items = data.match(reg);
            let str_ = data.indexOf("\"else\"") != -1 ? ('\\\"') : ('\"');
            for (let item of items) {
                item = item.replace("@", "").replace("@", "");
                let v = this.data.data[item]['value'];
                let isUndefined = false;
                if (v == undefined) {
                    isUndefined = true;
                }
                let type = "";
                let dinput_type = "";
                if (this.data.data[item].hasOwnProperty("real_type")) {
                    type = this.data.data[item]["real_type"];
                }
                if (this.data.data[item].hasOwnProperty("dinput_type")) {
                    dinput_type = this.data.data[item]["dinput_type"];
                }
                if ([6, 7, 8, 30].indexOf(dinput_type) != -1) {
                    //枚举类型 or 各种内置
                    v = this.getTextByOptionID(item, this.data.data[item]['value']);
                }
                if ([10, 11, 26].indexOf(type) != -1) {
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
                if (5 == dinput_type) {
                    v = v.replace("T", " ");
                }
                data = data.replace("@" + item + "@", v);
            }
            data = data.replace(/\#/g, 'this.');
            return data;
        },

        set_value_for_form(result, f){
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
                    if ([10, 11, 26].indexOf(data["real_type"]) != -1) {
                        let reg = /^((-?\d+.?\d*)[Ee]{1}([+-]?\d+))$/;
                        if (reg.test(this.data.data[f].value)) {
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
                    if ([10, 11, 26].indexOf(data["real_type"]) != -1) {
                        let reg = /^((-?\d+.?\d*)[Ee]{1}([+-]?\d+))$/;
                        if (reg.test(data.value)) {
                            data.value = data.value + "(不支持科学计数法！无法保存！)"
                            this.actions.setFormValue(f, data.value);
                            return;
                        }
                        //浮点数数据溢出时（后台浮点数最大位数为11位，超过11位便会返回科学计数法）
                        else if (data["real_type"] == 10) {
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
            // this.actions.pluginForFields(f);
        },

        /**
         *  表达式主要方法
         *  此data结构为{val: 自身的value,effect: [] 被影响的dfield集合}
         */
        calcExpression(data) {
            let send_exps = [];
            for (let f of data["effect"]) {
                //如果这个字段存在的话，再进行下面的逻辑
                let expression;
                if (this.data.data.hasOwnProperty(f)) {
                    let expressionStr = this.data.data[f]["expression"];
                    let real_type = this.data.data[f]["real_type"];
                    if (expressionStr !== "") {
                        expression = this.actions.replaceSymbol(expressionStr);
                        try {
                            if (expression.indexOf("$^$") == -1) {
                                try {
                                    if (this.data[expressionStr.split("@")[1]]["is_view"] != 1) {
                                        this.actions.set_value_for_form(eval(expression), f);
                                    }
                                } catch (e) {
                                    send_exps.push({"f": f, "expression": expression, "real_type": real_type});
                                }
                            } else {
                                send_exps.push({"f": f, "expression": expression, "real_type": real_type});
                            }
                        } catch (e) {
                            console.error("没有解析成功，1,解析错误2，可能是没有此函数" + e);
                        }
                    }
                }
            }
            if (send_exps.length != 0) {
                let _this = this;
                FormService.get_exp_value(encodeURIComponent(JSON.stringify(send_exps))).then(res => {
                    for (let j in res['data']) {
                        _this.actions.set_value_for_form(res['data'][j], j);
                    }
                });
            }
        },

        //改变选择框的选项
        changeOptionOfSelect (data, l){
            let obj = {'select': 'options', 'radio': 'group', 'multi-select': 'options'};
            let linkage = l;
            let field = data['dfield'];
            let type = data['type'];
            for (let key in linkage) {
                let affectData = this.data[key];
                let affectType = affectData['type'];
                let arr = [];
                let srcOptions = this.optionsToItem[key];
                for (let op of srcOptions) {
                    if (linkage[key].indexOf(op.value) != -1) {
                        arr.push(op);
                    }
                }
                this.data[key][obj[affectType]] = arr;
                if (affectType == 'multi-select') {
                    this.data[key]['value'] = [];
                } else {
                    this.data[key]['value'] = '';
                }
                Mediator.publish('form:changeOption', this.data[key]['dfield']);
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
                        this.data.data[f]["required"] = this.childComponent[f].data['required'] = (i == andData[f].length) ? 1 : 0;
                        this.childComponent[f].reload();
                    }
                } else {
                    for (let dfield of editConditionDict["required_condition"][key]) {
                        if (arr.indexOf(dfield) != -1) {
                            continue;
                        }
                        this.data.data[dfield]["required"] = this.childComponent[dfield].data['required'] = (key == value) ? 1 : 0;
                        this.childComponent[dfield].reload();
                        if (key == value) {
                            arr.push(dfield);
                        }
                    }
                }
            }
        },

        //统计功能
        countFunc(dfield) {
            for (let key in this.data['use_fields']) {
                if (this.data['use_fields'][key].indexOf(dfield) != -1) {
                    if (!this.data.myUseFields[key]) {
                        this.data.myUseFields[key] = [];
                    }
                    if (this.data.myUseFields[key].indexOf(dfield) == -1) {
                        this.data.myUseFields[key].push(dfield);
                    }
                    if (this.data['use_fields'][key].sort().toString() == this.data.myUseFields[key].sort().toString()) {
                        let formValue = {};
                        for (let key in this.data.data) {
                            formValue[key] = this.data.data[key].value;
                        }
                        let _this = this;
                        FormService.getCountData({data: formValue}).then(res => {

                            console.log('res');
                            console.log(res);
                            for (let d in res["data"]) {
                                console.log('什么情况？')
                                _this.actions.setFormValue(d, res["data"][d]);
                            }
                        });
                        //给统计赋值
                    }
                }
            }
        },

        //必填性改变
        requiredChange: function (_this) {
            if (_this.data.value == '') {
                _this.el.find('#requiredLogo').get(0).className = 'required';
            } else {
                _this.el.find('#requiredLogo').get(0).className = 'required2';
            }
        },
        //赋值
        setFormValue(dfield, value){
            if (this.data.data[dfield]) {
                this.data.data[dfield]["value"] = value;
                console.log('value');
                console.log(value);
                this.childComponent[dfield].data["value"] = value;
                this.childComponent[dfield].destroyChildren();
                this.childComponent[dfield].reload();
            }
        },
        //给相关赋值
        async setAboutData(id, value) {
            // let res=await HTTP.postImmediately({
            //     url: 'http://127.0.0.1:8081/get_about_data/',
            //     data: {
            //         buildin_field_id: id,
            //         buildin_mongo_id: value
            //     }
            // })
            //
            FormService.getAboutData({
                buildin_field_id: id,
                buildin_mongo_id: value
            }).then(res => {
                //给相关的赋值
                for (let k in res["data"]) {
                    //如果是周期规则
                    if (this.data.data.hasOwnProperty(k) && this.data.data[k].hasOwnProperty("real_type") && this.data.data[k]["real_type"] == '27') {
                        if (res["data"][k]["-1"]) {
                            this.actions.setFormValue.bind(this)(k, res["data"][k]["-1"]);
                        }
                    } else {
                        this.actions.setFormValue.bind(this)(k, res["data"][k]);
                    }
                }
            })
        },

        //提交表单
        //提交表单数据
        onSubmit(newData, oldData){
            //数据初始化
            var new_data = {
                table_id: '',
                real_id: '',
                temp_id: '',
                parent_table_id: '',
                parent_real_id: '',
                parent_temp_id: '',
            };
            var old_data = {
                table_id: '',
                real_id: '',
                temp_id: '',
                parent_table_id: '',
                parent_real_id: '',
                parent_temp_id: '',
            };
            //数据获取
            for (let i in newData) {
                new_data[i] = newData[i].data.value;
                old_data[i] = oldData[i];
            }
            //数据转化成字符串
            new_data = JSON.stringify(new_data);
            old_data = JSON.stringify(old_data);
            //发送数据
            let postData = {
                data: new_data,
                cache_new: new_data,
                cache_old: old_data,
                focus_users: [],
                table_id: '123123',
                flow_id: '',
                parent_table_id: '',
                parent_real_id: '',
                parent_temp_id: '',
                parent_record_id: ''
            }
            console.log('*************')
            console.log('*************')
            console.log('*************')
            console.log('*************')
            console.log('传输的数据格式')
            console.log(postData)
        },

        //转到编辑模式
        changeToEdit(_this){
            let json = {
                tableId: '8696_yz7BRBJPyWnbud4s6ckU7e',
                real_id: '59803341ae6ba89d68ac574e',
                seqid: 'yudeping'
            }
            FormService.getDynamicData(json).then(res => {
                console.log('res');
                console.log(res);
                for (let key in _this.data.data) {
                    _this.data.data[key]['is_view'] = res['data'][key]['is_view'];
                    if (!_this.childComponent[key]) {
                        continue;
                    }
                    if (_this.childComponent[key].data.type == 'MultiLinkage') {
                        _this.childComponent[key].actions.changeView(_this.childComponent[key], res['data'][key]['is_view']);
                    }
                    console.log('is_view');
                    console.log(res['data'][key]['is_view']);
                    console.log(_this.childComponent[key]['data']['is_view']);
                    _this.childComponent[key]['data']['is_view'] = _this.data.data[key]['is_view'];
                    _this.childComponent[key].reload();
                }
                // for(let key in this.childComponent){
                //     if(this.childComponent[key].data.type!='Readonly'){
                //         this.childComponent[key].data.is_view='1';
                //         if(this.childComponent[key].data.type=='MultiLinkage'){
                //             this.childComponent[key].actions.changeView(this.childComponent[key]);
                //         }
                //         this.childComponent[key].reload();
                //     }
                // }
            });
        },

        reviseCondition: function (editConditionDict, value, _this) {
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
                        _this.data.data[f]["is_view"] = ( i == andData[f].length ) ? 0 : 1;
                        _this.actions.changeControlDisabled(f);
                        _this.childComponent[f].data = _this.data.data[f];
                        _this.childComponent[f].reload();
                    }
                } else {
                    for (let dfield of editConditionDict["edit_condition"][key]) {
                        if (arr.indexOf(dfield) != -1) {
                            continue;
                        }
                        //如果有字段的负责性，再开始下面的逻辑
                        let data = _this.data.data[dfield];
                        if (_this.data.data[dfield]["required_perm"] == 1) {
                            let data = _this.data.data[dfield];
                            //针对多选下拉框，只要包含就可以
                            if (value instanceof Array) {
                                data["be_control_condition"] = value.indexOf(key) != -1 ? 0 : 1;
                                _this.actions.changeControlDisabled(dfield);
                            } else {
                                data["be_control_condition"] = (key == value) ? 0 : 1;
                                console.log('怎么没改呢');
                                console.log(data["be_control_condition"]);
                                _this.actions.changeControlDisabled(dfield);
                            }
                            if (data["is_view"] == 0) {
                                arr.push(dfield);
                            }
                        }
                        _this.childComponent[dfield].data = data;
                        _this.childComponent[dfield].reload();
                    }
                }
            }
        }
    },
    firstAfterRender: function () {
        let _this = this;
        let cache_old = {};
        this.set('childComponent', {});
        let data = _this.data.data;
        for (let key in data) {
            let single = _this.el.find('div[data-dfield=' + data[key].dfield + ']');
            let type = single.data('type');
            if (data[key].required) {
                data[key]['requiredClass'] = data[key].value == '' ? 'required' : 'required2';
            }
            cache_old[data[key].dfield] = data[key].value;
            setTimeout(() => {
                _this.actions.reviseCondition(data[key], data[key].value, _this);
            }, 0);
            // if(type == 'Select' || type=='Buildin' ){
            //     if(data[key].value){
            //         for(let obj of data[key].options){
            //             if(obj.value == data[key].value){
            //                 data[key]['showValue']=obj.label;
            //                 break;
            //             }
            //         }
            //     }
            // }
            //在这里根据type创建各自的控件
            switch (type) {
                case 'Radio':
                    console.log('group');
                    console.log(data[key].group);
                    for (let obj of data[key].group) {
                        obj['name'] = data[key].dfield;
                        if (obj.value == data.value) {
                            obj['checked'] = true;
                        } else {
                            obj['checked'] = false;
                        }
                    }
                    let radio = new Radio(data[key]);
                    radio.render(single);
                    _this.childComponent[data[key].dfield] = radio;
                    break;
                case 'Input':
                    let input = new Input(data[key]);
                    input.render(single);
                    _this.childComponent[data[key].dfield] = input;
                    break;
                case 'Textarea':
                    let textArea = new TextArea(data[key]);
                    textArea.render(single);
                    _this.childComponent[data[key].dfield] = textArea;
                    break;
                case 'Readonly':
                    let readonly = new Readonly(data[key]);
                    readonly.render(single);
                    _this.childComponent[data[key].dfield] = readonly;
                    break;
                case 'password':
                    let password = new Password(data[key]);
                    password.render(single);
                    _this.childComponent[data[key].dfield] = password;
                    break;
                case 'Hidden':
                    let hidden = new Hidden(data[key]);
                    hidden.render(single);
                    _this.childComponent[data[key].dfield] = hidden;
                    break;
                case 'Select':
                    let selectControl = new SelectControl(data[key]);
                    selectControl.render(single);
                    _this.childComponent[data[key].dfield] = selectControl;
                    break;
                case 'Year':
                    let yearControl = new YearControl(data[key]);
                    yearControl.render(single);
                    _this.childComponent[data[key].dfield] = yearControl;
                    break;
                case 'YearMonthControl':
                    let yearMonthControl = new YearMonthControl(data[key]);
                    yearMonthControl.render(single);
                    _this.childComponent[data[key].dfield] = yearMonthControl;
                    break;
                case 'Buildin':
                    let buildInControl = new BuildInControl(data[key]);
                    buildInControl.render(single);
                    _this.childComponent[data[key].dfield] = buildInControl;
                    break;
                case 'MultiLinkage':
                    let multiLinkageControl = new MultiLinkageControl(data[key]);
                    multiLinkageControl.render(single);
                    _this.childComponent[data[key].dfield] = multiLinkageControl;
                    break;
                case 'MultiSelect':
                    let multiSelectControl = new MultiSelectControl(data[key]);
                    multiSelectControl.render(single);
                    _this.childComponent[data[key].dfield] = multiSelectControl;
                    break;
                case 'Editor':
                    let control = new EditorControl(data[key]);
                    control.render(single);
                    _this.childComponent[data[key].dfield] = control;
            }
        }

        $('body').on('click.selectDrop', function () {
            $('.select-drop').hide();
        })
        Mediator.subscribe('form:changeValue', function (data) {
            console.log('form:changeValue')
            console.log(data);
            _this.data.data[data.dfield] = data;

            if (data.type == 'Buildin') {
                let id = data["id"];
                let value = data["value"];
                _this.actions.setAboutData(id, value);
            }

            //检查是否是默认值的触发条件
            // if(this.flowId != "" && this.data.baseIds.indexOf(data["dfield"]) != -1 && !isTrigger) {
            if (_this.data.flowId != "" && _this.data['base_fields'].indexOf(data["dfield"]) != -1) {
                _this.actions.validDefault(data, data['value']);
            }
            //统计功能
            _this.actions.countFunc(data.dfield);

            //改变选择框的选项
            if (data['linkage'] != {}) {
                let j = 0;
                let arr = [];
                for (let value in data['linkage']) {
                    for (let k in data['linkage'][value]) {
                        arr.push(k);
                    }
                    if (value == val) {
                        j++;
                        //改变选择框的选项
                        _this.changeOptionOfSelect(originalData, originalData['linkage'][value]);
                    }
                }
                if (j == 0) {
                    let obj = {'select': 'options', 'radio': 'group', 'multi-select': 'options'};
                    for (let field of arr) {
                        _this.data[field][obj[_this.data[field]['type']]] = _this.optionsToItem[field];
                    }
                }
            }

            //修改负责
            if (data["edit_condition"] && data["edit_condition"] !== "") {
                setTimeout(() => {
                    _this.actions.reviseCondition(data, data.value, _this);
                }, 0);
            }

            //修改必填性功能
            if (data["required_condition"] && data["required_condition"] !== "") {
                _this.actions.requiredCondition(data, data['value']);
            }

            let calcData = {
                val: data['value'],
                effect: data["effect"]
            };
            _this.actions.calcExpression(calcData, data['value']);
            if (data.required) {
                _this.actions.requiredChange(_this.childComponent[data.dfield]);
            }
            $('.select-drop').hide();
        })

        //添加提交按钮
        _this.el.append('<div style="position: fixed;bottom: 20px;right: 20px;"><button id="save">提交</button><button id="changeEdit">转到编辑模式</button></div>')

        //提交按钮事件绑定
        _this.el.on('click', '#save', function () {
            console.log('提交不好使了?');
            _this.actions.onSubmit(_this.childComponent, cache_old);
        })
        $(_this.el).find("#changeEdit").on('click', function () {
            _this.actions.changeToEdit(_this);
        })
    },
    beforeDestory: function () {
        $('body').off('.selectDrop');
    }
}
class BaseForm extends Component {
    constructor(formData) {
        config.template = formData.template;
        console.log('#######')
        console.log(formData);
        console.log('#######');
        config.data['temp_id'] = formData.data.data['temp_id'] || '';
        config.data['real_id'] = formData.data.data['real_id'] || '';
        config.data['table_id'] = formData.data.data['table_id'] || '';
        config.data['parentRealId'] = formData.data.data["real_id"]["value"] || '';
        config.data['parentTableId'] = formData.data.data["table_id"]["value"] || '';
        config.data['parentTempId'] = formData.data.data["temp_id"]["value"] || '';
        config.data['recordId'] = formData.data['record_info']['id'] || '';
        //默认值
        // config.data['baseIds']=formData.data['base_fields'];
        //默认值例外
        // config.data['excludeIds']=formData.data['exclude_fields'];
        //统计
        // config.data['useFields']=formData.data['use_fields'];
        //字段插件配置
        // config.data['pluginFields']=formData.data['plugin_fields'];
        //form_id
        // config.data['formId']=formData.data['form_id'];
        //部门节点
        // config.data['main_departments']=formData.data['main_departments'];
        //table_id
        // config.data['tableId']=formData.data["table_id"]["value"];
        //存父子表关系
        // this.globalService.frontendRelation[this.tableId] = res["frontend_cal_parent_2_child"];
        //存父表的newData
        // this.globalService.frontendParentNewData[this.tableId] = this.newData;
        //用于前端填充数据用的子表的parentTableId
        // config.data['frontendParentTableId']=formData.data['parent_table_id'];
        super(config, formData.data);
        console.log('处理完的数据');
        console.log(this);
    }

}
export default BaseForm