/**
 * Created by birdyy on 2017/8/14.
 */

import {BiBaseComponent} from '../../bi.base.component';
import template from './pie.html';

let config = {
    template:template,
    data: {},
    actions: {},
    afterRender() {},
    firstAfterRender() {}
}
export class FormPieComponent extends BiBaseComponent{
    constructor() {
        super(config)
    }
}