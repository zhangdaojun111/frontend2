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
        name: '请输入名称'
    },
    afterRender() {},
    firstAfterRender() {
        let self = this;
        this.el.on('input', '.input',function(event) {
            self.data.value = $(this).val();
        })
    }
}

export class InputComponent extends FormFittingAbstract {
    constructor() {
        super(config)
    }

    /**
     * input 返回值
     */
    getValue() {
        return this.data.value;
    }
}