/**
 *@author chenli
 *@description 普通输入框控件
 */
import Component from '../../../lib/component';
import '../base-form/base-form.scss';
import {FormService} from "../../../services/formService/formService"
import template from './input-control.html'
let config = {
    template: template,
    data: {
        error_msg: ' error-msg',
        ui_error_arrow: 'ui-error-arrow',
    },
    actions: {
        keyup: function () {
            try {
                let _this = this;
                //正则表达式的错误提示 regErrorMsg: string;
                let regErrorMsg;
                let val = this.el.find("input").val();
                this.data.value = val;
                _.debounce(function () {
                    _this.events.changeValue(_this.data)
                }, 200)();
                let func = this.data.func;
                let reg = this.data.reg;
                let required = this.data.required
                //输入框输入时的实时函数验证
                if (val != "" && !$.isEmptyObject(func)) {
                    for (let r in func) {
                        let flag = FormService[r](val);
                        if (!flag) {
                            this.el.find("#error_tip").css("display", "inline-block");
                            regErrorMsg = func[r];
                            this.el.find("#error_tip").children("pre").text(regErrorMsg);
                            return false;
                        } else {
                            this.el.find("#error_tip").css("display", "none");
                        }
                    }
                }

                //输入框输入时的实时验证提示
                let regReg = new RegExp(reg);
                if (val != "" && reg !== "") {
                    for (let r in reg) {
                        let regReg = eval(r);
                        let flag = regReg.test(val);
                        if (!flag) {
                            this.el.find("#error_tip").css("display", "inline-block");
                            regErrorMsg = reg[r];
                            this.el.find("#error_tip").children("pre").text(regErrorMsg);
                            return false;
                        } else {
                            this.el.find("#error_tip").css("display", "none");
                        }
                    }
                }
                if (val != "" && this.data.numArea && this.data.numArea !== "") {
                    let label = this.data.label;
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
            } catch (error) {
                return 1;
            }
        }
    },
    binds: [
        {
            event: 'click',
            selector: '.ui-history',
            callback: function () {
                this.events.emitHistory(this.data)
            }
        },
        {
            event: 'mousedown',
            selector: 'input',
            callback: function () {
                this.el.find("input").css({
                    "border": "1px solid rgb(169, 210, 255)",
                });
            }
        },
        {
            event: 'mouseleave',
            selector: 'input',
            callback: function () {
                this.el.find("input").css({
                    "border": "1px solid rgb(226, 226, 226)",
                });
            }
        }
    ],
    afterRender() {
        let _this = this;
        if(this.data.history){
            this.el.find('.ui-history').css('visibility','visible');
        }
        this.el.find('.search').on('input', _.debounce(function () {
            _this.actions.keyup();
        }, 200));
        this.el.find('.ui-width').css('width', this.data.width);
        if (this.data.is_view) {
            this.el.find('.ui-width').attr('disabled', true);
        } else {
            this.el.find('.ui-width').attr('disabled', false);
        }
        //回显
        if (_this.data.value) {
            _this.el.find(".search").val(_this.data.value);
        } else {
            _this.el.find(".search").val('');
        }
    },


    beforeDestory() {
        this.el.off();
    }
}
class InputControl extends Component {
    constructor(data, events) {
        super(config, data, events);
    }
}
export default InputControl