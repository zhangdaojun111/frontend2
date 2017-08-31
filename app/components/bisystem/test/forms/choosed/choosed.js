/**
 * Created by birdyy on 2017/8/23.
 * 已选择列名
 */
import {Base} from '../base';
import template from './choosed.html';

let config = {
    template:template,
    data: {
        choosed: []
    },
    actions: {
        /**
         * 更新选中的字段
         */
        update(columns) {
            this.data.choosed = columns;
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