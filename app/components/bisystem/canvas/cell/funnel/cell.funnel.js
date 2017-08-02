/**
 * Created by birdyy on 2017/7/31.
 */
import {BiBaseComponent} from '../../../bi.base.component';
import template from './cell.funnel.html';
import {EchartsService} from '../../../../../services/bisystem/echart.server';



let config = {
    template: template,
    data: {
        id: 'funnel',
        cellChart: {}
    },
    actions: {
        echartsInit() {
            let echartsService = new EchartsService(this.data)
        }
    },
    firstAfterRender() {
        this.actions.echartsInit()
    }
}

export class CellFunnelComponent extends BiBaseComponent {
    constructor(cellChart) {
        config.data.cellChart = cellChart ? cellChart : null;
        super(config);
    }
}