/**
 * Created by birdyy on 2017/8/14.
 */

import {BiBaseComponent} from '../../../bi.base.component';
import template from './normal.html';
import {FormBaseComponent} from '../../base/base';
import {fittings as form} from '../../fittings/export.fittings';
import {ChartFormService} from '../../../../../services/bisystem/chart.form.service';
import msgbox from "../../../../../lib/msgbox";

let config = {
    template:template,
    data: {},
    actions: {},
    afterRender() {
        this.renderFitting();
        this.getChartSource();
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
        this.append(base, this.el.find('.field'));
        this.formGroup['base'] = base;
        const formGroup = {
            source:form.autoComplete,
            x: form.input,
            y: form.input
        };
        Object.keys(formGroup).map(type => {
            let component = new formGroup[type]();
            this.formGroup[type] = component;
            this.append(component, this.el.find('.base'))
        })
    }

    /**
     * 保存数据
     */
    save() {
        const data  = this.data.formGroup;
        return data;
    }

    /**
     * 获取图表数据源
     */
    async getChartSource() {
        let res = await ChartFormService.getChartSource();
        if (res['success'] === 1) {
            this.formGroup.source.autoSelect.data.list = res['data'];
            this.formGroup.source.autoSelect.reload()
        } else {
            msgbox.alert(res['error']);
        }
    }
}