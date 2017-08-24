/**
 * Created by birdyy on 2017/8/14.
 * 饼图配置
 */

import {BiBaseComponent} from '../../../bi.base.component';
import template from './pie.html';
import {FormBaseComponent} from '../../base/base';
import {instanceFitting, groupFitting} from '../../fittings/export.fittings';
import Mediator from '../../../../../lib/mediator';
import msgbox from "../../../../../lib/msgbox";
import {PMAPI} from '../../../../../lib/postmsg';
import {FormMixShareComponent} from '../../mix.share/mix.share';
import {SingleComponent} from './single/single';
import {MultipleComponent} from './multiple/multiple';
import {ChartFormService} from '../../../../../services/bisystem/chart.form.service';
import {canvasCellService} from '../../../../../services/bisystem/canvas.cell.service';

import './pie.scss';
let config = {
    template:template,
    data: {
        assortment: ''
    },
    actions: {},
    afterRender() {
        this.renderFitting();
    },
    firstAfterRender() {
        // 监听数据源变化
        this.el.on(`${this.data.assortment}-chart-source`,(event,params) => {
            this.chartSourceChange(params['sources']);
        }).on(`${this.data.assortment}-chart-editMode-source`, (event,params) => {
            // 编辑模式
            if (this.chartId && this.editModeOnce) {
                this.getChartData(this.chartId);
            }
        });

        // 保存饼图配置
        this.el.on('click', '.chart-pie .save-pie-btn', (event) => {
            this.saveChart();
            return false;
        })
    }
}
export class FormPieComponent extends BiBaseComponent{
    constructor(chart) {
        super(config);
        this.formGroup={};
        this.chartId = chart.id;
        this.data.assortment = chart.assortment;
        this.editModeOnce = this.chartId ? true : false;
        this.editChart = null;
    }

    /**
     * 渲染pie fittings
     */

    renderFitting(){
        let base = new FormBaseComponent();
        let share = new FormMixShareComponent(this.data.assortment);
        let single = new SingleComponent();
        let multiple = new MultipleComponent();
        this.append(base, this.el.find('.pie-base'));
        this.append(share, this.el.find('.pie-share'));
        this.append(single, this.el.find('.pie-single-columns'));
        this.append(multiple, this.el.find('.pie-multiple-columns'));

        this.formGroup = {
            pieName:base,
            pieShare:share,
            single:single,
            multiple:multiple,
            pieSingle:instanceFitting({
                type:'select',
                me: this,
                container: 'pie-single',
                data:{
                    value: '2',
                    label:'选择多条数据，单条数据',
                    options:[
                        {name:'多条', value:'2'},
                        {name:'单条', value:'1'},
                    ],
                    onChange:this.switchSingle.bind(this),
                }
            }),
            pieX:instanceFitting({
                type:'autoComplete',
                me: this,
                container: 'pie-x',
                data: {
                    label:'x轴字段'
                }
            }),
        };
    }

    /**
     * 编辑模式发送chartId, 得到服务器数据
     * @param chartId 图表id
     */
    async getChartData(chartId) {
        if (chartId) {
            const chart = await canvasCellService.getCellChart({chart_id: chartId});
            this.fillChart(chart[0]);
        }
    }

    /**
     * 编辑模式填充饼图数据
     * @param chart = 从服务器获取的chart配置数据
     */
    fillChart(chart) {
        console.log(chart);
        this.editChart = chart;
        this.formGroup.pieName.setValue(chart['chartName']);
        let share = {
            chartSource:chart['source'],
            themes: chart['theme'],
            icons: chart['icon'],
            filter: chart['filter']
        };
        this.formGroup.pieShare.setValue(share);
        this.formGroup.pieSingle.setValue(chart['pieType']['value']);
        this.switchSingle(chart['pieType']['value']);
    }

    /**
     * 切换 单条数据/多条数据
     * @param val == 1 单条  val ==2 多条
     */
    switchSingle(val){
        if(val == 1){
            this.formGroup.single.data.singleShow = '';
            this.formGroup.multiple.data.multipleShow = 'form-chart-pie-hide';
        }else{
            this.formGroup.single.data.singleShow = 'form-chart-pie-hide';
            this.formGroup.multiple.data.multipleShow = '';
        };
        this.formGroup.single.reload();
        this.formGroup.multiple.reload();

    }

    /**
     * 数据源变化执行一些列动作
     * @param sources = 数据源数据
     */
    chartSourceChange(sources) {
        if (this.formGroup.pieX) {
            // 加载x轴autoComplete
            if (this.formGroup.pieX.autoSelect) {
                this.formGroup.pieX.autoSelect.data.choosed = [];
                this.formGroup.pieX.autoSelect.data.list = sources['x_field'];
                this.formGroup.pieX.autoSelect.reload();
                if (this.editModeOnce && this.editChart) {
                    if (this.editChart.hasOwnProperty('chartName')) {
                        if (this.editChart['xAxis'].hasOwnProperty('id')) {
                            this.formGroup.pieX.setValue(this.editChart['xAxis'])
                        }
                    }
                }
            }
        };
        // 加载多条数据
        if (this.formGroup.multiple) {
            // 加载x轴autoComplete
            if (this.formGroup.multiple.multiples.pieY.autoSelect) {
                this.formGroup.multiple.multiples.pieY.autoSelect.data.choosed = [];
                this.formGroup.multiple.multiples.pieY.autoSelect.data.list = this.formGroup.multiple.data.yAxis = sources['y_field'];
                this.formGroup.multiple.multiples.pieDeep.autoSelect.data.choosed = [];
                this.formGroup.multiple.multiples.pieDeep.autoSelect.data.list = this.formGroup.multiple.data.xAxis = sources['x_field'];
                this.formGroup.multiple.data.deeps = [];
                this.formGroup.multiple.multiples.pieY.autoSelect.reload();
                this.formGroup.multiple.multiples.pieDeep.autoSelect.reload();
                if (this.editModeOnce && this.editChart && this.editChart['pieType']['value'] == 2) {
                    this.formGroup.multiple.multiples.pieY.setValue(this.editChart['yAxis']);
                    this.formGroup.multiple.multiples.deeps.data.deeps = this.editChart['deeps'];
                    this.formGroup.multiple.multiples.deeps.reload();
                    this.editModeOnce = false;
                }
            }
        };

        if (this.formGroup.single) {
            // 加载单条数据y轴数据
            this.formGroup.single.formYAxis.yAxis.data.checkboxs = sources['y_field'];
            this.formGroup.single.data['items'] = sources['y_field'];
            this.formGroup.single.formYAxis.yAxis.data['items']  = this.formGroup.single.data['checkboxs']= sources['y_field'];
            this.formGroup.single.formYAxis.yAxis.reload();
            if (this.editModeOnce && this.editChart) {
                this.formGroup.single.formYAxis.yAxis.setValue(this.editChart['yAxis']);
            }
        }

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
     * 提交饼图配置到服务器
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
            assortment: 'pie',
            chartName:data.pieName,
            chartType: {
                name: '饼图',
                type: 'pie'
            },
            countColumn:'',
            filter: [],
            pieType: data.pieSingle == '1' ? {name: '单条数据', value: 1} : {name: '多条数据', value: 2},
            relations: [],
            xAxis:data.pieX,
            icon: data.pieShare.icons,
            source: data.pieShare.chartSource,
            theme: data.pieShare.themes,
        };
        if (data.pieSingle == 1) {
            chart['yAxis'] = data.single;
            chart['deeps'] = []
        } else {
            chart['yAxis'] = data.multiple.yAxis;
            chart['deeps'] = data.multiple.deeps;
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