import template from './text.html';
import {Base} from '../base';
import './text.scss'
let config = {
    template: template,
    data: {
        category: 'text', // 设置input type 输入框类型 number date
        placeholder: '请输入',
        textTip: ''
    },
    actions: {
        /**
         * 输入监听
         * @param value
         */
        onInput: function (value) {
            this.data.value = value;
            this.trigger('onChange', value);
            if (value) {
                this.clearErrorMsg();
            };
        },
    },
    binds: [
        {
            event: 'input',
            selector: 'input',
            callback: function (context) {
                this.actions.onInput(context.value);
            }
        }
    ],
    afterRender(){
        this.$input = this.el.find('input');
        this.$label = this.el.find('label');
    }
}

class Text extends Base {
    constructor(data, event,extendConfig) {
        super($.extend(true,{},config,extendConfig), data, event)
    }

    /**
     * 设置value
     * @param value = input输入框值
     */
    setValue(value) {
        this.data.value = value;
        this.$input.val(value);
    }
}

export {Text}