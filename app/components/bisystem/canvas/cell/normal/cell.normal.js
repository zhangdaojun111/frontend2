/**
 * Created by birdyy on 2017/7/31.
 */
import {BiBaseComponent} from '../../../bi.base.component';
import template from './cell.normal.html';
import './cell.normal.scss';

import {EchartsService} from '../../../../../services/bisystem/echart.server';
import Mediator from '../../../../../lib/mediator';

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
        echartsInit() {
            let echartsService = new EchartsService(this.data);
            this.normalChart = echartsService;
        }
    },
    afterRender() {
        Mediator.subscribe(`bi:cell${this.componentId}:resize`, (data) => {
            this.normalChart.myChart.resize();
        });

        // 返回下穿数据(上一层)
        Mediator.subscribe(`bi:deep${this.componentId}:cell`, (data) => {
            this.CanvasDeep(this.data.xAxis[this.data.floor], false);
        });
        // 下穿数据
        this.normalChart.myChart.on('click', (params) => {
            let deepX =params.name;
            this.CanvasDeep(deepX);
        });

    },
    firstAfterRender() {
        this.actions.echartsInit()
    }
}

export class CellNormalComponent extends BiBaseComponent {
    constructor(cellChart) {
        config.data.cellChart = cellChart ? cellChart : null;
        super(config);
        this.initNormal();
    }

    /**
     * 初始化pie图表数据
     */
    initNormal() {
        this.data.id += this.componentId;
        this.data.deeps = this.data.cellChart.chart.deeps.length;
    }

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
            deep_info[this.data.floor] = this.data['xAxis'];
            const layouts = {
                'layout_id': this.data.cellChart.cell.layout_id,
                'deep_info':deep_info,
                'floor':this.data.floor,
                'view_id': this.data.cellChart.cell.canvas.viewId,
                'xAxis': JSON.stringify(this.data['xAxis']),
                'chart_id':this.data.cellChart.cell.chart_id,
                'xOld': JSON.stringify(this.data.xOld)
            };
            const data = {
                'layouts': [JSON.stringify(layouts)],
                'query_type': 'deep',
                'is_deep': 0
            };
            console.log(data);
            const res = await this.pieChart.getDeepData(data);
            console.log(res);
            if (res[0]['success'] === 1) {
                if (res[0]['data']['xAxis'].length > 0 && res[0]['data']['yAxis'].length > 0) {
                    this.data.cellChart['chart']['data']['xAxis'] = res[0]['data']['xAxis'];
                    this.data.cellChart['chart']['data']['yAxis'] = res[0]['data']['yAxis'];
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
}
