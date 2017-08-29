/**
 * Created by birdyy on 2017/8/14.
 * 表格图表配置
 */

import {BiBaseComponent} from '../../../bi.base.component';
import template from './table.html';
import {FormBaseComponent} from '../../base/base';
import {instanceFitting, groupFitting} from '../../fittings/export.fittings';
import Mediator from '../../../../../lib/mediator';
import msgbox from "../../../../../lib/msgbox";
import {FormMixShareComponent} from '../../mix.share/mix.share';
import {ChartFormService} from '../../../../../services/bisystem/chart.form.service';
import {FormColumnComponent} from './columns/column';
import {FormSingleComponent} from './single/single';
import {canvasCellService} from '../../../../../services/bisystem/canvas.cell.service';

import '../../../../../assets/scss/bisystem/charts.types.scss';
import "./table.scss";

let config = {
    template:template,
    data: {
        assortment: '',

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
            this.chartSourceChange(params['sources'])
        }).on('form:table:column:choosed',(event,params) => { // 监听选中字段
            this.single.setColumns(params['choosed'])
        }).on(`${this.data.assortment}-chart-editMode-source`, (event,params) => {
            // 编辑模式
            if (this.chartId && this.editModeOnce) {
                this.getChartData(this.chartId);
            }
        });

        this.el.on('click', '.save-btn', (event) => {
            this.saveChart();
        });

        // 多行表格显示多少列
        this.el.on('change', '.form-group-show-columns input', function() {
            let num = parseInt($(this).val());
             if (num !== NaN) {
                 me.formGroup.countNum = num;
            };
        })

        // 判断是多行表格还是单行表格
        this.el.on('change', '.form-group-single .single-checkbox input', function(event) {
            let checked= $(this).is(':checked');
            me.formGroup.single = checked ? 1 : 0;
            if (me.formGroup.single == 1) {
                me.single.setColumns(me.columns.data.choosed);
            }
        })

        // 判断默认排序
        this.el.on('change', '.table-sort-columns .sort-group input', function() {
            let val = $(this).val();
            me.formGroup.sort = val;
        });

        // 表格对齐方式
        this.el.on('change', '.form-group-align select', function() {
            let align = $(this).val();
            me.formGroup.alignment = align;
        });

        this.el.on('change', '.single-checkbox input', function(event){
            let checked = $(this).is(':checked');
            me.singleConfig(checked);
        })
    },
    beforeDestory() {}
};

export class FormTableComponent extends BiBaseComponent{
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
        this.single = new FormSingleComponent();
        this.append(this.columns, this.el.find('.table-columns'));
        this.append(this.single, this.el.find('.form-group-single-columns'));
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
        if (chart['sort'] == 1) {
            this.el.find('.form-group-sort-columns .sort-group input').eq(0).attr('checked', 'checked');
        } else {
            this.el.find('.form-group-sort-columns .sort-group input').eq(1).attr('checked', 'checked');
        }
        this.el.find('.form-group-align select').val(chart['alignment']);
        this.el.find('.form-group-show-columns input').val(chart['countNum']);
        this.el.find('.form-group-single input').attr('checked', chart['single'] == 1 ? true : false);
        this.formGroup.single = chart['single'];
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
            countNum: 10,
            single:0,
            sort: -1,
            alignment: 'left',
            sortColumn:instanceFitting({
                type:'autoComplete',
                data: {
                    value:null,
                },
                me: this,
                container: 'form-group-sort-columns .table-sort-columns'
            }),
        };

    }

    /**
     * 单行配置
     */
    singleConfig(checked) {
        if (checked) {
            this.el.find('.form-group-show-columns').hide();
        } else {
            this.el.find('.form-group-show-columns').show();
        }
        this.single.data.show = checked;
        this.single.reload();
    }

    /**
     * 数据源变化执行一些列动作
     * @param sources = 数据源数据
     */
    chartSourceChange(sources) {
        this.columns.reloadUi(sources);
        if (this.editModeOnce && this.editChart) {
            if (sources['x_field'].length > 0) {
                this.columns.setValue(this.editChart['columns']);
                this.columns.choosed.data.choosed = this.editChart['columns'];
                this.columns.choosed.reload();
                if (this.editChart['single'] == 1) {
                    this.singleConfig(this.editChart['single'] == 1 ? true : false);
                    this.single.data.singleNum = this.editChart['columnNum'] ? this.editChart['columnNum'] : 1;
                    this.single.setColumns(this.columns.data.choosed);
                }
            }
        }

        if (this.formGroup.sortColumn) {
            if (this.formGroup.sortColumn.autoSelect) {
                this.formGroup.sortColumn.autoSelect.data.choosed = [];
                this.formGroup.sortColumn.autoSelect.data.list = sources['x_field'];
                this.formGroup.sortColumn.autoSelect.reload();

                if (this.editModeOnce && this.editChart) {
                        this.formGroup.sortColumn.setValue(this.editChart['sortColumns'][0])
                        this.editModeOnce = false;
                }
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
     * 保存表格数据
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
            assortment: 'table',
            chartName:data.chartName,
            countColumn:{},
            columns:Array.from(this.columns.data.choosed),
            icon: data.share.icons,
            source: data.share.chartSource,
            theme: data.share.themes,
            filter: [],
            countNum:fields.countNum,
            single:fields.single,
            singleColumnWidthList:[],
            sort: parseInt(fields.sort),
            sortColumns:data.sortColumn.hasOwnProperty('id') ? [data.sortColumn] : [],
            alignment:fields.alignment,
            columnNum:this.single.data.singleNum
        };
        console.log(chart);
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