import template from './textarea.html';
import {Base} from '../base';
import './textarea.scss'
let config = {
    template: template,
    data: {
        category: 'text', // 设置input type 输入框类型 number date
        placeholder: ''
    },
    actions: {
    },
    binds: [],
    afterRender(){
    }
}

class Textarea extends Base {
    constructor(data, event) {
        super(config, data, event)
    }

    /**
     * 设置value
     * @param value = Textarea输入框值
     */
    setValue(value) {
    }
}

export {Textarea}