/**
 * Created by birdyy on 2017/8/14.
 */

import {BiBaseComponent} from '../../../bi.base.component';
import template from './multi.html';
import {FormBaseComponent} from '../../base/base';
import {instanceFitting, groupFitting} from '../../fittings/export.fittings';
import Mediator from '../../../../../lib/mediator';
import msgbox from "../../../../../lib/msgbox";
import {PMAPI} from '../../../../../lib/postmsg';
import {FormMixShareComponent} from '../../mix.share/mix.share';
import {MultiChartComponent} from "./chart/chart";


import "./multi.scss";

let config = {
    template:template,
    data: {},
    actions: {},
    afterRender() {
        this.renderFitting();
    },
    firstAfterRender() {
        this.el.on('click','.multi-add-btn',()=>{
            this.multiAdd();
            return false;
        })
    }
}
export class FormMultiComponent extends BiBaseComponent{
    constructor() {
        super(config);
        this.formGroup={};
    }

    /**
     * 渲染multi fittings
     */
    renderFitting(){
        let base = new FormBaseComponent();
        let share = new FormMixShareComponent();
        let multi =new MultiChartComponent();

        this.append(base, this.el.find('.multi-base'));
        this.append(share, this.el.find('.multi-share'));
        this.append(multi, this.el.find('.add-charts'));

        this.formGroup = {
            multiName:base,
            multiShare:share,
            multiMulti:multi,


        }
    }

    /**
     * 增加一张图表
     */
    multiAdd(){
        let multiChart = new MultiChartComponent();
        this.append(multiChart,this.el.find('.add-charts'));
    }

    /**
     * reset实例，当通过路由重新进入实例，清空所有数据
     */
    reset(flag) {
        this.formGroup = {};
    }

}