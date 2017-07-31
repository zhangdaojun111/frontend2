/**
 * Created by birdyy on 2017/7/31.
 */
import {BiBaseComponent} from '../../../bi.base.component';
import template from './cell.linebar.html';


let lineBarConfig = {
    template: template
}

export class CanvasCellLineBarComponent extends BiBaseComponent {
    constructor() {
        super(lineBarConfig)
    }
}
