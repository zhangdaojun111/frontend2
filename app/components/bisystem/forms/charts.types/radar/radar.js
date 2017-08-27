/**
 * Created by birdyy on 2017/8/14.
 * 雷达图配置
 */

import {BiBaseComponent} from '../../../bi.base.component';
import template from './radar.html';
import {FormBaseComponent} from '../../base/base';
import {instanceFitting, groupFitting} from '../../fittings/export.fittings';
import Mediator from '../../../../../lib/mediator';
import msgbox from "../../../../../lib/msgbox";
import {FormMixShareComponent} from '../../mix.share/mix.share';
import {ChartFormService} from '../../../../../services/bisystem/chart.form.service';
import {FormColumnComponent} from './columns/column';
import {canvasCellService} from '../../../../../services/bisystem/canvas.cell.service';

let config = {
    template:template,
    data: {
        assortment: ''
    },
    actions: {},
    afterRender() {
        this.init();
        this.renderFitting();
    },
    firstAfterRender() {
        let me = this;
        // 监听数据源变化
        this.el.on(`${this.data.assortment}-chart-source`,(event,params) => {
            this.chartSourceChange(params['sources']);
        }).on(`${this.data.assortment}-chart-editMode-source`, (event,params) => {
            // 编辑模式
            if (this.chartId && this.editModeOnce) {
                this.getChartData(this.chartId);
            }
        });

        this.el.on('click', '.save-radar-btn', (event) => {
            this.saveChart();
        });

    },
    beforeDestory() {}
};


export class FormRadarComponent extends BiBaseComponent{
    constructor(chart) {
        super(config);
        this.data.assortment = chart.assortment;
        this.chartId = chart.id;
        this.formGroup = {};
        this.editModeOnce = this.chartId ? true : false;
        this.editChart = null;
    }

    /**
     * 初始化操作
     */
    init() {
        this.columns = new FormColumnComponent();
        this.append(this.columns, this.el.find('.table-columns'));
    }

    /**
     * 编辑模式发送chartId, 得到服务器数据
     * @param chartId 图表id
     */
    async getChartData(chartId) {
        if (this.chartId) {
            const chart = await canvasCellService.getCellChart({chart_id: chartId});
            this.fillChart(chart[0])
        }
    }


    /**
     * 编辑模式
     */
    fillChart(chart) {
        this.editChart = chart;
        this.formGroup.chartName.setValue(chart['chartName']);
        let share = {
            chartSource:chart['source'],
            themes: chart['theme'],
            icons: chart['icon'],
            filter: chart['filter']
        };
        this.formGroup.share.setValue(share);

    }

    /**
     * 渲染chart fittings
     */
    renderFitting() {
        let base = new FormBaseComponent();
        let share = new FormMixShareComponent(this.data.assortment);
        this.append(base, this.el.find('.form-group-base'));
        this.append(share, this.el.find('.form-group-share'));

        this.formGroup = {
            chartName: base,
            share: share,
            product:instanceFitting({
                type:'autocomplete1',
                data: {
                    value:null,
                    label: '选中雷达图产品名称字段',
                },
                me: this,
                container: 'form-group-product'
            }),
            auto:instanceFitting({
                type:'autocomplete1',
                me:this,
                container:'form-group-auto',
                data: {
                    onSelect:null
                }
            })
        };

    }

    /**
     * 数据源变化执行一些列动作
     * @param sources = 数据源数据
     */
    chartSourceChange(sources) {
        this.columns.reloadUi(sources);
        if (this.formGroup.product) {
            console.log(this.formGroup.product.observable);
            // this.formGroup.product.observable.items = sources['x_field']

        };


        // 编辑模式使用因为要等到所有数据加载完成在填充部分数据
        if (this.editModeOnce && this.editChart) {
            this.columns.setValue(this.editChart['columns']);
            this.editModeOnce = false;
        };

        if (this.formGroup.auto) {
            this.formGroup.auto.setValue(sources['x_field']);
            console.log(this.formGroup.auto.data);
        }
    }

    /**
     * 保存雷达数据
     */
    async saveChart() {
        const fields  = this.formGroup;
        const data = {};
        Object.keys(fields).map(k => {
            if (fields[k].getValue) {
                data[k] = fields[k].getValue();
            };
        });
        const chart = {
            assortment: 'radar',
            chartName:data.chartName,
            countColumn:'',
            filter: [],
            columns:Array.from(this.columns.data.choosed),
            product:data.product,
            icon: data.share.icons,
            source: data.share.chartSource,
            theme: data.share.themes,
        };
        let res = await ChartFormService.saveChart(JSON.stringify(chart));
        if (res['success'] == 1) {
            msgbox.alert('保存成功');
            if (!chart['chartName']['id']) {
                this.reset();
                this.reload();
            };
            Mediator.publish('bi:aside:update',{type: chart['chartName']['id'] ? 'update' :'new', data:res['data']})
        } else {
            msgbox.alert(res['error'])
        };
    }

    /**
     * reset实例，当通过路由重新进入实例，清空所有数据
     */
    reset(chart) {
        this.formGroup = {};
        this.chartId = chart ? chart.id: null;
        this.editModeOnce = this.chartId ? true : false;
        this.editChart = null;
    }

}