/**
 * Created by birdyy on 2017/8/14.
 */

import {BiBaseComponent} from '../../../bi.base.component';
import template from './normal.html';
import {FormBaseComponent} from '../../base/base';

let config = {
    template:template,
    data: {
        name: 'caihua'
    },
    actions: {},
    afterRender() {},
    firstAfterRender() {
        this.base = new FormBaseComponent();
        this.append(this.base, this.el.find('.field'))
    }
}
export class FormNormalComponent extends BiBaseComponent{
    constructor() {
        super(config)
    }
}