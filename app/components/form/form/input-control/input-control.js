import Component from '../../../lib/component';
import '../base-form/base-form.scss';
import Mediator from '../../../lib/mediator';
import {FormService} from "../../../services/formService/formService"
import template from './input-control.html'

let config={
    template:template,
    data: {
        error_msg: ' error-msg',
        ui_error_arrow: 'ui-error-arrow',
    },
    actions:{
        keyup: function() {
        try{
            let _this=this;
            //正则表达式的错误提示 regErrorMsg: string;
            let regErrorMsg;
            let val = this.el.find("input").val();
            this.data.value=val;
            console.log('走没走这里呢');
            _.debounce(function(){Mediator.publish('form:changeValue:'+_this.data.tableId,_this.data)},200)();
            let func = this.data.func;
            let reg = this.data.reg;
            let required = this.data.required

                //console.log(" val:"+val+"  func:"+func+"  reg:"+reg);
                //输入框输入时的实时函数验证
                if(val != "" && !$.isEmptyObject(func)){
                    for( let r in func){
                        //var a = FormService.r(val)
                        switch (r)
                        {
                            case "checkCard":
                                var a = FormService.checkCard(val);
                                break;
                            case "orgcodevalidate":
                                var a = FormService.orgcodevalidate(val);
                                break;
                            case "xxzdx":
                                var a = FormService.xxzdx(val);
                                break;
                            case "tjbds":
                                var a = FormService.tjbds(val);
                                break;
                            case "jssj":
                                var a = FormService.jssj(val);
                                break;
                            case "dqsj":
                                var a = FormService.dqsj(val);
                                break;
                            case "getNowDate":
                                var a = FormService.getNowDate(val);
                                break;
                            case "fun_ghl_dqrq":
                                var a = FormService.fun_ghl_dqrq(val);
                                break;
                            case "fun_ghl_xxzdx":
                                var a = FormService.fun_ghl_xxzdx(val);
                                break;
                            case " fun_ghl_dqsj":
                                var a = FormService. fun_ghl_dqsj(val);
                                break;
                            default:
                                console.log("怎么错了呢(；′⌒`)");
                        }
                        let flag = a;
                        if(!flag){
                            this.el.find("#error_tip").css("display","inline-block");
                            regErrorMsg = func[r];
                            this.el.find("#error_tip").children("pre").text(regErrorMsg);
                            return false;
                        }else{
                            this.el.find("#error_tip").css("display","none");
                        }
                    }
                    //this.reload();
                }
                //输入框输入时的实时验证提示
                let regReg = new RegExp(reg);
                if(val != "" && reg !== ""){
                    for(let r in reg){
                        let regReg = eval(r);
                        let flag = regReg.test(val);
                        if(!flag){
                            this.el.find("#error_tip").css("display","inline-block");
                            regErrorMsg = reg[r];
                            this.el.find("#error_tip").children("pre").text(regErrorMsg);
                            return false;
                        }else{
                            this.el.find("#error_tip").css("display","none");
                        }
                    }
                    //this.reload();
                }

                if(val != "" && this.data.numArea && this.data.numArea !== ""){
                    let label = this.data.label;
                    let minNum = this.data.numArea.min;
                    let maxNum = this.data.numArea.max;
                    let errorInfo = this.data.numArea.error;

                    if(minNum !== "" && maxNum === ""){
                        if(val < minNum){
                            this.el.find("#error_tip").css("display","inline-block");
                            if(errorInfo === ""){
                                regErrorMsg = this.data.label+"字段不能小于"+ minNum ;
                                this.el.find("#error_tip").children("pre").text(regErrorMsg);
                            }else{
                                this.el.find("#error_tip").children("pre").text(errorInfo);
                            }
                            return false;
                        } else {
                            this.el.find("#error_tip").css("display","none");
                        }
                    }else if(minNum === "" && maxNum !== ""){
                        if(val > maxNum){
                            this.el.find("#error_tip").css("display","inline-block");
                            if(errorInfo === ""){
                                regErrorMsg = this.data.label+"字段不能大于"+ maxNum ;
                                this.el.find("#error_tip").children("pre").text(regErrorMsg);
                            }else{
                                this.el.find("#error_tip").children("pre").text(errorInfo);
                            }
                            return false;
                        } else {
                            this.el.find("#error_tip").css("display","none");
                        }
                    }else {
                        if(val < minNum || val > maxNum){
                            this.el.find("#error_tip").css("display","inline-block");
                            if(errorInfo === ""){
                                regErrorMsg = this.data.label+"字段的取值范围在"+ minNum +"和" +  maxNum +"内";
                                this.el.find("#error_tip").children("pre").text(regErrorMsg);
                            }else{
                                this.el.find("#error_tip").children("pre").text(errorInfo);
                            }
                            return false;
                        } else {
                            this.el.find("#error_tip").css("display","none");
                        }
                    }
                    // this.reload();
                }
            }catch(error){
                return 1;
            }
        }
    },
    afterRender() {
        let _this=this;
        _this.el.on('click','.ui-history',function(){
            _.debounce(function(){Mediator.publish('form:history:'+_this.data.tableId,_this.data)},300)();
        });
        this.el.find('.search').on( 'input', _.debounce(function () {
            _this.actions.keyup();
        }, 200));
        /* setBorderColor*/
        this.el.on('mouseenter', 'input', () => {
            this.el.find("input").css({"border":"1px solid rgb(169, 210, 255)","background-color":"rgb(255, 255, 255)"});
        });
        this.el.on('focus', 'input', () => {
            this.el.find("input").css({"border":"1px solid rgb(226, 226, 226)","background-color":"rgb(255, 255, 255)"});
        });
        this.el.on('blur', 'input', () => {
            this.el.find("input").css({"border":"1px solid rgb(226, 226, 226)","background-color":"rgb(255, 255, 255)"});
        });
        this.el.on('mouseleave', 'input', () => {
            this.el.find("input").css({"border":"1px solid rgb(226, 226, 226)","background-color":"rgb(255, 255, 255)"});
        });
        this.el.find('.ui-width').css('width',this.data.width);
        if(this.data.is_view){
            this.el.find('.ui-width').attr('disabled',true);
        }else{
            this.el.find('.ui-width').attr('disabled',false);
        }
    },
    beforeDestory(){
        Mediator.removeAll('form:changeValue:'+this.data.tableId);
        Mediator.removeAll('form:history:'+this.data.tableId);
    }
}

class InputControl extends Component {
    constructor(data){
        super(config,data);
    }
}

export default InputControl