/**
 * Created by birdyy on 2017/9/1.
 * 下穿图表配置组件
 */

import template from './deep.html';
import './deep.scss';
import {Base} from '../base';

let config = {
    template: template,
    data: {},
    actions: {
        /**
         * 设置deeps list
         * @param value = x轴下穿字段
         */
        update(value) {
            if (this.data.value) {
                _.remove(this.data.value,(deep) => {
                    return value.id === deep.id
                })
            };
            this.data.value.push(value);
            this.reload();
        },

        /**
         * 删除下穿
         * @param value = x轴下穿字段
         */
        remove(id) {
            _.remove(this.data.value,(deep) => {
                return id ===deep.id
            })
            this.reload();
        },

        /**
         *清除所有下穿字段
         */
       clear() {
            this.data.value = [];
            this.reload();
        },
    },
    binds: [
        {
            event: 'click',
            selector: '.del-deep-btn',
            callback: function (context) {
                let id = $(context).closest('td').attr('data-id');
                this.actions.remove(id);
            }
        }
    ],
    afterRender(){
    }
}

class Deep extends Base {
    constructor(data, event){
        super(config, data, event)
    }
}

export {Deep}