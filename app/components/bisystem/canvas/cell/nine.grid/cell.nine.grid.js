/**
 * Created by birdyy on 2017/7/31.
 */
import {BiBaseComponent} from '../../../bi.base.component';
import template from './cell.nine.grid.html';
import "./cell.nine.grid.scss";

let config = {
    template: template,
    data: {
        cellChart: {},
        types: [], // 9 or 16
        grids: []
    },
    actions: {
        init(cell) {}
    },
    firstAfterRender() {
        this.actions.init()
    }
}

export class CellNineGridComponent extends BiBaseComponent {
    constructor(cellChart) {
        config.data.cellChart = cellChart ? cellChart : null;
        config.data.types = new Array(cellChart['chart']['type']).fill('');
        config.data.grids = cellChart['chart']['data']['rows'].length > 0 ? cellChart['chart']['data']['rows'][0] : cellChart['chart']['type'] === 3 ? new Array(9).fill('') : new Array(16).fill('');
        console.log(config.data);
        super(config);
    }
}