/**
 * Created by birdyy on 2017/8/14.
 */

import {BiBaseComponent} from '../../bi.base.component';
import template from './normal.html';
import {FormBaseComponent} from '../base/base';

let config = {
    template:template,
    data: {},
    actions: {},
    afterRender() {},
    firstAfterRender() {}
}
export class FormNormalComponent extends FormBaseComponent{
    constructor() {
        super(config)
    }
}