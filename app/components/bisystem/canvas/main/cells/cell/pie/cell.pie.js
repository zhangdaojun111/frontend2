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
        deeps:0,
        floor:0,
        xAxis: [], //每一层的下穿字段
        xOld: [], //保存历史数据x轴字段
    },
    actions: {
        echartsInit() {
            let echartsService = new EchartsService(this.data);
            this.pieChart = echartsService;
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
                    view_id: this.data.cellChart.viewId,
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
                const res = await this.pieChart.getDeepData(data);
                if (res[0]['success'] === 1) {
                    if (res[0]['data']['data']['xAxis'].length > 0 && res[0]['data']['data']['yAxis'].length > 0) {
                        this.data.cellChart['chart']['data']['xAxis'] = res[0]['data']['data']['xAxis'];
                        this.data.cellChart['chart']['data']['yAxis'] = res[0]['data']['data']['yAxis'];
                        //重新渲染echarts
                        const option = this.pieChart.pieOption(this.data.cellChart);
                        this.pieChart.myChart.setOption(option);
                        this.pieChart.myChart.resize();
                    }
                } else {
                    msgbox.alert(res[0]['error']);
                }

            } else {
                if (next) {
                    this.data.floor = deeps;
                };
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
}

export class CellPieComponent extends CellBaseComponent {
    constructor(data,event) {
        super(config,data,event);
        this.actions.initPie();
    }
}