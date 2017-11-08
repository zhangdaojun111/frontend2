import Component from '../../../../lib/component';
import {formChartValidateService as formValidate} from '../../../../services/bisystem/bi.chart.validate.service';

class Base extends Component {

    constructor(config, data, event,extendConfig) {
        super($.extend(true,{},config,extendConfig), data, event)
    }
    setValue(){}
    getValue(){
        return this.data.value;
    }
    setLabel(){}
    setName(name){
        this.data.name = name;
    }
    getName(){
        return this.data.name;
    }
    /**
     * 数据验证
     */
    valid(){
        let isValid;
        for (let rule of this.data.rules) {
            isValid = formValidate[rule['type']](this.data.value);
            if (!isValid) {
                this.showErrorMsg(rule.errorMsg);
                break;
            }
        };
        return isValid;
    }

    /**
     * 显示错误消息
     * @param msg = 错误提示消息
     */
    showErrorMsg(msg){
        this.el.find('.form-label .error-msg').html(msg);
    }
    /**
     * 清空数据错误提示
     */
    clearErrorMsg() {
        this.el.find('.form-label .error-msg').html('');
    }
}

export {Base}