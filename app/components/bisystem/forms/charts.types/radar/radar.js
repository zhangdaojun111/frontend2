/**
 * Created by birdyy on 2017/8/14.
 * 雷达图配置
 */

import {BiBaseComponent} from '../../../bi.base.component';
import template from './radar.html';
import {FormBaseComponent} from '../../base/base';
import {FormChartSourceComponent} from '../../chart.source/chart.source';
import {FormShareComponent} from '../../share/share';
import Mediator from '../../../../../lib/mediator';
import msgbox from "../../../../../lib/msgbox";
import {FormColumnComponent} from './columns/column';
import {canvasCellService} from '../../../../../services/bisystem/canvas.cell.service';
import {AutoCompleteComponent1} from '../../fittings/autocomplete1/autocomplete';
import {ChartFormService} from '../../../../../services/bisystem/chart.form.service';

let config = {
    template:template,
    data: {
        chart: {
            assortment: 'radar',
            chartName:{
                id: '',
                name: ''
            },
            countColumn:'',
            filter: [],
            columns:[],
            product:'',
            icon: '',
            source: '',
            theme: '',
        }
    },
    actions: {

    },
    afterRender() {
        this.init();

        // 获取数据源
        this.getChartSource();

        this.getChartData(this.data.chart.chartName.id);
    },
    firstAfterRender() {
        let me = this;



        // 保存雷达图数据
        this.el.on('click', '.save-radar-btn', (event) => {
            this.saveChart();
        });

        // 加载x，y轴数据
        this.el.on(`${this.data.chart.assortment}:fields:ready`, (event,params) => {
            this.loadData(params);
        })

    },
    beforeDestory() {}
};


export class FormRadarComponent extends BiBaseComponent{
    constructor(chart) {
        super(config);
        this.formGroup = {}
        this.data.chart.chartName.id = chart['id'];
        this.editModeOnce = this.data.chart.chartName.id ? true : false;
    }

    /**
     * 初始化操作
     */
    init() {
        this.formGroup['chartName'] = new FormBaseComponent(this.data.chart);
        this.append(this.formGroup['chartName'], this.el.find('.chart-form-group'));
        this.formGroup['source'] = new FormChartSourceComponent(this.data.chart);
        this.append(this.formGroup['source'], this.el.find('.chart-form-group'));
        this.formGroup['share'] = new FormShareComponent(this.data.chart);
        this.append(this.formGroup['share'], this.el.find('.chart-form-group'));
        this.formGroup['product'] = new AutoCompleteComponent1({'title': '选择雷达图名称字段'});
        this.append(this.formGroup['product'],this.el.find('.chart-form-group'));
        this.formGroup['columns'] = new FormColumnComponent(this.data.chart);
        this.append(this.formGroup['columns'], this.el.find('.chart-form-group'));
    }

    /**
     * 获取图表数据源
     */
    async getChartSource() {
        let res = await ChartFormService.getChartSource();
        if (res['success'] === 1) {
            this.chartSourceFinish(res['data']);
        } else {
            msgbox.alert(res['error']);
        };
    }

    /**
     * 编辑模式发送chartId, 得到服务器数据
     * @param chartId 图表id
     */
    async getChartData(chartId) {
        if (chartId) {
            const chart = await canvasCellService.getCellChart({chart_id: chartId});
            this.data.chart = chart[0];
        }
    }
    /**
     * 填充图表数据
     * @param chart = this.data.chart
     */
    fillChart(){
       this.formGroup['chartName'].setValue(this.data.chart.chartName);
       this.formGroup['share'].setValue(this.data.chart);
       this.formGroup['product'].setValue(this.data.chart.product);
       this.formGroup['columns'].setValue(this.data.chart.columns);
    }

    /**
     * 当获取数据源后
     */
    chartSourceFinish(data) {
        this.formGroup['source'].setItems(data);
        console.log(this.data.chart.source);
        this.formGroup['source'].setValue(this.data.chart.source);
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
        data['product'] = fields.product.getValue();
        const chart = {
            assortment: 'radar',
            chartName:data.chartName,
            countColumn:'',
            filter: [],
            columns:data.columns,
            product:data.product,
            icon: data.share.icon,
            source: data.source,
            theme: data.share.theme,
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
     * 根据数据源加载radar数据
     * @param data = x轴数据
     */
    loadData(data) {
        if (data['data']['x_field']) {
            this.formGroup.product.setItems(data['data']['x_field']);
        } else {
            this.formGroup.product.setItems(data['data']['x_field'], '');
        };
        this.formGroup.columns.reloadUi(data['data']);
        if (this.editModeOnce && this.data.chart['chartName']['id']) {
            this.fillChart();
            this.editModeOnce = false;
        }
    }


    /**
     * reset实例，当通过路由重新进入实例，清空所有数据
     */
    reset(chart) {
        this.data.chart.chartName.id = chart['id'];
        this.editModeOnce = this.data.chart.chartName.id ? true : false;
    }

}