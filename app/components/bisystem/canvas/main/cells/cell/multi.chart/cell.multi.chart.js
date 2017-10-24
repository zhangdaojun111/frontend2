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
            this.myChart = echartsService;
        }
    },
    afterRender() {
        Mediator.subscribe(`bi:cell${this.componentId}:resize`, (data) => {
            this.data.cellChart.cell.size = data;
            const option = this.myChart.multiChartOption(this.data.cellChart);
            const myChart = this.myChart.myChart;
            myChart.setOption(option);
            myChart.resize();
        });
    },
    firstAfterRender() {
        this.actions.echartsInit()
    }
}

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