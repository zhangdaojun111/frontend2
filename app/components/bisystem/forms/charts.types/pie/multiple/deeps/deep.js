/**
 * Created by birdyy on 2017/8/21.
 * 饼图下穿
 */

import {BiBaseComponent} from '../../../../../bi.base.component';
import {instanceFitting, groupFitting} from '../../../../fittings/export.fittings';

import template from './deep.html';
import "./deep.scss";

let config = {
    template:template,
    data: {
        deeps: [], //饼图下穿数据
    },
    actions: {},
    afterRender() {
    },
    firstAfterRender() {
        let me = this;
        this.el.on('click', '.del-deep-btn',function(event){
            let index = $(this).closest('tr').index();
            me.removeDeep(index);
            $(this).closest('tr').remove();
            return false;
        })
    },
    beforeDestory() {}
};

export class PieDeepComponent extends BiBaseComponent{
    constructor() {
        super(config);
    }

    /**
     * 删除下穿
     *@param index 通过具体的索引删除具体的下穿
     */
    removeDeep(index) {
        this.data.deeps.splice(index,1);
        console.log(this.data.deeps)
    }
}