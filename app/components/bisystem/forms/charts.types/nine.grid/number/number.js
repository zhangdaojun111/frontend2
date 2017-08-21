/**
 * Created by birdyy on 2017/8/21.
 * xy轴组件
 */

import {BiBaseComponent} from '../../../../bi.base.component';
import {instanceFitting, groupFitting} from '../../../fittings/export.fittings';
import Mediator from '../../../../../../lib/mediator';
import msgbox from "../../../../../../lib/msgbox";
import template from './number.html';
import "./number.scss";

let config = {
    template:template,
    data: {},
    actions: {},
    afterRender() {
        this.renderFitting();
    },
    firstAfterRender() {},
    beforeDestory() {}
};

export class NineGridNumberComponent extends BiBaseComponent{
    constructor() {
        super(config);
        this.gridNumber = null;
    }

    /**
     * 渲染3*3格子数 fittings
     */
    renderFitting() {

        const gridNumeberFitting = [
            {
                nineGridColumnXL:instanceFitting({
                    type:'input',
                    data:{
                        value:null,
                        label: '请输入X轴名称1*',
                        show:true
                    },
                    me: this,
                    container: 'nine-grid-column-x'
                })
            }
        ];

        this.gridNumber = groupFitting(gridNumeberFitting);
        console.log(this.gridNumber);
    }


    /**
     * 获取y轴的数据
     */
    getValue(data) {
        // this.data.field = data;
        // Mediator.publish('bi:chart:form:update', {type:'update-y'},this.data);
    }


}