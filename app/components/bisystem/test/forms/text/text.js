import template from './text.html';
import {Base} from '../base';
import './text.scss'

let config = {
    template: template,
    data: {},
    actions: {
        /**
         * 输入监听
         * @param value
         */
        onInput: function (value) {
            this.data.value = value;
            this.trigger('onChange', value);
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
    constructor(data, event){
        super(config, data, event)
    }
    /**
     * 设置value
     * @param value = input输入框值
     */
    setValue(value){
        this.data.value = value;
        this.$input.val(value);
    }
}

export {Text}