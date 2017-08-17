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
        checkboxs: [],
        value: null,
        onChange: null // change后执行回调函数
    },
    firstAfterRender() {
        let me = this;
        this.el.on('change', 'input', function(event){
            me.data.value = $(this).is(':checked');
            if (me.data.onChange) {
                me.data.onChange(me.data.value);
            }
        })
    }
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