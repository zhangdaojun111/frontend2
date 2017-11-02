/**
 * Created by birdyy on 2017/7/31.
 */
import {CellBaseComponent} from '../base';
import template from './cell.stylzie.html';
import {EchartsService} from '../../../../../../../services/bisystem/echart.server';
import Mediator from '../../../../../../../lib/mediator';

let config = {
    template: template,
    data: {
        id: 'stylzie',
        cellChart: {}
    },
    actions: {
        echartsInit() {
            // let cellChart = this.data.cellChart.chart;
            let echartsService = new EchartsService(this.data);
            this.myChart = echartsService.myChart;
        }
    },
    afterRender() {
        Mediator.subscribe(`bi:cell${this.componentId}:resize`, (data) => {
            if (this.myChart) {
                this.myChart.resize();
            }
        })
    },
    firstAfterRender() {

        this.actions.echartsInit()
    }
}

export class CellStylzieComponent extends CellBaseComponent {
    // constructor(cellChart) {
    //     config.data.cellChart = cellChart ? cellChart : null;
    //     super(config);
    //     this.data.id += this.componentId
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