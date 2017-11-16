/**
 *@author chenli
 *@description 只读控件
 */

import Component from '../../../lib/component';
import '../base-form/base-form.scss';
import template from './readonly-control.html';
import './readonly-control.scss';

let config = {
    template: template,
    data: {
        error_msg: ' error-msg',
        ui_error_arrow: 'ui-error-arrow',
    },
    actions: {
        keyup() {
            //正则表达式的错误提示 regErrorMsg: string;
            let regErrorMsg;
            let val = this.el.find("input").val();
            let reg = this.data.reg;

            //输入框输入时的实时验证提示
            let regReg = new RegExp(reg);
            if (val != "" && reg !== "") {
                for (let r in reg) {
	                let reg = eval(r);
	                let flag = reg.test(val);
                    console.log("flagReg：" + flag);
                    if (!flag) {
                        this.el.find("#error_tip").css("display", "inline-block");
                        regErrorMsg = reg[r];
                        this.el.find("#error_tip").children("pre").text(regErrorMsg);
                        return false;
                    } else {
                        this.el.find("#error_tip").css("display", "none");
                    }
                }
                // this.reload();
            }
            if (val != "" && this.data.numArea) {
                let minNum = this.data.numArea.min;
                let maxNum = this.data.numArea.max;
                let errorInfo = this.data.numArea.error;

                if (minNum !== "" && maxNum === "") {
                    if (val < minNum) {
                        this.el.find("#error_tip").css("display", "inline-block");
                        if (errorInfo === "") {
                            regErrorMsg = this.data.label + "字段不能小于" + minNum;
                            this.el.find("#error_tip").children("pre").text(regErrorMsg);
                        } else {
                            this.el.find("#error_tip").children("pre").text(errorInfo);
                        }
                        return false;
                    } else {
                        this.el.find("#error_tip").css("display", "none");
                    }
                } else if (minNum === "" && maxNum !== "") {
                    if (val > maxNum) {
                        this.el.find("#error_tip").css("display", "inline-block");
                        if (errorInfo === "") {
                            regErrorMsg = this.data.label + "字段不能大于" + maxNum;
                            this.el.find("#error_tip").children("pre").text(regErrorMsg);
                        } else {
                            this.el.find("#error_tip").children("pre").text(errorInfo);
                        }
                        return false;
                    } else {
                        this.el.find("#error_tip").css("display", "none");
                    }
                } else {
                    if (val < minNum || val > maxNum) {
                        this.el.find("#error_tip").css("display", "inline-block");
                        if (errorInfo === "") {
                            regErrorMsg = this.data.label + "字段的取值范围在" + minNum + "和" + maxNum + "内";
                            this.el.find("#error_tip").children("pre").text(regErrorMsg);
                        } else {
                            this.el.find("#error_tip").children("pre").text(errorInfo);
                        }
                        return false;
                    } else {
                        this.el.find("#error_tip").css("display", "none");
                    }
                }
            }
        }
    },
    binds: [
        {
            event: 'click',
            selector: '.ui-history',
            callback: function () {
                this.events.emitHistory(this.data);
            }
        },
        {
            event:'click',
            selector:'.countView',
            callback:function(){
                this.events.emitOpenCount(this.data);
            }
        }
    ],
    afterRender() {
        this.el.find('.ui-width').attr('title', this.data.value)
        this.el.find('.ui-width').css('width', this.data.width);
        //如果是统计字段有值 显示穿透查看
        if(this.data.dtype==10 && this.data.value){
            this.el.find('.countView').css('visibility','visible').addClass('icon-fl');
        }
        if(this.data.history){
            this.el.find('.ui-history').css('visibility','visible').addClass('icon-fl');
        }
        if(this.data.value && this.data.value != this.data.originalValue){
        	this.actions.keyup();
        }
    },
    beforeDestory() {
        this.el.off();
    }
}

class ReadonlyControl extends Component {
    constructor(data,events,newConfig){
		if(data.type == 'Textarea'){
			data.is_textarea = 1;
		}
    	data.originalValue=data.value;
        super($.extend(true,{},config,newConfig),data,events)
    }
}

export default ReadonlyControl