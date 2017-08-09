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
        this.actions.echartsInit()
    }
}

export class CellNormalComponent extends BiBaseComponent {
    constructor(cellChart) {
        config.data.cellChart = cellChart ? cellChart : null;
        super(config);
        this.data.id += this.componentId
    }
}
