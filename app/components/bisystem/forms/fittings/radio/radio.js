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
        value: null
    },
    afterRender() {},
    firstAfterRender() {
        let me = this;
        this.el.on('change', 'input', function(event){
            me.data.value = $(this).val();
            alert(me.data.value);
        })
    }
}

export class RadioComponent extends FormFittingAbstract {
    constructor(data) {
        config.data = data;
        super(config);
    }

    /**
     * radio 返回值
     */
    getValue() {
        return this.data.value;
    }
}