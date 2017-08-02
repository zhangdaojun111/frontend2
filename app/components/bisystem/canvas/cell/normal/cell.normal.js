/**
 * Created by birdyy on 2017/7/31.
 */
import {BiBaseComponent} from '../../../bi.base.component';
import template from './cell.normal.html';
import './cell.normal.scss';

import {EchartsService} from '../../../../../services/bisystem/echart.server';

let config = {
    template: template,
    data: {
        id: 'normal',
        chart: {}
    },
    actions: {
        init() {
            let echartsService = new EchartsService(this.data)
        }
    },
    firstAfterRender() {
        this.actions.init()
    }
}

export class CellNormalComponent extends BiBaseComponent {
    constructor() {
        super(config)
    }
}
