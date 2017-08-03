/**
 * Created by birdyy on 2017/7/31.
 */
import {BiBaseComponent} from '../../../bi.base.component';
import template from './cell.pie.html';
import {EchartsService} from '../../../../../services/bisystem/echart.server';



let config = {
    template: template,
    data: {
        id: 'pie',
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

export class CellPieComponent extends BiBaseComponent {
    constructor(cellChart) {
        config.data.cellChart = cellChart ? cellChart : null;
        super(config);
    }
}