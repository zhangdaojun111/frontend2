/**
 * Created by birdyy on 2017/8/14.
 * name input输入组件
 */

import {BiBaseComponent} from '../../../bi.base.component';
import template from './radio.html';
import './radio.scss';

let config = {
    template: template,
    data: {},
}

export class RadioComponent extends BiBaseComponent {
    constructor() {
        super(config)
    }
}