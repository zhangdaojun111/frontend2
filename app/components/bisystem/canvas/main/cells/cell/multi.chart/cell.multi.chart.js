/**
 * Created by birdyy on 2017/7/31.
 */
import {CellBaseComponent} from '../base';
import template from './cell.multi.chart.html';
import {EchartsService} from '../../../../../../../services/bisystem/echart.server';
import Mediator from '../../../../../../../lib/mediator';

let config = {
    template: template,
    data: {
        id: 'multi-chart',
    },
    actions: {
        echartsInit() {
            let echartsService = new EchartsService(this.data);
            this.multiChart = echartsService;
        },

        updateChart(data) {
            //重新渲染echarts
            const option = this.multiChart.multiChartOption(data);
            this.multiChart.myChart.setOption(option,true);
        },
    },
    afterRender() {
        Mediator.subscribe(`bi:cell${this.componentId}:resize`, (data) => {
            this.data.cellChart.cell.size = data;
            const option = this.multiChart.multiChartOption(this.data.cellChart);
            const myChart = this.multiChart.myChart;
            myChart.setOption(option);
            myChart.resize();
        });
    },
    firstAfterRender() {
        this.actions.echartsInit()
    }
};

export class CellMultiChartComponent extends CellBaseComponent {
    // constructor(cellChart) {
    //     config.data.cellChart = cellChart ? cellChart : null;
    //     super(config);
    //     this.data.id += this.componentId;
    // }
    constructor(data,event,extendConfig) {
        data.cellChart = {
            cell: data.cell,
            chart: data.chart
        };
        super($.extend(true,{},config,extendConfig),data,event);
        this.data.id += this.componentId;
    }
}