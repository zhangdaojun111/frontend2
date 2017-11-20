/**
 * Created by birdyy on 2017/7/31.
 */
import {BiBaseComponent} from '../../../../../bi.base.component';
import template from './cell.funnel.html';
import {EchartsService} from '../../../../../../../services/bisystem/echart.server';
import Mediator from '../../../../../../../lib/mediator';


let config = {
    template: template,
    data: {
        id: 'funnel',
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
};

export class CellFunnelComponent extends BiBaseComponent {
    constructor(cellChart,extendConfig) {
        config.data.cellChart = cellChart ? cellChart : null;
        super($.extend(true,{},config,extendConfig));
        this.data.id += this.componentId
    }
}