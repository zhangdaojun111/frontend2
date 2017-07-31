/**
 * Created by birdyy on 2017/7/31.
 */
import {BiBaseComponent} from '../../../bi.base.component';
import template from './cell.table.html';


let tableConfig = {
    template: template
}

export class CanvasCellTableComponent extends BiBaseComponent {
    constructor() {
        super(tableConfig)
    }
}
