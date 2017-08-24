/**
 * Created by birdyy on 2017/8/24.
 * name auto输入组件
 */

import template from './auto.html';
import './auto.scss';
import {FormFittingAbstract} from '../form.abstract'

let config = {
    template: template,
    data: {},
    afterRender() {},
    firstAfterRender() {}
};

export class AutoComponent extends FormFittingAbstract {
    constructor() {
        super(config);
    }

}