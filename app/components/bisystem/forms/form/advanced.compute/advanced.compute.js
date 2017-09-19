import template from './advanced.compute.html';
import {Base} from '../base';
import './advanced.compute.scss'
let config = {
    template: template,
    data: {},
    actions: {
    },
    binds: [
    ],
    afterRender(){}
}

class AdvancedCompute extends Base {
    constructor(data, event) {
        super(config, data, event)
    }

    /**
     * 设置value
     * @param value = input输入框值
     */
    setValue(value) {
    }
}

export {AdvancedCompute}