/**
 * Created by birdyy on 2017/8/21.
 * xy轴组件
 */

import {BiBaseComponent} from '../../../../bi.base.component';
import {instanceFitting, groupFitting} from '../../../fittings/export.fittings';
import Mediator from '../../../../../../lib/mediator';
import msgbox from "../../../../../../lib/msgbox";
import template from './single.html';
import "./single.scss";

let config = {
    template:template,
    data: {
        singleShow:'form-chart-pie-hide',
        checkboxs: [], // 绑定y轴数据
        items: [],
        checkedItems: []
    },
    actions: {},
    afterRender() {
        this.renderFitting();
    },
    firstAfterRender() {
    },
    beforeDestory() {}
};

export class SingleComponent extends BiBaseComponent{
    constructor() {
        super(config);
    }

    /**
     * 单条数据 Y轴数据 fittings
     */
    renderFitting() {

        this.formYAxis = {
            yAxis:instanceFitting({
                type:'checkbox',
                me: this,
                data: {
                    value:null,
                    checkboxs:this.data.checkboxs,
                    items: this.data.items,
                    checkedItems: this.data.checkedItems,
                },
                container: 'single-columns'
            }),
        }
    };

    /**
     * 获取单挑数据y轴字段
     */
    getValue() {
        console.log(this.formYAxis.yAxis);
        return this.formYAxis.yAxis.getValue();
    }
}