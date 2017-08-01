import Component from '../../../lib/component';
import '../../../assets/scss/control.scss'

let config={
    template:`<div style="display: inline-block">{{label}}</div>
               {{#if depIf}}
               <input style="width: 240px"  type="text" value="{{value}}" >
               {{else}}
               <span style="position: relative; display:inline-block">
                     <input style="width: 240px"  type="text" value="{{value}}" class={{inputClass}} >{{value}}
                     <span id="requirelogo" class={{spanClass}}> </span>
                     
                     <div class={{error_msg}} id="error_tip"  style="left: 240px; display:none">
                            <em class={{ui_error_arrow}}></em>
                            <pre>{{ regErrorMsg }}</pre>
                     </div>
                     
                     <span style="display: none;">
                         <form-be-control-condition><a href="javascript:void(0);" style="color:#ccc;">被修改条件限制</a></form-be-control-condition>
                     </span>
                </span>
               {{/if}}
                `,
    data:{
        depIf:false,
        spanClass: 'required',
        inputClass:'dynamic-form-input',
        error_msg: ' error-msg',
        ui_error_arrow: 'ui-error-arrow',
                // <input type="text" value="{{value}}"/>`,
    actions:{
        keyup: function() {

        //正则表达式的错误提示 regErrorMsg: string;
        let regErrorMsg;
        let val = this.el.find("input").val();
        let func = this.data.func;
        let reg = this.data.reg;
        let required = this.data.required

        console.log(" val:"+val+"  func:"+func+"  reg:"+reg);
            //必填的样式切换
            if(required == "1") {
                if(val != ""){
                    this.el.find("#requirelogo").css({"background":"url(../app/assets/images/icon_required2.png)"});
                }else{
                    this.el.find("#requirelogo").css("background","url(../app/assets/images/icon_required.png)");
                }
            }
            if(val === "" && required!== "1"){
                this.el.find("#error_tip").css("display","none");
            }

            //输入框输入时的实时函数验证
            if(val != "" && !$.isEmptyObject(func)){
                for(let r in func){
                   let flag = r;
                    console.log("flagFunc："+flag);
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
}
class InputControl extends Component {
    constructor(data){
        super(config,data);
    }
}

export default InputControl