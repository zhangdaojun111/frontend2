/**
 * Created by birdyy on 2017/7/31.
 */
import {CellBaseComponent} from '../base';
import template from './cell.normal.html';
import './cell.normal.scss';

import {EchartsService} from '../../../../../../../services/bisystem/echart.server';
import Mediator from '../../../../../../../lib/mediator';
import {NormalRangeComponent} from './range/range';

let config = {
    template: template,
    data: {
        id: `normal`,
        cellChart: {},
        deeps: 0,
        floor: 0,
        xAxis: [], //每一层的下穿字段
        xOld: [], //保存历史数据x轴字段
        x: [],//每一层下穿字段类型
    },
    actions: {
        /**
         * 获取（一周 一月 半年 一年 全部）获取数据
         * @param value {startValue:x轴第一个数据,endValue:x轴第2个数据,type:'week'}
         */
        async getChangeDateData(value) {
            let deep_info = {};
            deep_info[this.data.floor] = this.data['xAxis'];
            const layouts = {
                chart_id: this.data.cellChart.cell.chart_id,
                floor: this.data.floor,
                view_id: this.data.viewId,
                layout_id: this.data.cellChart.cell.layout_id,
                xOld: this.data.xOld,
                row_id: window.config.row_id,
                deep_info: deep_info,
                startValue: value['startValue'],
                endValue: value['endValue'],
                type: value['type']
            };
            const data = {
                'layouts': [JSON.stringify(layouts)],
                'query_type': 'deep',
                'is_deep': 1,
            };

            const res = await this.normalChart.getDeepData(data);
            if (res[0] && res[0].success === 1) {
                if (res[0]['data']['data']['xAxis'].length > 0 && res[0]['data']['data']['yAxis'].length > 0) {
                    let cellChart = _.cloneDeep(this.data.cellChart);
                    cellChart['chart']['data']['xAxis'] = res[0]['data']['data']['xAxis'];
                    cellChart['chart']['data']['yAxis'] = res[0]['data']['data']['yAxis'];
                    cellChart['chart']['data']['x'] = res[0]['data']['data']['x'];
                    cellChart['cell']['attribute'] = [];
                    cellChart['cell']['select'] = [];
                    this.actions.updateChart(cellChart);
                }
            }
        },
        /**
         * 两个控件的排列方式改变
         */
        arrangementChange(){
            if(this.el.find('.normal-date-range').width()<685){
                this.el.addClass('date-zoom-wrap');
            }else{
                this.el.removeClass('date-zoom-wrap');
            }
        },
        /**
         * 判断是否显示时间字段
         */
        judgeDateZoom(cellChart) {
            if (this.normalRange) {
                this.normalRange.destroySelf();
                this.normalRange = null;
                this.el.find('.echarts-cell').removeClass('date-filed');
            }
            let type = cellChart.chart.data['x'] ? cellChart.chart.data['x']['type'] : cellChart.chart.xAxis.type;
            if (!this.data.cellChart.chart['yHorizontal'] && (type == 3 || type == 5 || type == 12 || type == 30) && window.config.pdf !== true) {
                // 添加日期筛选,改变cell显示高度
                this.el.find('.echarts-cell').addClass('date-filed');
                this.normalRange = new NormalRangeComponent({
                    data: {
                        id: this.data.id
                    },
                    events: {
                        // 通过（一周 一月 半年 一年 全部）获取数据
                        onChangeDateData: (value) => {
                            this.actions.getChangeDateData(value);
                        }
                    }
                    });
                this.append(this.normalRange, this.el.find('.chart-normal-date-zoom'));
                this.normalRange.actions.rangeChoose(type);
                this.normalRange.actions.setDateValue(cellChart.chart.data.xAxis);
            }
            //两个控件的排列方式改变
            this.actions.arrangementChange();
        },
        /**
         * 当有原始数据保存的时候，优先处理原始数据
         */
        handleOriginal() {
            let cellChart = _.cloneDeep(this.data.cellChart);
            let [xAxis, yAxisRemoveDataIndex] = [[], []];
            this.data.cellChart.cell.select.forEach((item, index) => {
                let val = JSON.parse(item);
                if (val.select) {
                    xAxis.push(val.name);
                } else {
                    yAxisRemoveDataIndex.push(index);
                }
            });
            let yAxis = [];
            this.data.cellChart.cell.attribute.map((item, index) => {
                if (JSON.parse(item).selected) {
                    yAxis.push(cellChart['chart']['data']['yAxis'][index])
                }
            });

            yAxis.forEach((item) => {
                let itemData = [];
                item.data.forEach((val, index, arrays) => {
                    let isRemove = yAxisRemoveDataIndex.indexOf(index);
                    if (isRemove === -1) {
                        itemData.push(val)
                    }
                });
                item.data = itemData;
            });
            cellChart['chart']['data']['xAxis'] = xAxis;
            cellChart['chart']['data']['yAxis'] = yAxis;
            return cellChart;
        },

        echartsInit() {
            this.customAccuracy(this.data.cellChart.chart);
            let chartData;
            if (window.config.bi_user === 'client') { // 如果是客户模式下，优先渲染原始数据
                // 当attribute or select　等于空时　代表全选
                if (this.data.cellChart.chart.chartGroup.id && this.data.cellChart.cell.select.length > 0) {
                    chartData = _.cloneDeep(this.data);
                    let ename = [];
                    chartData.cellChart.cell.select.map(item => {
                        if (!JSON.parse(item).selected) {
                            ename.push(JSON.parse(item).ename)
                        }
                    });
                    let groups = chartData.cellChart.chart.data.yAxis.filter((item, index, items) => {
                        return ename.toString().indexOf(item.ename) === -1;
                    });

                    chartData.cellChart.chart.data.yAxis = groups;

                } else {
                    if (this.data.cellChart.cell.attribute.length > 0 && this.data.cellChart.cell.select.length > 0) {
                        let cellChart = this.actions.handleOriginal();
                        chartData = _.cloneDeep(this.data);
                        chartData.cellChart = cellChart;
                    }
                }
            }

            let cellChartData = this.data;
            if (cellChartData['cellChart']['chart']['yHorizontal']) {
                cellChartData['cellChart']['chart']['data']['xAxis'].reverse();
                cellChartData['cellChart']['chart']['data']['yAxis'].forEach(item => {
                    item.data.reverse();
                });
            }
            //设置echarts渲染容器尺寸
            if(window.config.pdf){
                let data = chartData ? chartData : this.data;
                let width = data.cell.size.width - 20;
                let height = data.cell.size.height - 30;
                this.el.find('#' + data.id).css('width',width).css('height',height);
            }

            let echartsService = new EchartsService(chartData ? chartData : this.data);
            this.normalChart = echartsService;
            this.trigger('onUpdateChartDeepTitle', this.data);
        },

        updateChart(data) {
            //重新渲染echarts
            const option = this.normalChart.lineBarOption(data);
            //重新获取外层容器大小
            this.normalChart.myChart.resize();
            this.normalChart.myChart.setOption(option, true);

        },
        /**
         * 初始化pie图表数据
         */
        initNormal() {
            this.data.cellChart = {
                cell: this.data.cell,
                chart: this.data.chart
            };
            this.data.id += this.componentId;
            this.data.deeps = this.data.cellChart.chart.deeps.length;
            this.data.floor = this.data.cellChart.cell.is_deep == 1 ? this.data.cellChart.cell.deep.floor : 0;
            this.data.xOld = this.data.cellChart.cell.is_deep == 1 ? this.data.cellChart.cell.deep.xOld : [];
            this.data.xAxis = this.data.cellChart.cell.is_deep == 1 ? this.data.cellChart.cell.deep.xOld.map(x => x['name']) : [];
        },

        /**
         * 获取下穿数据
         * @param deepX= 下穿的x轴字段，next ？ 下穿 ： 上传
         */
        async CanvasDeep(deepX, next = true) {
            let deeps = this.data.deeps;
            if (next) {
                this.data.floor++;
            } else {
                if (this.data.floor === 0) {
                    return false;
                }
                this.data.floor--;
            }
            // 判断是否到最大下穿层数
            if (deeps > this.data.floor - 1) {
                // 组装deep_info
                let deep_info = {};
                if (next) {
                    this.data['xAxis'].push(deepX);
                    this.data.xOld.push({
                        'xName': this.data.cellChart.chart.deeps[this.data.floor - 1].name,
                        'name': deepX
                    });
                } else {
                    this.data['xAxis'].pop();
                    this.data.xOld.pop();
                }
                if (this.data.floor == 0) {
                    deep_info = {}
                } else {
                    deep_info[this.data.floor] = this.data['xAxis'];
                }

                const layouts = {
                    chart_id: this.data.cellChart.cell.chart_id,
                    floor: this.data.floor,
                    view_id: this.data.viewId,
                    layout_id: this.data.cellChart.cell.layout_id,
                    xOld: this.data.xOld,
                    row_id: window.config.row_id,
                    deep_info: deep_info,
                };
                const data = {
                    'layouts': [JSON.stringify(layouts)],
                    'query_type': 'deep',
                    'is_deep': window.config.bi_user === 'manager' ? 1 : 0,
                };

                const res = await this.normalChart.getDeepData(data);
                if (res[0]['success'] === 1) {
                    if (res[0]['data']['data']['xAxis'].length > 0 && res[0]['data']['data']['yAxis'].length > 0) {
                        this.data.cellChart['chart']['data']['xAxis'] = res[0]['data']['data']['xAxis'];
                        this.data.cellChart['chart']['data']['yAxis'] = res[0]['data']['data']['yAxis'];
                        this.data.cellChart['chart']['data']['x'] = res[0]['data']['data']['x'];
                        this.data.cellChart['cell']['attribute'] = [];
                        this.data.cellChart['cell']['select'] = [];
                        if (window.config.bi_user !== 'manager') {
                            this.actions.judgeDateZoom(this.data.cellChart);
                        }
                        this.actions.updateChart(this.data.cellChart);
                        this.trigger('onUpdateChartDeepTitle', this.data);
                    }
                } else {
                    msgbox.alert(res[0]['error']);
                }

            } else {
                if (next) {
                    this.data.floor = deeps;
                }
                return false;
            }
        }


    },
    beforeRender(){
        this.actions.initNormal();
    },
    afterRender() {
        Mediator.subscribe(`bi:cell${this.componentId}:resize`, (data) => {
            let cellChart = _.cloneDeep(this.data);
            cellChart.cell.size = data;
            this.actions.updateChart(cellChart);
            this.normalChart.myChart.resize();
        });
        // 返回下穿数据(上一层)
        Mediator.subscribe(`bi:deep${this.componentId}:cell`, (data) => {
            this.actions.CanvasDeep(this.data.xAxis[this.data.floor], false);
        });
        // 下穿数据
        this.normalChart.myChart.on('click', (params) => {
            let deepX = params.name;
            this.actions.CanvasDeep(deepX);
        });
    },
    firstAfterRender() {
        // 是否显示时间字段
        if (window.config.bi_user !== 'manager') {
            this.actions.judgeDateZoom(this.data.cellChart);
        }

        this.actions.echartsInit();
    },
    beforeDestory() {

    }
};

