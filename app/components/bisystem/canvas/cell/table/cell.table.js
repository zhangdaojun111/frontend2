/**
 * Created by birdyy on 2017/7/31.
 */
import {BiBaseComponent} from '../../../bi.base.component';
import template from './cell.table.html';

let config = {
    template: template
}

export class CellTableComponent extends BiBaseComponent {
    constructor() {
        super(config)
    }
}
