/**
 * Created by birdyy on 2017/8/14.
 * name select组件
 */
import {FormFittingAbstract} from '../form.abstract';
import template from './select.html';
import './select.scss';


let config = {
    template: template,
    data: {
        value: null
    },
    afterRender() {},
    firstAfterRender() {
        let me = this;
        this.el.on('change', '.select', function(event){
            me.data.value = $(this).val();
        })
    }
}

export class SelectComponent extends FormFittingAbstract {
    constructor(data) {
        config.data = data;
        super(config);
    }

    /**
     * select 返回值
     */
    getValue() {
        return this.data.value;
    }
}