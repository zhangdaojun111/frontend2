/**
 * Created by birdyy on 2017/8/23.
 * 已选择列名
 */
import {Base} from '../base';
import template from './choosed.html';

let config = {
    template:template,
    data: {
        list: []
    },
    actions: {
        /**
         * 更新选中的字段
         * @param columns = 选中的字段列表
         */
        update(columns) {
            this.data.list = columns;
            this.reload();
        },

        /**
         * 清空所有选中字段
         */
        clear() {
            this.data.list = [];
            this.reload();
        }

    },
    afterRender() {},
    firstAfterRender() {},
    beforeDestory() {}
};

export class Choosed extends Base{
    constructor(data, event){
        super(config, data, event)
    }
}