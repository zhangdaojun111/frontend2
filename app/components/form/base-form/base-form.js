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
import Mediator from "../../../lib/mediator";
import {HTTP} from "../../../lib/http";
import {FormService} from "../../../services/formService/formService"

let config={
    template:'',
    data:{},
    childComponent:{},
    actions:{

        //检查是否是默认值的触发条件
        validDefault(originalData,val) {
            if(this.baseIdsLocal.indexOf(originalData["dfield"]) == -1){
                this.baseIdsLocal.push(originalData["dfield"]);
            }
            this.baseIdsLocalDict[originalData["dfield"]] = val;
            if(this.baseIds.sort().toString() == this.baseIdsLocal.sort().toString()){
                //告诉外围现在正在读取默认值
                // this.wfService.isReadDefaultData.next(true);
                //请求默认值
                let json = {
                    flow_id: this.flowId || "",
                    base_field_2_value: JSON.stringify(this.baseIdsLocalDict),
                    temp_id: this.temp_id["value"]
                };
                let res=FormService.getDefaultValue(json);
                for(let key in res["data"]) {
                    //排除例外字段
                    if(this.data.excludeIds.indexOf(key) == -1){
                        if(this.data.hasOwnProperty(key)){
                            let type = this.data[key]["type"];
                            let value = res["data"][key];
                            //如果是对应关系,传回来的是空串，那就不对它赋值
                            if(type == 'correspondence' && value == ""){
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
                            if(type == 'datetime') {
                                value = value.replace(" ","T");
                                this.setFormValue(key,value);
                            }
                            //如果是周期规则
                            if(type == 'setting-textarea') {
                                // this.globalService.loadSettingtextarea.next(value);
                            }
                            this.setFormValue(key,value);
                        }
                    }
                }
                    //告诉外围现在正在读取默认值
                    // this.wfService.isReadDefaultData.next(false);
            }
        },

        //改变控件的disabled
        changeControlDisabled:function(dfield){

        },

        //替换表达式中的字段
        replaceSymbol(data) {
            let reg = /\@f\d+\@/g;
            let items = data.match(reg);
            let str_ = data.indexOf("\"else\"")!=-1?('\\\"'):('\"');
            for(let item of items) {
                item = item.replace("@", "").replace("@", "");
                //**************
                //**************
                //**************
                let v = this.data[item]['value'];
                let isUndefined=false;
                if(v == undefined){
                    isUndefined=true;
                }
                let type = "";
                let dinput_type = "";
                if(this.data[item].hasOwnProperty("real_type")) {
                    type = this.data[item]["real_type"];
                }
                if(this.data[item].hasOwnProperty("dinput_type")) {
                    dinput_type = this.data[item]["dinput_type"];
                }
                if([6,7,8,30].indexOf(dinput_type) != -1) {
                    //枚举类型 or 各种内置
                    //**************
                    //**************
                    //**************
                    v = this.getTextByOptionID(item,this.data[item]['value']);
                }
                if([10,11,26].indexOf(type) != -1) {
                    //整数或者小数
                    v = v === ""  ? 0 : v;
                }else {
                    v = (v === "") ? (str_+str_) : (str_+v+str_);
                }
                if(isUndefined){
                    data = data.replace("@"+item+"@",'\\\"\\\"');
                }else{
                    data = data.replace("@"+item+"@",v);
                }
                if(5 == dinput_type) {
                    v = v.replace("T"," ");
                }
                data = data.replace("@"+item+"@",v);
            }
            data = data.replace(/\#/g,'this.');
            return data;
        },

        set_value_for_form(result, f){
            if(typeof result === 'string' ){
                //条件表达式赋值
                this.actions.setFormValue(f,result);
            }else if(isNaN(result) || !isFinite(result) ){
                //容错
                this.actions.setFormValue(f,"");
            }else{
                //如果是整数
                if(this.data[f]["real_type"] == 11) {
                    this.actions.setFormValue(f,result);
                }else {
                    if([10,11,26].indexOf(this.data[f]["real_type"]) != -1){
                        let reg = /^((-?\d+.?\d*)[Ee]{1}([+-]?\d+))$/;
                        if(reg.test(this.data[f].value)){
                            this.data[f].value = this.data[f].value + "(不支持科学计数法！无法保存！)"
                            this.actions.setFormValue(f,this.data[f].value);
                            return;
                        }
                    }
                    //如果是浮点数
                    //数据处理（如果数据已经限定了小数位数，如果不满足，四舍五入让其满足）
                    let accuracy = this.data[f]["accuracy"];
                    result = result.toFixed(accuracy);
                    this.actions.setFormValue(f,result);

                    //数据溢出出现科学计数法时
                    if([10,11,26].indexOf(this.data[f]["real_type"]) != -1){
                        let reg = /^((-?\d+.?\d*)[Ee]{1}([+-]?\d+))$/;
                        if(reg.test(this.data[f].value)){
                            this.data[f].value = this.data[f].value + "(不支持科学计数法！无法保存！)"
                            this.actions.setFormValue(f,this.data[f].value);
                            return;
                        }
                        //浮点数数据溢出时（后台浮点数最大位数为11位，超过11位便会返回科学计数法）
                        else if(this.data[f]["real_type"] == 10){
                            if(result >= 100000000000) {
                                if(this.data[f].value.indexOf("(") == -1){
                                    this.data[f].value = this.data[f].value + "(小数不能超过12位！无法保存！)"
                                    this.actions.setFormValue(f, this.data[f].value);
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
            for(let f of data["effect"]) {
                //如果这个字段存在的话，再进行下面的逻辑
                let expression;
                if(this.data.hasOwnProperty(f)) {
                    let expressionStr = this.data[f]["expression"];
                    let real_type = this.data[f]["real_type"];
                    if(expressionStr !== ""){
                        expression = this.actions.replaceSymbol(expressionStr);
                        try {
                            if (expression.indexOf("$^$")==-1){
                                try {
                                    if(this.data[expressionStr.split("@")[1]]["is_view"] != 1){
                                        this.actions.set_value_for_form(eval(expression), f);
                                    }
                                } catch (e) {
                                    send_exps.push({"f": f, "expression": expression,"real_type":real_type});
                                }
                            }else{
                                send_exps.push({"f": f, "expression": expression,"real_type":real_type});
                            }
                        } catch (e) {
                            console.error("没有解析成功，1,解析错误2，可能是没有此函数"+e);
                        }
                    }
                }
            }
            if (send_exps.length!=0) {
                let res=FormService.get_exp_value(encodeURIComponent(JSON.stringify(send_exps)))
                for (let j in res){
                    this.actions.set_value_for_form(res[j], j);
                }
            }
        },

        //改变选择框的选项
        changeOptionOfSelect ( data,l ){
            let obj = {'select':'options','radio':'group','multi-select':'options'};
            let linkage = l;
            let field = data['dfield'];
            let type = data['type'];
            for( let key in linkage ){
                let affectData = this.data[key];
                let affectType = affectData['type'];
                let arr = [];
                let srcOptions = this.optionsToItem[key];
                for( let op of srcOptions ){
                    if( linkage[key].indexOf( op.value )!=-1 ){
                        arr.push( op );
                    }
                }
                this.data[key][obj[affectType]] = arr;
                if( affectType == 'multi-select' ){
                    this.data[key]['value'] = [];
                }else {
                    this.data[key]['value'] = '';
                }
                Mediator.publish('form:changeOption',this.data[key]['dfield'] );
            }
        },

        //修改必填性功能
        requiredCondition(editConditionDict,value) {
            let arr = [];
            for(let key in editConditionDict["required_condition"]){
                if( key == 'and' ){
                    let andData = editConditionDict["required_condition"][key];
                    for( let f in andData  ){
                        let i = 0;
                        for( let d of andData[f] ){
                            for( let b of value ){
                                if( d == b ){
                                    i++;
                                }
                            }
                        }
                        this.data[f]["required"] = (i == andData[f].length) ? true : false;
                        this.childComponent[f].reload();
                    }
                }else {
                    for(let dfield of editConditionDict["required_condition"][key]) {
                        if( arr.indexOf( dfield ) != -1 ){
                            continue;
                        }
                        this.data[dfield]["required"] = (key == value) ? true : false;
                        this.childComponent[f].reload();
                        if( key == value ){
                            arr.push( dfield );
                        }
                    }
                }
            }
        },

        //统计功能
        countFunc(dfield) {
            for(let key in this.data.useFields) {
                if(this.data.useFields[key].indexOf(dfield) != -1) {
                    if(!this.myUseFields[key]){
                        this.myUseFields[key] = [];
                    }
                    if(this.myUseFields[key].indexOf(dfield) == -1){
                        this.myUseFields[key].push(dfield);
                    }
                    if(this.data.useFields[key].sort().toString() == this.myUseFields[key].sort().toString()) {
                        let res=FormService.getCountData(this.data.data);
                            //给统计赋值
                            for(let d in res["data"]){
                                this.setFormValue(d,res["data"][d]);
                            }
                    }
                }
            }
        },

        //必填性改变
        requiredChange:function(_this){
            if(_this.data.value=='' || _this.data.value.length==0 || _this.data.value==null){
                _this.el.find('#requiredLogo').get(0).className='required';
            }else{
                _this.el.find('#requiredLogo').get(0).className='required2';
            }
        },
        //赋值
        setFormValue(dfield,value){
            if(this.data.data[dfield]){
                this.data.data[dfield]["value"] = value[0];
                this.childComponent[dfield].data["value"]=value[0];
                this.childComponent[dfield].reload();
            }
        },
        //给相关赋值
        async setAboutData(id,value) {
                let res=await HTTP.postImmediately({
                    url: 'http://127.0.0.1:8081/get_about_data/',
                    data: {
                        buildin_field_id: id,
                        buildin_mongo_id: value
                    }
                })
                console.log(res);
                //给相关的赋值
                for(let k in res["data"]){
                    //如果是周期规则
                    if(this.data.data.hasOwnProperty(k) && this.data.data[k].hasOwnProperty("real_type") && this.data.data[k]["real_type"] == '27') {
                        if(res["data"][k]["-1"]){
                            this.actions.setFormValue.bind(this)(k,res["data"][k]["-1"]);
                        }
                    }else{
                        this.actions.setFormValue.bind(this)(k,res["data"][k]);
                    }
                }
        },
        reviseCondition:function(editConditionDict,value) {
        // if(this.dfService.isView){return false;}
        let arr = [];
        for(let key in editConditionDict["edit_condition"]){
            if( key == 'and' ){
                let andData = editConditionDict["edit_condition"][key];
                for( let f in andData  ){
                    let i = 0;
                    for( let d of andData[f] ){
                        for( let b of value ){
                            if( d == b ){
                                i++;
                            }
                        }
                    }
                    this.data.data[f]["is_view"] = ( i == andData[f].length )? 0 : 1;
                    this.actions.changeControlDisabled(f);
                    // this.form.controls[f].updateValueAndValidity();
                }
            }else {
                for(let dfield of editConditionDict["edit_condition"][key]) {
                    if( arr.indexOf( dfield ) != -1 ){
                        continue;
                    }
                    //如果有字段的负责性，再开始下面的逻辑
                    let data=this.data.data[dfield];
                    if(this.data.data[dfield]["required_perm"] == 1){
                        let data=this.data.data[dfield];
                        //针对多选下拉框，只要包含就可以
                        if(value instanceof Array){
                            data["be_control_condition"] = value.indexOf(key) != -1 ? 0 : 1;
                            this.actions.changeControlDisabled(dfield);
                            console.log('1111');
                            console.log('是这里么');
                            // this.form.controls[dfield].updateValueAndValidity();
                        }else{
                            console.log('那应该进这里啊');
                            data["be_control_condition"] = (key == value) ? 0 : 1;
                            console.log('怎么没改呢');
                            console.log(data["be_control_condition"]);
                            this.actions.changeControlDisabled(dfield);
                            // this.form.controls[dfield].updateValueAndValidity();
                        }
                        if( data["is_view"] == 0 ){
                            arr.push( dfield );
                        }
                    }
                    this.childComponent[dfield].data=data;
                    this.childComponent[dfield].reload();
                }
            }
        }
    }
    },
    firstAfterRender:function(){
        let _this=this;
        let cache_old = {};
        this.set('childComponent',{});
        this.set('myUseFields',{});
        this.set('optionsToItem',{});
        this.set('flowId','');
        this.set('baseIdsLocalDict',{});
        let data=_this.data.data;
        for(let key in data){
            let single=_this.el.find('div[data-dfield='+data[key].dfield+']');
            let type=single.data('type');
            if(data[key].required){
                data[key]['requiredClass']=data[key].value==''?'required':'required2';
            }
            cache_old[data[key].dfield] = data[key].value;
            _this.actions.reviseCondition(data[key],data[key].value);
            if(type == 'Select' || type=='Buildin' ){
                if(data[key].value){
                    for(let obj of data[key].options){
                        if(obj.value == data[key].value){
                            data[key]['showValue']=obj.label;
                            break;
                        }
                    }
                }
            }
            //在这里根据type创建各自的控件
            switch (type){
                case 'Radio':
                    console.log('group');
                    console.log(data[key].group);
                    for(let obj of data[key].group){
                        obj['name']=data[key].dfield;
                    }
                    let radio=new Radio(data[key]);
                    radio.render(single);
                    _this.childComponent[data[key].dfield]=radio;
                    break;
                case 'input':
                    let input=new Input(data[key]);
                    input.render(single);
                    _this.childComponent[data[key].dfield]=input;
                    break;
                case 'textarea':
                    let textArea=new TextArea(data[key]);
                    textArea.render(single);
                    _this.childComponent[data[key].dfield]=textArea;
                    break;
                case 'readonly':
                    let readonly=new Readonly(data[key]);
                    readonly.render(single);
                    _this.childComponent[data[key].dfield]=readonly;
                    break;
                case 'password':
                    let password=new Password(data[key]);
                    password.render(single);
                    _this.childComponent[data[key].dfield]=password;
                    break;
                case 'hidden':
                    let hidden=new Hidden(data[key]);
                    hidden.render(single);
                    _this.childComponent[data[key].dfield]=hidden;
                    break;
                case 'Select':
                    let selectControl=new SelectControl(data[key]);
                    selectControl.render(single);
                    _this.childComponent[data[key].dfield]=selectControl;
                    break;
                case 'Year':
                    let yearControl = new YearControl(data[key]);
                    yearControl.render(single);
                    _this.childComponent[data[key].dfield]=yearControl;
                    break;
                case 'YearMonthControl':
                    let yearMonthControl = new YearMonthControl(data[key]);
                    yearMonthControl.render(single);
                    _this.childComponent[data[key].dfield]=yearMonthControl;
                    break;
                case 'Buildin':
                    let buildInControl = new BuildInControl(data[key]);
                    buildInControl.render(single);
                    _this.childComponent[data[key].dfield]=buildInControl;
                    break;
                case 'MultiLinkage':
                    let multiLinkageControl = new MultiLinkageControl(data[key]);
                    multiLinkageControl.render(single);
                    _this.childComponent[data[key].dfield]=multiLinkageControl;
                    break;
            }
        }

        $('body').on('click.selectDrop',function(){
            $('.select-drop').hide();
        })
        Mediator.subscribe('form:changeValue',function(data){
            console.log('form:changeValue')
            console.log(data);

            if(data.type=='Buildin'){
                let id = data["id"];
                let value = data["value"];
                _this.actions.setAboutData(id,value);
            }

            //检查是否是默认值的触发条件
            // if(this.flowId != "" && this.data.baseIds.indexOf(data["dfield"]) != -1 && !isTrigger) {
            if(this.flowId != "" && this.data.baseIds.indexOf(data["dfield"]) != -1) {
                this.actions.validDefault(data, data['value']);
            }
            //统计功能
            this.actions.countFunc(data.dfield);

            //改变选择框的选项
            if( data['linkage']!={} ){
                let j = 0;
                let arr = [];
                for( let value in data['linkage'] ){
                    for( let k in data['linkage'][value] ){
                        arr.push( k );
                    }
                    if( value == val ){
                        j++;
                        //改变选择框的选项
                        this.changeOptionOfSelect( originalData,originalData['linkage'][value] );
                    }
                }
                if( j == 0 ){
                    let obj = {'select':'options','radio':'group','multi-select':'options'};
                    for( let field of arr ){
                        this.data[field][obj[this.data[field]['type']]] = this.optionsToItem[field];
                    }
                }
            }

            //修改负责
            if(data["edit_condition"] && data["edit_condition"] !== "") {
                _this.actions.reviseCondition(data,data.value);
            }

            //修改必填性功能
            if(data["required_condition"] && data["required_condition"] !== "") {
                _this.actions.requiredCondition(data,val);
            }

            let calcData = {
                val: val,
                effect: data["effect"]
            };
            _this.actions.calcExpression(calcData,data['value']);
            _this.actions.requiredChange(_this.childComponent[data.dfield]);
            $('.select-drop').hide();
        })

        //添加提交按钮
        _this.el.append('<div style="position: fixed;bottom: 20px;right: 20px;"><button id="save">提交</button><button id="changeEdit">转到编辑模式</button></div>')

        //提交按钮事件绑定
        $(_this.el).find("#save").on('click',function () {
            _this.onSubmit(_this.childComponent,cache_old);
        })
        $(_this.el).find("#changeEdit").on('click',function () {
            for(let key in _this.childComponent){
                if(_this.childComponent[key].data.type!='Readonly'){
                    _this.childComponent[key].data.is_view='1';
                    if(_this.childComponent[key].data.type=='MultiLinkage'){
                        _this.childComponent[key].actions.changeView(_this.childComponent[key]);
                    }
                    _this.childComponent[key].reload();
                }
            }
        })
    },
    beforeDestory:function(){
        $('body').off('.selectDrop');
    }
}
class BaseForm extends Component{
    constructor(formData){
        config.template=formData.template;
        config.data=formData.data;
        console.log('#######')
        console.log(formData);
        console.log('#######')
        super(config);
    }
    //提交表单数据
    onSubmit(newData,oldData){
        //数据初始化
        var new_data = {
            table_id:'',
            real_id:'',
            temp_id:'',
            parent_table_id:'',
            parent_real_id:'',
            parent_temp_id:'',
        };
        var old_data = {
            table_id:'',
            real_id:'',
            temp_id:'',
            parent_table_id:'',
            parent_real_id:'',
            parent_temp_id:'',
        };
        //数据获取
        for(let i in newData){
            new_data[i] = newData[i].data.value;
            old_data[i] = oldData[i];
        }
        //数据转化成字符串
        new_data = JSON.stringify(new_data);
        old_data = JSON.stringify(old_data);
        //发送数据
        let postData = {
            data:new_data,
            cache_new:new_data,
            cache_old:old_data,
            focus_users:[],
            table_id:'123123',
            flow_id:'',
            parent_table_id:'',
            parent_real_id:'',
            parent_temp_id:'',
            parent_record_id:''
        }
        console.log(postData)
    }
}
export default BaseForm