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
        Mediator.subscribe('form:checkRequired',function(data){
            _this.childComponent[data.dfield].data['value']=data.value;
            if(data.showValue){
                _this.childComponent[data.dfield].data['showValue']=data.showValue;
            }
            if(data.value=='' || data.value.length==0 || data.value==null){
                _this.childComponent[data.dfield].data['requiredClass']='required';
            }else{
                _this.childComponent[data.dfield].data['requiredClass']='required2';
            }
            console.log(_this.childComponent[data.dfield]);
            _this.childComponent[data.dfield].reload();
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