/**
 * Created by birdyy on 2017/7/31.
 */
import {BiBaseComponent} from '../../../../../bi.base.component';
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

export class CellMultiChartComponent extends BiBaseComponent {
    constructor(cellChart) {
        config.data.cellChart = cellChart ? cellChart : null;
        super(config);
        this.data.id += this.componentId;
    }
}