/**
 * Created by birdyy on 2017/7/31.
 */
import {CellBaseComponent} from '../base';
import template from './cell.pie.html';
import {EchartsService} from '../../../../../../../services/bisystem/echart.server';
import Mediator from '../../../../../../../lib/mediator';
import msgbox from '../../../../../../../lib/msgbox';

let config = {
    template: template,
    data: {
        id: 'pie',
        cellChart: {},
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
                }
            });
            yAxis.forEach((item) => {
                let itemData = [];
                item.data.forEach((val,index,arrays) => {
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
            let chartData;
            if (window.config.bi_user === 'client') { // 如果是客户模式下，优先渲染原始数据
                if (this.data.cellChart.cell.attribute.length > 0 && this.data.cellChart.cell.select.length > 0) {
                    let cellChart = this.actions.handleOriginal();
                    chartData = _.cloneDeep(this.data);
                    chartData.cellChart = cellChart;
                }
            }
            //设置echarts渲染容器尺寸
            if(window.config.pdf){
                let data = chartData ? chartData : this.data;
                let width = data.cell.size.width - 20;
                let height = data.cell.size.height - 30;
                this.el.find('#' + data.id).css('width',width).css('height',height);
            }

            let echartsService = new EchartsService(chartData ? chartData : this.data);
            this.pieChart = echartsService;
            this.trigger('onUpdateChartDeepTitle',this.data);
        },

        updateChart(data) {
            //重新渲染echarts
            const option = this.pieChart.pieOption(data);
            this.pieChart.myChart.setOption(option,true);
        },
        /**
         * 初始化pie图表数据
         */
        initPie() {
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
                }
                this.data.floor--;
            }
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
                    layout_id:  this.data.cellChart.cell.layout_id,
                    xOld: this.data.xOld,
                    row_id:0,
                    deep_info: deep_info,

                };
                const data = {
                    'layouts': [JSON.stringify(layouts)],
                    'query_type': 'deep',
                    'is_deep': window.config.bi_user === 'manager' ? 1 : 0,
                };
                const res = await this.pieChart.getDeepData(data);
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
                }

            } else {
                if (next) {
                    this.data.floor = deeps;
                }
                return false;
            }

        }
    },
    afterRender() {
        // 下穿数据
        this.pieChart.myChart.on('click', (params) => {
            let deepX = params.name;
            this.actions.CanvasDeep(deepX);
            return false;
        });
    },
    firstAfterRender() {
        this.actions.echartsInit();

        Mediator.subscribe(`bi:cell${this.componentId}:resize`, (data) => {
            this.pieChart.myChart.resize();
        });

        // 返回下穿数据(上一层)
        Mediator.subscribe(`bi:deep${this.componentId}:cell`, (data) => {
            this.actions.CanvasDeep(this.data.xAxis[this.data.floor], false);
        });
    }
};

export class CellPieComponent extends CellBaseComponent {
    constructor(data,event,extendConfig) {
        super($.extend(true,{},config,extendConfig),data,event);
        this.actions.initPie();
    }

    /**
     * 当原始数据改变时，同步this.data
     * @param data
     */
    updateOriginal(data) {
        this.data.cellChart.cell.attribute = data.attribute;
        this.data.cellChart.cell.select = data.select;
        let cellChart = this.actions.handleOriginal();
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
            layout_id:  this.data.cellChart.cell.layout_id,
            xOld: this.data.xOld,
            row_id:0,
            deep_info: deep_info,
            sort: JSON.stringify(sort)
        };
        const data = {
            'layouts': [JSON.stringify(layouts)],
            'query_type': 'deep',
            'is_deep': window.config.bi_user === 'manager' ? 1 : 0,
        };
        const res = await this.pieChart.getDeepData(data);
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
        }
        return Promise.resolve(this.data);
    }
}
