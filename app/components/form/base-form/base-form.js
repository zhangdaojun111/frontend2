import Componet from '../../../lib/component';
import TextArea from '../textarea-control/textarea-area'
import Radio from '../radio-control/radio-control';
import Input from '../input-control/input-control';
import Readonly from '../readonly-control/readonly-control';
import Password from '../encrypt-input-control/encrypt-input-control';
import Hidden from '../hidden-control/hidden-control';
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
    afterRender:function(){
        let _this=this;
        this.set('childComponent',{});
        console.log(_this.el);
        for(let data of _this.data.data){
            console.log(data.dfield);
            let single=_this.el.find('div[data-dfield='+data.dfield+']');
            let type=single.data('type');
            console.log('*********')
            console.log('*********')
            console.log('*********')
            console.log(type);
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
                case 'readonly':
                    let readonly=new Readonly(data);
                    readonly.render(single);
                    _this.childComponent[data.dfield]=readonly;
                    break;
                case 'password':
                    let password=new Password(data);
                    password.render(single);
                    _this.childComponent[data.dfield]=password;
                    break;
                case 'hidden':
                    let hidden=new Hidden(data);
                    hidden.render(single);
                    _this.childComponent[data.dfield]=hidden;
                    break;
            }
        }
    }
}
class BaseForm extends Componet{
    constructor(formData){
        config.template=formData.template;
        config.data=formData.data;
        console.log(config);
        super(config);
    }
}
export default BaseForm