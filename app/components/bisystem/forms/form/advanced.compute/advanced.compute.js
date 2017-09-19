import template from './advanced.compute.html';
import {Base} from '../base';
import './advanced.compute.scss'
import {AdvancedComputeItem} from './item/advanced.compute.item';

let config = {
    template: template,
    data: {
    },
    actions: {
        /**
         * 增加高级计算模版实例
         */
        makeAdvancedComputeObj() {
            let item = new AdvancedComputeItem();
            this.append(item, this.el.find('.advanced-compute-list tbody'), 'tr')
        }
    },
    binds: [
    ],
    afterRender(){
        this.actions.makeAdvancedComputeObj();
    }
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