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
        // 如果给了默认值，初始化选中默认值
        if (me.data.value) {
            for (let [index,optionValue] of me.data.options.entries()) {
                if (me.data.value == optionValue.value) {
                     this.el.find('option').eq(index).attr('selected', true);
                     break;
                }
            }
        }

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
     * 设置select值
     */
    setValue(val) {
        for (let [index,option] of this.data.options.entries()) {
            if (val == option.value) {
                this.el.find('select option').eq(index).attr('selected', 'true');
                break;
            }
        };
        this.data.value = val;
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