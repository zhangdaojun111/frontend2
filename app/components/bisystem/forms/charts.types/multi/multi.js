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
import {ChartFormService} from '../../../../../services/bisystem/chart.form.service';
import {canvasCellService} from '../../../../../services/bisystem/canvas.cell.service';

import "./multi.scss";

let config = {
    template:template,
    data: {
        assortment: '',
        sources: []
    },
    actions: {},
    afterRender() {
        this.renderFitting();
    },
    firstAfterRender() {

        // 监听数据源变化
        this.el.on(`${this.data.assortment}-chart-source`,(event,params) => {
            this.chartSourceChange(params['sources']);
            return false;
        }).on(`${this.data.assortment}-chart-editMode-source`, (event,params) => {
            // 编辑模式
            if (this.chartId && this.editModeOnce) {
                this.getChartData(this.chartId);
            }
        });

        this.el.on('form-multilist-remove',(event,params) => {
            _.remove(this.formGroup.multiMulti, (comp) => {
                return comp.componentId == params['componentId']
            });
        })

        this.el.on('click','.multi-add-btn',()=>{
            this.multiAdd();
            return false;
        })

        this.el.on('click','.save-multi-btn',()=>{
            this.saveChart();
            return false;
        })
    }
}
export class FormMultiComponent extends BiBaseComponent{
    constructor(chart) {
        super(config);
        this.data.assortment = chart.assortment;
        this.chartId = chart.id;
        this.formGroup = {};
        this.editModeOnce = this.chartId ? true : false;
        this.editChart = null;
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
        this.formGroup.multiName.setValue(chart['chartName']);
        let share = {
            chartSource:chart['source'],
            themes: chart['theme'],
            icons: chart['icon'],
            filter: chart['filter']
        };
        this.formGroup.multiShare.setValue(share, true);
        chart['sources'].forEach(source => {
            this.multiAdd(source);
        });
    }

    /**
     * 渲染multi fittings
     */
    renderFitting(){
        let base = new FormBaseComponent();
        let share = new FormMixShareComponent(this.data.assortment);
        this.append(base, this.el.find('.multi-base'));
        this.append(share, this.el.find('.multi-share'));
        this.formGroup = {
            multiName:base,
            multiShare:share,
            multiMulti:[],
        };
    }

    /**
     * 增加一张图表
     */
    multiAdd(c){
        const data = c ? c : null;
        let chart = new MultiChartComponent(data);
        this.append(chart,this.el.find('.add-charts'));
        if (this.data.sources.length > 0) {
            chart.multiChart.multiSource.autoSelect.data.list = this.data.sources;
            if (chart.data['sources']) {
                chart.fillChart();
            }
            chart.multiChart.multiSource.autoSelect.reload();
        };

        this.formGroup.multiMulti.push(chart);
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

    /**
     * 数据源变化执行一些列动作
     * @param sources = 数据源数据
     */
    chartSourceChange(sources) {
        if (this.formGroup.multiShare) {
            this.data.sources = this.formGroup.multiShare.mixForm.chartSource.autoSelect.data.list;
            if (!this.editModeOnce) {
                this.multiAdd();
            };
            this.formGroup.multiMulti.forEach((item,index) => {
                item.multiChart.multiSource.autoSelect.data.choosed = [];
                item.multiChart.multiSource.autoSelect.data.list = this.data.sources;
                item.multiChart.multiSource.autoSelect.reload();
            })
        }
    }

    /**
     * 保存多表数据
     */
    async saveChart() {
        const fields  = this.formGroup;
        const data = {};
        const sources = [];
        fields.multiMulti.forEach(chart => {
            sources.push(chart.getValue());
        });

        Object.keys(fields).map(k => {
            if (fields[k].getValue) {
                data[k] = fields[k].getValue();
            };
        });
        const chart = {
            assortment: 'multilist',
            chartName: data.multiName,
            icon: data.multiShare.icons,
            theme: data.multiShare.themes,
            sources: sources
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
}