import Component from '../../../lib/component';
import './base-form.scss';
import TextArea from '../textarea-control/textarea-area'
import Radio from '../radio-control/radio-control';
import Input from '../input-control/input-control';
import SelectControl from "../select-control/select-control";
import YearControl from "../year-control/year-control";
import BuildInControl from "../buildIn-control/buildIn-control";
import MultiLinkageControl from "../multi-linkage-control/multi-linkage-control";
import Mediator from "../../../lib/mediator";

let config={
    template:'',
    data:{},
    childComponent:{},
    actions:{
        //改变控件的disabled
        changeControlDisabled:function(dfield){

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
                    _this.data[f]["is_view"] = ( i == andData[f].length )? 0 : 1;
                    _this.actions.changeControlDisabled(f);
                    // this.form.controls[f].updateValueAndValidity();
                }
            }else {
                for(let dfield of editConditionDict["edit_condition"][key]) {
                    if( arr.indexOf( dfield ) != -1 ){
                        continue;
                    }
                    //如果有字段的负责性，再开始下面的逻辑
                    if(_this.data[dfield]["required_perm"] == 1){
                        //针对多选下拉框，只要包含就可以
                        if(value instanceof Array){
                            _this.data[dfield]["be_control_condition"] = value.indexOf(key) != -1 ? 0 : 1;
                            _this.actions.changeControlDisabled(dfield);
                            // this.form.controls[dfield].updateValueAndValidity();
                        }else{
                            _this.data[dfield]["be_control_condition"] = (key == value) ? 0 : 1;
                            _this.actions.changeControlDisabled(dfield);
                            // this.form.controls[dfield].updateValueAndValidity();
                        }
                        if( _this.data[dfield]["is_view"] == 0 ){
                            arr.push( dfield );
                        }
                    }
                }
            }
            if(_this.data[dfield]["be_control_condition"] == 1 && !isInit){
                _this.childComponent[dfield].data=_this.data[dfield];
                _this.childComponent[dfield].reload();
            }
        }
    }
        // init:function(){
        //     let _this=this;
        //     console.log(_this.el);
        //     for(let data of _this.data.data){
        //         console.log(data.dfield);
        //         let single=_this.el.find('div[data-dfield='+data.dfield+']');
        //         let type=single.data('type');
        //         console.log('*********')
        //         console.log('*********')
        //         console.log('*********')
        //         console.log(type);
        //         //在这里根据type创建各自的控件
        //         switch (type){
        //             case 'radio':
        //                 let radio=new Radio(data);
        //                 radio.render(single);
        //                 _this.childComponent[data.dfield]=radio;
        //                 break;
        //             case 'input':
        //                 let input=new Input(data);
        //                 input.render(single);
        //                 _this.childComponent[data.dfield]=input;
        //                 break;
        //             case 'textarea':
        //                 let textArea=new TextArea(data);
        //                 textArea.render(single);
        //                 _this.childComponent[data.dfield]=textArea;
        //                 break;
        //         }
        //     }
        // }
    },
    firstAfterRender:function(){
        let _this=this;
        let cache_old = {};
        this.set('childComponent',{});
        for(let data of _this.data.data){
            let single=_this.el.find('div[data-dfield='+data.dfield+']');
            let type=single.data('type');
            if(data.required){
                data['requiredClass']=data.value==''?'required':'required2';
            }
            cache_old[data.dfield] = data.value;
            _this.actions.reviseCondition(data.dfield,data.value,true);
            //在这里根据type创建各自的控件
            switch (type){
                case 'radio':
                    let radio=new Radio(data);
                    radio.render(single);
                    _this.childComponent[data.dfield]=radio;
                    break;
                case 'input':
                    let input=new Input(data);
                    input.render(single);
                    _this.childComponent[data.dfield]=input;
                    break;
                case 'textarea':
                    let textArea=new TextArea(data);
                    textArea.render(single);
                    _this.childComponent[data.dfield]=textArea;
                    break;
                case 'Select':
                    let selectControl=new SelectControl(data);
                    selectControl.render(single);
                    _this.childComponent[data.dfield]=selectControl;
                    break;
                case 'Year':
                    let yearControl = new YearControl(data);
                    yearControl.render(single);
                    _this.childComponent[data.dfield]=yearControl;

                    break;
                case 'Buildin':
                    let buildInControl = new BuildInControl(data);
                    buildInControl.render(single);
                    _this.childComponent[data.dfield]=buildInControl;
                    break;
                case 'MultiLinkage':
                    let multiLinkageControl = new MultiLinkageControl(data);
                    multiLinkageControl.render(single);
                    _this.childComponent[data.dfield]=multiLinkageControl;
                    break;
            }
        }

        $('body').on('click.selectDrop',function(){
            $('.select-drop').hide();
        })
        Mediator.subscribe('form:changeValue',function(data){
            console.log(data);
            let originalData=data;
            if(originalData["edit_condition"] && originalData["edit_condition"] !== "") {
                _this.actions.reviseCondition(originalData,val,false);
            }
            _this.childComponent[data.dfield].data['value']=data.value;
            if(originalData.showValue || originalData.showValue==''){
                _this.childComponent[originalData.dfield].originalData['showValue']=originalData.showValue;
            }
            if(originalData.value=='' || originalData.value.length==0 || originalData.value==null){
                _this.childComponent[originalData.dfield].data['requiredClass']='required';
            }else{
                _this.childComponent[originalData.dfield].data['requiredClass']='required2';
            }
            _this.childComponent[originalData.dfield].reload();
            // console.log($(this));
            $('.select-drop').hide();
        })

        //添加提交按钮
        _this.el.append('<div style="position: fixed;bottom: 20px;right: 20px;"><button id="save">提交</button></div>')

        //提交按钮事件绑定
        $(_this.el).find("#save").on('click',function () {
            _this.onSubmit(_this.childComponent,cache_old);
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