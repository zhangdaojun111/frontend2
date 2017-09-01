import template from './radio.html';
import {Base} from '../base';

let config = {
    template: template,
    data: {},
    actions: {

        /**
         * radio change事件设置值
         * @param value = radio value的值
         */
        onChange: function (value) {
            this.data.value = value;
        }
    },
    binds: [
        {
            event: 'change',
            selector: 'input',
            callback: function (context) {
                this.actions.onChange(context.value);
            }
        }
    ],

    afterRender(){}
};

class Radio extends Base {
    constructor(data, event){
        super(config, data, event)
    }

    /**
     * 设置value
     * @param value
     */
    setValue(value){
        this.data.value = value;
        this.el.find(`input[value=${this.data.value}]`).attr("checked",true);
    }

    /**
     * 设置label
     * @param label = input标题
     */
    setLabel(label){
        this.data.label = label;
        this.$label.text(label);
    }

    /**
     * 设置checkbox list
     * @param checkbox = 要设置的checkboxs数据
     */
    setList(list) {
        this.data.list = list;
        this.reload();
        if (this.data.value) {
            this.el.find(`input[value=${this.data.value}]`).attr("checked",true);
        }
    }

}

export {Radio}