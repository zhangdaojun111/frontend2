/**
 * Created by birdyy on 2017/8/16.
 * title: chart mix混合组件(包括数据源，选择颜色，选中图标，高级查询)
 */

import {BiBaseComponent} from '../../bi.base.component';
import template from './mix.share.html';
import {fittings as form} from '../fittings/export.fittings';
import './mix.share.scss';
import {ChartFormService} from '../../../../services/bisystem/chart.form.service';
import msgbox from "../../../../lib/msgbox";

let config = {
    template: template,
    data: {
    },
    actions: {},
    afterRender() {},
    firstAfterRender() {
        this.renderFitting();
        this.getChartSource();
        this.getChartIcon();
    }
};

export class FormMixShareComponent extends BiBaseComponent {
    constructor() {
        super(config);
        this.mixForm = {}
    }


    /**
     * 渲染chart fittings
     */
    renderFitting() {
        const formGroup = {
            chartSource:form.autoComplete,
            themes: form.radio,
            icons: form.radio
        };
        Object.keys(formGroup).map(key => {
            let component;
            if (key === 'themes') {
                const data = {
                    name: 'theme',
                    value:null,
                    radios:[
                        {value:'blue', name:'蓝色'},
                        {value: 'green',name: '绿色'},
                        {value: 'grayBlue', name:'灰蓝色'}
                    ]
                };
                component = new formGroup[key](data);
            } else {
                component = new formGroup[key]();
            }
            this.mixForm[key] = component;
            this.append(component, this.el.find('.chart-mix-share'))
        })
    }

    /**
     * 获取图表数据源
     */
    async getChartSource() {
        let res = await ChartFormService.getChartSource();
        if (res['success'] === 1) {
            this.mixForm.chartSource.autoSelect.data.list = res['data'];
            this.mixForm.chartSource.autoSelect.reload();
        } else {
            msgbox.alert(res['error']);
        }
    }

    /**
     * 获取图表图标
     */
    async getChartIcon() {
        let res = await ChartFormService.getChartIcon();
        if (res['success'] === 1) {
            const data = {
                name: 'icon',
                value:null,
                radios:res['data'].map(icon => {
                    return {value: icon,name:`<img src=/bi/download_icon/?file_id=${icon} />`}
                })
            };
            this.mixForm.icons.data = data;
            this.mixForm.icons.reload();
        } else {
            msgbox.alert(res['error']);
        }
    }

}