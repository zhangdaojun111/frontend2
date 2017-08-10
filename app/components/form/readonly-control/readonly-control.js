import Component from '../../../lib/component';
import '../base-form/base-form.scss';
import Mediator from '../../../lib/mediator';

let config={
    template:`<div class="clearfix">
                 {{#if unvisible}}
                    <a href="javascript:void(0);" style="color:#ccc;">权限受限</a>
                 {{else if be_control_condition}}
                        <a href="javascript:void(0);" style="color:#ccc;">被修改条件限制</a>
                {{else}}            
                    <input style="width:{{width}};background: #ebebe4;"  type="text" value="{{value}}" readonly="readonly"  class='dynamic-form-input' > 
                    <div style="display: inline-block">
                           {{#if required}}
                            <span id="requiredLogo" class="{{requiredClass}}" ></span>
                           {{/if}}
                            {{#if history}}
                               <a href="javascript:void(0);" class="ui-history"  style="vertical-align: middle;"></a>     
                            {{/if}} 
                    </div>
                        <span style="position: relative; display:inline-block">  
                           <div class={{error_msg}} id="error_tip"  style=" display:none">
                                <em class={{ui_error_arrow}}></em>
                                <pre>{{ regErrorMsg }}</pre>
                           </div>  
                        </span>
                 {{/if}}       
               </div>
                `,
    data:{
        width:'240px',
        error_msg: ' error-msg',
        ui_error_arrow: 'ui-error-arrow',
    },
    actions:{
        keyup: function() {
            //正则表达式的错误提示 regErrorMsg: string;
            let regErrorMsg;
            let val = this.el.find("input").val();
            let func = this.data.func;
            let reg = this.data.reg;
            let required = this.data.required

            console.log(" val:"+val+"  func:"+func+"  reg:"+reg);

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
               // this.reload();
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
            }
        }
    },
    firstAfterRender:function(){
        let _this=this;
        this.el.on('click','.ui-history',function(){
            _.debounce(function(){Mediator.publish('form:history:'+_this.data.tableId,_this.data)},300)();
        });
    },
    afterRender: function() {
            this.el.on( 'input', () => {
                this.actions.keyup();
            });
    },
}
class ReadonlyControl extends Component {
    constructor(data){
        super(config,data);
        // console.log('readonly-control');
        // console.log(this.data);
    }
}

export default ReadonlyControl