import template from './radio.html';
import {Base} from '../base';
import './radio.scss';

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
            if (value) {
                this.clearErrorMsg();
            }
        },

        /**
         * 清空所有选中字段
         */
        clear() {
            this.data.list = [];
            this.data.value = null;
            this.reload();
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
    constructor(data, event,extendConfig){
        super($.extend(true,{},config,extendConfig), data, event)
    }

    /**
     * 设置value
     * @param value
     */
    setValue(value){
        if (value) {
            this.data.value = value;
            this.el.find(`input[value='${this.data.value}']`).attr("checked",true);
        }
        this.data.firstDo = true;
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
        this.data.value = this.data.firstDo ? this.data.value : null;
        this.reload();
        if (this.data.firstDo) {
            this.setValue(this.data.value);
            this.data.firstDo = false;
        }
    }

}

export {Radio}