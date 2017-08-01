/**
 * Created by birdyy on 2017/7/31.
 */
import {BiBaseComponent} from '../../../bi.base.component';
import template from './cell.nine.grid.html';
import "./cell.nine.grid.scss";

let config = {
    template: template
}

export class CellNineGridComponent extends BiBaseComponent {
    constructor() {
        super(config)
    }
}