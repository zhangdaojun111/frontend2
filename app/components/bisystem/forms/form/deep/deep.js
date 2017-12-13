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
           // this.data.firstDo 因为有可能是编辑模式下第一次加载，所以第一次不能清空数据
            this.data.value = this.data.firstDo ? this.data.value : [];
            this.data.firstDo = false;
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
    constructor(extendConfig){
        super($.extend(true,{},config,extendConfig))
    }

    /**
     * 设置下穿字段列表
     * @param value
     */
    setValue(value){
        this.data.value = value;
        this.data.firstDo = true;
        this.reload();
    }
}

export {Deep}
Deep.config = config;