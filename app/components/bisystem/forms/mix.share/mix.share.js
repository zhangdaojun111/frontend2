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
        assortment: ''
    },
    actions: {},
    afterRender() {},
    firstAfterRender() {
        this.renderFitting();
        let p1 = this.getChartSource();
        let p2 = this.getChartIcon();
        Promise.all([p1,p2]).then((result) => {
            this.messager(`${this.data.assortment}-chart-editMode-source`, {'sources': []});
            Mediator.publish('bi:chart:form:update', {type:'source_icon_load_finish', data:[]});
        })
    }
};

export class FormMixShareComponent extends BiBaseComponent {
    constructor(chart) {
        super(config);
        this.mixForm = {};
        this.data.assortment = chart;
    }


    /**
     * 渲染chart fittings
     */
    renderFitting() {
        const search = new FormSearchComponent();
        this.append(search, this.el.on('.chart-mix-share'));

        this.mixForm = {
            chartSource:instanceFitting({
                type:'autoComplete',
                me: this,
                data: {
                    label: '请选择数据来源',
                    onSelect: this.getChartField.bind(this)
                },
                container: 'chart-mix-share' }),
            themes: instanceFitting({
                type:'radio',
                me: this,
                data:{
                    value:null,
                    radios:[
                        {value:'blue', name:'蓝色'},
                        {value: 'green',name: '绿色'},
                        {value: 'grayBlue', name:'灰蓝色'}
                    ]
                },
                container: 'chart-mix-share' }),
            icons: instanceFitting({
                type:'radio',
                me: this,
                data: {
                    radios:[]
                },
                container: 'chart-mix-share' }),
            filter: search
        };
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
        };
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
        let data;
        if (table) {
            let res = await ChartFormService.getChartField(table.id);
            if (res['success'] === 1) {
                data = res['data'];
            } else {
                msgbox.alert(res['error']);
            }
        } else {
            data = [];
        };
        this.messager(`${this.data.assortment}-chart-source`, {'sources': data});
        Mediator.publish('bi:chart:form:update', {type:'fields', data:data});
    }

    /**
     * 设置mix.share value
     */
    setValue(val) {
        this.mixForm.chartSource.setValue(val['chartSource']);
        this.mixForm.themes.setValue(val['themes']);
        this.mixForm.icons.setValue(val['icons']);
        this.mixForm.filter = val['filter'];
    }

    /**
     * 获取数据mix.share value
     */
    getValue() {
        const data = {};
        Object.keys(this.mixForm).map(field => {
            if (this.mixForm[field].getValue) {
                data[field] = this.mixForm[field].getValue();
            }
        });
        return data;
    }

}