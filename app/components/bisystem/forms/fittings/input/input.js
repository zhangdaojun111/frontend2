/**
 * Created by birdyy on 2017/8/14.
 * name input输入组件
 */

import template from './input.html';
import './input.scss';
import {FormFittingAbstract} from '../form.abstract'

let config = {
    template: template,
    data: {
        value:null,
        label: '请输入',
        show: true
    },
    afterRender() {},
    firstAfterRender() {
        let me = this;
        this.el.on('input', 'input',function(event) {
            me.data.value = $(this).val();
        })
    }
}

export class InputComponent extends FormFittingAbstract {
    constructor(data) {
        config.data = data;
        super(config);
    }

    /**
     * input 返回值
     */
    getValue() {
        return this.data.value;
    }
}