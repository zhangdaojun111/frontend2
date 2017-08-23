/**
 * Created by birdyy on 2017/8/23.
 * 已选择列名
 */

import {BiBaseComponent} from '../../../../../bi.base.component';
import template from './choosed.html';

let config = {
    template:template,
    data: {
        choosed: []
    },
    actions: {},
    afterRender() {},
    firstAfterRender() {},
    beforeDestory() {}
};

export class FormColumnChoosedComponent extends BiBaseComponent{
    constructor() {
        super(config);
    }

    setValue(choosed) {
        this.data.choosed = choosed;
        this.reload();
    }
}