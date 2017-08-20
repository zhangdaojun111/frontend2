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
        value: null,
        options:[],
        label: null,
        onChange: null,
    },
    afterRender() {},
    firstAfterRender() {
        let me = this;
        me.onChange = me.data.onChange;
        this.el.on('change', 'select', function(event){
            me.data.value = $(this).val();
            if (me.data.onChange) {
                me.onChange(me.data.value);
            };
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
    /**
     * 当值change时，做改变
     * 这个绑定到data的onChange事件上
     */
    onChange() {}
}