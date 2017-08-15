/**
 * Created by birdyy on 2017/8/14.
 * name input输入组件
 */

import {BiBaseComponent} from '../../../bi.base.component';
import template from './input.html';
import './input.scss';

let config = {
    template: template,
    data: {},
}

export class InputComponent extends BiBaseComponent {
    constructor() {
        super(config)
    }
}