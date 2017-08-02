/**
 * Created by birdyy on 2017/7/31.
 */
import {BiBaseComponent} from '../../../bi.base.component';
import template from './cell.table.html';
import "./cell.table.scss";

let config = {
    template: template
}

export class CellTableComponent extends BiBaseComponent {
    constructor(cellChart) {
        config.data = cellChart ? cellChart : null;
        super(config)
        console.log(this.data);
    }
}
