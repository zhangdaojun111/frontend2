/**
 * Created by birdyy on 2017/8/14.
 * name checkbox组件
 */

import {BiBaseComponent} from '../../../bi.base.component';
import template from './checkbox.html';
import './checkbox.scss';

let config = {
    template: template,
    data: {},
}

export class CheckboxComponent extends BiBaseComponent {
    constructor() {
        super(config)
    }
}