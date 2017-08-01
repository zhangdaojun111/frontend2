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

let config={
    template:'',
    data:{},
    childComponent:{},
    actions:{
        //改变控件的disabled
        changeControlDisabled:function(dfield){

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
        reviseCondition:function(editConditionDict,value,isInit) {
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
                            // this.form.controls[dfield].updateValueAndValidity();
                        }else{
                            data["be_control_condition"] = (key == value) ? 0 : 1;
                            this.actions.changeControlDisabled(dfield);
                            // this.form.controls[dfield].updateValueAndValidity();
                        }
                        if( data["is_view"] == 0 ){
                            arr.push( dfield );
                        }
                    }
                    if(data["be_control_condition"] == 0 && !isInit){
                        this.childComponent[dfield].data=data;
                        this.childComponent[dfield].reload();
                    }
                }
            }
        }
    }
    },
    firstAfterRender:function(){
        let _this=this;
        let cache_old = {};
        this.set('childComponent',{});
        let data=_this.data.data;
        for(let key in data){
            let single=_this.el.find('div[data-dfield='+data[key].dfield+']');
            let type=single.data('type');
            if(data[key].required){
                data[key]['requiredClass']=data[key].value==''?'required':'required2';
            }
            cache_old[data[key].dfield] = data[key].value;
            _this.actions.reviseCondition(data[key],data[key].value,true);
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
                case 'radio':
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
            if(data["edit_condition"] && data["edit_condition"] !== "") {
                _this.actions.reviseCondition(data,data.value,false);
            }
            if(data.value=='' || data.value.length==0 || data.value==null){
                _this.childComponent[data.dfield].data['requiredClass']='required';
            }else{
                _this.childComponent[data.dfield].data['requiredClass']='required2';
            }
            _this.childComponent[data.dfield].reload();
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