import template from './textarea.html';
import {Base} from '../base';
import './textarea.scss'
let config = {
    template: template,
    data: {
        category: 'text', // 设置input type 输入框类型 number date
        placeholder: '请输入'
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
            selector: 'textarea',
            callback: function (context) {
                this.actions.onInput(context.value);
            }
        }
    ],
    afterRender(){
        this.$textarea = this.el.find('textarea');
        this.$label = this.el.find('label');
    }
}

class Textarea extends Base {
    constructor(data, event) {
        super(config, data, event)
    }

    /**
     * 设置value
     */
    setValue(value) {
        this.data.value = value;
        this.$textarea.val(value);
    }
}

export {Textarea}