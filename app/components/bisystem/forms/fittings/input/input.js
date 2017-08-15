/**
 * Created by birdyy on 2017/8/14.
 * name input输入组件
 */

import {FormFittingAbstract} from '../formAbstract'
import template from './input.html';
import './input.scss';

let config = {
    template: template,
    data: {},
}

export class InputComponent extends FormFittingAbstract {
    constructor() {
        super(config)
    }
}