/**
 * Created by birdyy on 2017/8/14.
 * name radio组件
 */

import template from './radio.html';
import './radio.scss';
import {FormFittingAbstract} from '../form.abstract';

let config = {
    template: template,
    data: {
        radios: [],
        value: null,
        onChange: null
    },
    afterRender() {},
    firstAfterRender() {
        let me = this;
        me.onChange = me.data.onChange
        this.el.on('change', 'input', function(event){
            me.data.value = $(this).val();
            $(this).siblings('.radio-circle').addClass('active');
            $(this).closest('.bi-chart-radio').siblings().find('.radio-circle').removeClass('active');
            if (me.data.onChange) {
                me.onChange(me.data.value);
            };
        })
    }
}

export class RadioComponent extends FormFittingAbstract {
    constructor(data) {
        config.data = data;
        super(config);
    }

    /**
     * 设置input值
     */
    setValue(val) {
        for (let [index,radio] of this.data.radios.entries()) {
             if (val == radio.value) {
                 this.el.find('input').eq(index).attr('checked', 'true');
                 break;
             }
        };
        this.data.value = val;
    }

    /**
     * radio 返回值
     */
    getValue() {
        return this.data.value;
    }

    /**
     * 当值change时，做改变
     */
    onChange() {}
}