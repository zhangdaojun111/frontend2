/**
 * Created by birdyy on 2017/7/31.
 */
import {CellBaseComponent} from '../base';
import template from './cell.normal.html';
import './cell.normal.scss';

import {EchartsService} from '../../../../../../../services/bisystem/echart.server';
import Mediator from '../../../../../../../lib/mediator';

let config = {
    template: template,
    data: {
        id: `normal`,
        cellChart: {},
        deeps:0,
        floor:0,
        xAxis: [], //每一层的下穿字段
        xOld: [], //保存历史数据x轴字段
    },
    actions: {
        /**
         * 当有原始数据保存的时候，优先处理原始数据
         */
        handleOriginal() {
            let cellChart = _.cloneDeep(this.data.cellChart);
            let [xAxis,yAxisRemoveDataIndex] = [[],[]];
            this.data.cellChart.cell.select.forEach((item,index) => {
                let val = JSON.parse(item);
                if (val.select) {
                    xAxis.push(val.name);
                } else {
                    yAxisRemoveDataIndex.push(index);
                }
            });
            let yAxis = [];
            this.data.cellChart.cell.attribute.map((item,index) => {
                if (JSON.parse(item).selected) {
                    yAxis.push(cellChart['chart']['data']['yAxis'][index])
                };
            });

            yAxis.forEach((item) => {
                let itemData = [];
                item.data.forEach((val,index,arrays) => {
                    let isRemove = yAxisRemoveDataIndex.indexOf(index);
                    if (isRemove === -1) {
                        itemData.push(val)
                    };
                });
                item.data = itemData;
            });
            cellChart['chart']['data']['xAxis'] = xAxis;
            cellChart['chart']['data']['yAxis'] = yAxis;
            return cellChart;
        },


        echartsInit() {
            let chartData;
            if (window.config.bi_user === 'client') { // 如果是客户模式下，优先渲染原始数据

                // 当attribute or select　等于空时　代表全选
                if (this.data.cellChart.chart.chartGroup.id && this.data.cellChart.cell.select.length > 0) {
                    chartData = _.cloneDeep(this.data);
                    let ename = [];
                    chartData.cellChart.cell.select.map(item => {
                        if (!JSON.parse(item).selected) {
                            ename.push(JSON.parse(item).ename)
                        };
                    });
                    let groups = chartData.cellChart.chart.data.yAxis.filter((item,index,items) => {
                        return ename.toString().indexOf(item.ename) === -1;
                    });

                    chartData.cellChart.chart.data.yAxis = groups;

                } else {
                    if (this.data.cellChart.cell.attribute.length > 0 && this.data.cellChart.cell.select.length > 0) {
                        let cellChart = this.actions.handleOriginal();
                        chartData = _.cloneDeep(this.data);
                        chartData.cellChart = cellChart;
                    };
                }
            };
            let echartsService = new EchartsService(chartData ? chartData : this.data);
            this.normalChart = echartsService;
            this.trigger('onUpdateChartDeepTitle',this.data);
        },
        updateChart(data) {
            //重新渲染echarts
            const option = this.normalChart.lineBarOption(data);
            this.normalChart.myChart.setOption(option,true);
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
        async CanvasDeep(deepX, next=true) {
            let deeps = this.data.deeps;
            if (next) {
                this.data.floor++;
            } else {
                if (this.data.floor===0) {
                    return false;
                };
                this.data.floor--;
            };
            // 判断是否到最大下穿层数
            if (deeps > this.data.floor-1 ) {
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
                };
                if (this.data.floor == 0) {
                    deep_info = {}
                } else {
                    deep_info[this.data.floor] = this.data['xAxis'];
                };

                const layouts = {
                    chart_id: this.data.cellChart.cell.chart_id,
                    floor: this.data.floor,
                    view_id: this.data.viewId,
                    layout_id:  this.data.cellChart.cell.layout_id,
                    xOld: this.data.xOld,
                    row_id:0,
                    deep_info: deep_info,

                };
                const data = {
                    'layouts': [JSON.stringify(layouts)],
                    'query_type': 'deep',
                    'is_deep': window.config.bi_user === 'manager' ? 1 : 0
                };
                const res = await this.normalChart.getDeepData(data);
                if (res[0]['success'] === 1) {
                    if (res[0]['data']['data']['xAxis'].length > 0 && res[0]['data']['data']['yAxis'].length > 0) {
                        this.data.cellChart['chart']['data']['xAxis'] = res[0]['data']['data']['xAxis'];
                        this.data.cellChart['chart']['data']['yAxis'] = res[0]['data']['data']['yAxis'];
                        this.data.cellChart['cell']['attribute'] = [];
                        this.data.cellChart['cell']['select'] = [];
                        this.actions.updateChart(this.data.cellChart);
                        this.trigger('onUpdateChartDeepTitle',this.data);
                    }
                } else {
                    msgbox.alert(res[0]['error']);
                };

            } else {
                if (next) {
                    this.data.floor = deeps;
                };
                return false;
            }
        }


    },
    afterRender() {
        Mediator.subscribe(`bi:cell${this.componentId}:resize`, (data) => {
            this.normalChart.myChart.resize();
        });

        // 返回下穿数据(上一层)
        Mediator.subscribe(`bi:deep${this.componentId}:cell`, (data) => {
            this.actions.CanvasDeep(this.data.xAxis[this.data.floor], false);
        });
        // 下穿数据
        this.normalChart.myChart.on('click', (params) => {
            let deepX =params.name;
            this.actions.CanvasDeep(deepX);
        });

    },
    firstAfterRender() {
        this.actions.echartsInit();
    },
    beforeDestory() {

    }
}

export class CellNormalComponent extends CellBaseComponent {
    constructor(data,event) {
        super(config,data,event);
        this.actions.initNormal();
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
                let groups = cellChart.chart.data.yAxis.filter((item,index,items) => {
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
}
