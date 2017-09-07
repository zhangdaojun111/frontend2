import Component from '../../../../lib/component';
import {formChartValidateService as formValidate} from '../../../../services/bisystem/bi.chart.validate.service';

class Base extends Component {

    constructor(config, data, event) {
        super(config, data, event)
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
                // this.$input.focus();
                this.showErrorMsg(msg);
                break;
            }
        };
        return isValid;
    }
    showErrorMsg(){

    }
}

export {Base}