/**
 * Created by birdyy on 2017/8/14.
 * name checkbox组件
 */

import template from './checkbox.html';
import './checkbox.scss';
import {FormFittingAbstract} from '../form.abstract';

let config = {
    template: template,
    data: {
        checkboxs: []
    },
    value: null
}

export class CheckboxComponent extends FormFittingAbstract {
    constructor(data) {
        config.data = data
        super(config)
    }

    /**
     * checkbox 返回值
     */
    getValue() {
        return this.data.value;
    }
}