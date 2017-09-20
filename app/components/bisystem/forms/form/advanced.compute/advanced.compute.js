import template from './advanced.compute.html';
import {Base} from '../base';
import './advanced.compute.scss'
import {AdvancedComputeItem} from './item/advanced.compute.item';

let config = {
    template: template,
    data: {
        items:{}
    },
    actions: {
        /**
         * 增加高级计算模版实例
         */
        makeAdvancedComputeObj() {
            let item = new AdvancedComputeItem({}, {
                onRemoveItem: (componentId) => {
                    delete this.data.items[componentId];
                }
            });
            this.append(item, this.el.find('.advanced-compute-list tbody'), 'tr');
            this.data.items[item.componentId] = item;
            return item;
        }
    },
    binds: [
        {
            event: 'click',
            selector: '.add-item-btn',
            callback: function (context) {
                this.actions.makeAdvancedComputeObj();
            }
        }
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
     * 设置items
     * @param items = items数据
     */
    setValue(items) {
        Object.keys(this.data.items).forEach(key => {
            this.data.items[key].destroySelf()
            delete this.data.items[key];
        });
        items.forEach(value => {
           let item = this.actions.makeAdvancedComputeObj();
           item.setValue(value)
        })
    }

    /**
     * 获取items
     * @param value = items数据
     */
    getValue() {
       let data = Object.keys(this.data.items).map(key => this.data.items[key].getValue());
       return data;
    }
}

export {AdvancedCompute}