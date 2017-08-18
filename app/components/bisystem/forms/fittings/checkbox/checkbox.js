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
        checked: false,
        onChange: null // change后执行回调函数
    },
    firstAfterRender() {
        let me = this;
        me.onChange = me.data.onChange;
        this.el.on('change', 'input', function(event){
            me.data.value = $(this).is(':checked');
            if (me.data.onChange) {
                me.onChange(me.data.value);
            };
        })
    }
}

export class CheckboxComponent extends FormFittingAbstract {
    constructor(data) {
        config.data = data;
        super(config);
    }

    /**
     * checkbox 返回值
     */
    getValue() {
        return this.data.value;
    }

    /**
     * 当值change时，做改变
     * 这个绑定到data的onChange事件上
     */
    onChange() {}
}