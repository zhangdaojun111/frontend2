/**
 * Created by birdyy on 2017/8/14.
 */

import {BiBaseComponent} from '../../../bi.base.component';
import template from './normal.html';
import {FormBaseComponent} from '../../base/base';
import {fittings as form} from '../../fittings/export.fittings';

import msgbox from "../../../../../lib/msgbox";
import {FormMixShareComponent} from '../../mix.share/mix.share';
import "./normal.scss";

let config = {
    template:template,
    data: {},
    actions: {},
    afterRender() {
        this.renderFitting();
    },
    firstAfterRender() {
    },
    beforeDestory() {}
}

export class FormNormalComponent extends BiBaseComponent{
    constructor() {
        super(config);
        this.formGroup = {};

    }

    /**
     * 渲染chart fittings
     */
    renderFitting() {
        let base = new FormBaseComponent();
        let share = new FormMixShareComponent();
        this.append(base, this.el.find('.form-group-base'));
        this.append(share, this.el.find('.form-group-share'));

        this.formGroup['base'] = base;
        this.formGroup['share'] = share;
        const formGroup = {
            x: form.autoComplete
        };
        Object.keys(formGroup).map(type => {
            let component = new formGroup[type]();
            this.formGroup[type] = component;
            this.append(component, this.el.find('.form-group'))
        });
        this.formGroup.x.callBack = this.getChartField;
    }

    /**
     * 保存数据
     */
    save() {
        const data  = this.data.formGroup;
        return data;
    }


    /**
     * 获取x,y轴
     */
    async getChartField(tableId) {
        console.log(tableId);
        // if (tableId) {
        //     let res = await ChartFormService.getChartField(tableId);
        //     console.log(res);
        // } else {
        //     msgbox.alert('请先选择数据源')
        // };
    }
}