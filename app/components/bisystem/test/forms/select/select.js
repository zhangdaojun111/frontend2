import template from './select.html';
import {Base} from '../base';

let config = {
    template: template,
    data: {},
    actions: {
        /**
         * select change事件设置值
         * @param value = radio value的值
         */
        onChange: function (value) {
            this.data.value = value;
        },
    },
    binds: [
        {
            event: 'change',
            selector: 'select',
            callback: function (context) {
                this.actions.onChange(context.value);
            }
        }
    ],
    afterRender(){
        if (this.data.value) {
            this.el.find('select').val(this.data.value);
        }
    }
};

class Select extends Base {
    constructor(data, event){
        super(config, data, event)
    }

    /**
     * 设置value
     * @param value
     */
    setValue(value){}

    /**
     * 设置select options
     * @param list = 要设置的options数据
     */
    setList(list) {
        this.data.list = list;
        this.reload();
    }

}

export {Select}