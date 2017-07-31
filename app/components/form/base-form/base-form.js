import Component from '../../../lib/component';
import TextArea from '../textarea-control/textarea-area'
import Radio from '../radio-control/radio-control';
import Input from '../input-control/input-control';
import SelectControl from "../select-control/select-control";
import YearControl from "../year-control/year-control";
import BuildInControl from "../buildIn-control/buildIn-control";
let config={
    template:'',
    data:{
    },
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
        this.set('childComponent',{});
        for(let data of _this.data.data){
            let single=_this.el.find('div[data-dfield='+data.dfield+']');
            let type=single.data('type');
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
                    _this.childComponent[data.dfield]=textArea;
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
            }
        }
    }
}
class BaseForm extends Component{
    constructor(formData){
        config.template=formData.template;
        config.data=formData.data;
        console.log(config);
        super(config);
    }
}
export default BaseForm