import Component from '../../../lib/component';
import '../../../assets/scss/control.scss'
import Mediator from '../../../lib/mediator';
import {FormService} from "../../../services/formService/formService"

let config={
    template:`
                <div class="clearfix">
                    {{#if unvisible}}
                        <a href="javascript:void(0);" style="color:#ccc;">权限受限</a>
                    {{else}}
                        {{#if be_control_condition }}
                            <a href="javascript:void(0);" style="color:#ccc;">被修改条件限制</a>
                        {{else}}                 
                            <div style="display: inline-block">{{label}}</div>
                                {{#if is_view}}               
                                    <input style="width: 240px"  type="text" value="{{value}}" class={{inputClass}} disabled >
                                {{else}}
                                    <input style="width: 240px"  type="text" value="{{value}}" class={{inputClass}}>
                               {{/if}} 
                           <div style="display: inline-block">
                                   {{#if required}}
                                    <span id="requiredLogo" class="required" ></span>
                                   {{/if}} 
                           </div>                   
                           {{/if}}
                           <span style="position: relative; display:inline-block">  
                                 <div class={{error_msg}} id="error_tip"  style=" display:none">
                                        <em class={{ui_error_arrow}}></em>
                                        <pre>{{ regErrorMsg }}</pre>
                                 </div>  
                           </span>
                     {{/if}}       
               </div>
                `,
    data: {
        inputClass: 'dynamic-form-input',
        error_msg: ' error-msg',
        ui_error_arrow: 'ui-error-arrow',
    },
    actions:{
        keyup: function() {
        let _this=this;
        //正则表达式的错误提示 regErrorMsg: string;
        let regErrorMsg;
        let val = this.el.find("input").val();
        this.data.value=val;
        _.debounce(function(){Mediator.publish('form:changeValue:'+_this.data.tableId,_this.data)},200)();
        let func = this.data.func;
        let reg = this.data.reg;
        let required = this.data.required

        console.log(" val:"+val+"  func:"+func+"  reg:"+reg);
            //输入框输入时的实时函数验证
            if(val != "" && !$.isEmptyObject(func)){
                for( let r in func){
                    console.log('formService');
                    console.log(FormService);
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
                    // if(r == "checkCard"){
                    //     var a = FormService.checkCard(val);
                    // }else{
                    //     console.log("怎么错了呢(；′⌒`)")
                    // }
                    let flag = a;
                    console.log(flag);
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
                    console.log("flagReg："+flag);
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

         if(val != "" && this.data.numArea !== ""){
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

        if(this.data.effect !== ""){

        }
    }
    },
    firstAfterRender:function(){
    },
    afterRender: function() {
        this.el.on('keyup', 'input', () => {
            this.actions.keyup();
        });
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


    },
    }

class InputControl extends Component {
    constructor(data){
        super(config,data);
        // console.log('inputControl');
        // console.log(this.data);
    }
}

export default InputControl