export class CellNormalComponent extends CellBaseComponent {
    constructor(extendConfig) {
        super($.extend(true, {}, config, extendConfig));
    }

    /**
     * 当原始数据改变时，同步this.data
     * @param data
     */
    updateOriginal(data) {
        let cellChart;
        if (data.hideGroup) {
            this.data.cellChart.cell.attribute = null;
            this.data.cellChart.cell.select = data.originalData.select;
            cellChart = _.cloneDeep(this.data.cellChart);

            if (data.hideGroup.length > 0) {
                let ename = data.hideGroup.map(item => item.ename);
                let groups = cellChart.chart.data.yAxis.filter((item, index, items) => {
                    return ename.toString().indexOf(item.ename) === -1;
                });

                cellChart.chart.data.yAxis = groups;
            }

        } else {
            this.data.cellChart.cell.attribute = data.attribute;
            this.data.cellChart.cell.select = data.select;
            cellChart = this.actions.handleOriginal();
        }
        this.actions.updateChart(cellChart);
    }

    /**
     * 当原始数据点击下穿时，更新画布块数据
     * @param data
     */
    async updateOriginalDeep(name) {
        let res = await this.actions.CanvasDeep(name);
        return Promise.resolve(this.data);
    }

    /**
     * 当原始数据下穿排序
     * @param sort = {type: 'asc', filed:y轴字段对象}
     */
    async deepSort(sort) {
        let deep_info = {};
        if (this.data.floor == 0) {
            deep_info = {}
        } else {
            deep_info[this.data.floor] = this.data['xAxis'];
        }

        const layouts = {
            chart_id: this.data.cellChart.cell.chart_id,
            floor: this.data.floor,
            view_id: this.data.viewId,
            layout_id: this.data.cellChart.cell.layout_id,
            xOld: this.data.xOld,
            row_id: 0,
            deep_info: deep_info,
            sort: JSON.stringify(sort)
        };
        const data = {
            'layouts': [JSON.stringify(layouts)],
            'query_type': 'deep',
            'is_deep': window.config.bi_user === 'manager' ? 1 : 0,
        };
        const res = await this.normalChart.getDeepData(data);
        if (res[0]['success'] === 1) {
            if (res[0]['data']['data']['xAxis'].length > 0 && res[0]['data']['data']['yAxis'].length > 0) {
                this.data.cellChart['chart']['data']['xAxis'] = res[0]['data']['data']['xAxis'];
                this.data.cellChart['chart']['data']['yAxis'] = res[0]['data']['data']['yAxis'];
                this.data.cellChart['cell']['attribute'] = [];
                this.data.cellChart['cell']['select'] = [];
                this.actions.updateChart(this.data.cellChart);
                this.trigger('onUpdateChartDeepTitle', this.data);
            }
        } else {
            msgbox.alert(res[0]['error']);
        }
        return Promise.resolve(this.data);
    }
}

CellNormalComponent.config = config;