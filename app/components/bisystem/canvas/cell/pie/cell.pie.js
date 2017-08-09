/**
 * Created by birdyy on 2017/7/31.
 */
import {BiBaseComponent} from '../../../bi.base.component';
import template from './cell.pie.html';
import {EchartsService} from '../../../../../services/bisystem/echart.server';
import Mediator from '../../../../../lib/mediator';


let config = {
    template: template,
    data: {
        id: 'pie',
        cellChart: {}
    },
    actions: {
        echartsInit() {
            let echartsService = new EchartsService(this.data);
            this.myChart = echartsService.myChart;
        }
    },
    afterRender() {
        Mediator.subscribe(`bi:cell${this.componentId}:resize`, (data) => {
            this.myChart.resize();
        })
    },
    firstAfterRender() {
        this.actions.echartsInit();
    }
}

export class CellPieComponent extends BiBaseComponent {
    constructor(cellChart) {
        config.data.cellChart = cellChart ? cellChart : null;
        super(config);
        this.data.id += this.componentId
    }
}