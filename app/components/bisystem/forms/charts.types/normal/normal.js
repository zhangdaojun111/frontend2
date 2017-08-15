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
    afterRender() {
        let base = new FormBaseComponent();
        console.log('xxxxxxxxxxxxxxxxxxxxxxxx');
        console.log(base);
        this.append(base, this.el.find('.field'))
    },
    firstAfterRender() {

    }
}
export class FormNormalComponent extends BiBaseComponent{
    constructor() {
        super(config)
    }
}