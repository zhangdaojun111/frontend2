/**
 * Created by birdyy on 2017/8/16.
 * title: chart mix混合组件(包括数据源，选择颜色，选中图标，高级查询)
 */

import {BiBaseComponent} from '../../bi.base.component';
import template from './mix.share.html';
import {instanceFitting} from '../fittings/export.fittings';
import './mix.share.scss';
import {ChartFormService} from '../../../../services/bisystem/chart.form.service';
import msgbox from "../../../../lib/msgbox";
import {FormSearchComponent} from '../search/search';
import Mediator from '../../../../lib/mediator';

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
        const themeData = {
            name: 'theme',
            value:null,
            radios:[
                {value:'blue', name:'蓝色'},
                {value: 'green',name: '绿色'},
                {value: 'grayBlue', name:'灰蓝色'}
            ]
        };
        this.mixForm = {
            chartSource:instanceFitting({type:'autoComplete',me: this,container: 'chart-mix-share' }),
            themes: instanceFitting({type:'radio',me: this, data: themeData,container: 'chart-mix-share' }),
            icons: instanceFitting({type:'radio',me: this,container: 'chart-mix-share' }),
            search: FormSearchComponent
        };
    }

    /**
     * 获取图表数据源
     */
    async getChartSource() {
        let res = await ChartFormService.getChartSource();
        if (res['success'] === 1) {
            this.mixForm.chartSource.autoSelect.data.list = res['data'];
            this.mixForm.chartSource.autoSelect.data.onSelect = this.getChartField;
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
    /**
     * 获取x,y轴
     */
    async getChartField(tableId) {
        const table = tableId.length > 0 ? tableId[0] : null;
        if (table) {
            let res = await ChartFormService.getChartField(table.id);
            if (res['success'] === 1) {
                Mediator.publish('bi:chart:form:fields', res['data']);
            } else {
                msgbox.alert(res['error']);
            }
        } else {
            Mediator.publish('bi:chart:form:fields:clear', []);
        }

    }

}