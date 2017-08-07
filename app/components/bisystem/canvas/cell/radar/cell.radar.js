/**
 * Created by birdyy on 2017/7/31.
 */
import {BiBaseComponent} from '../../../bi.base.component';
import template from './cell.radar.html';
import {EchartsService} from '../../../../../services/bisystem/echart.server';



let config = {
    template: template,
    data: {
        id: 'radar',
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

export class CellRadarComponent extends BiBaseComponent {
    constructor(cellChart) {
        config.data.cellChart = cellChart ? cellChart : null;
        super(config);
        this.data.id += this.componentId
    }
}
