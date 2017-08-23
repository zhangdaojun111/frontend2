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
        items: [],
        checkedItems: [],
        onChange: null // change后执行回调函数
    },
    afterRender() {
        this.onChange = this.data.onChange;
    },
    firstAfterRender() {
        let me = this;
        this.el.on('change', 'input', function(event){
            me.data.value = $(this).is(':checked');
            if (me.data.items && me.data.items.length > 0) {
                const index = $(this).closest('div').index();
                if (me.data.value) {
                    me.data.checkedItems.push(me.data.items[index]);
                } else {
                    me.data.checkedItems.splice(index,1)
                }
            };
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
     * 设置checkbox值
     */
    setValue(val) {
        if(this.data.items && this.data.items.length > 0) {
            console.log(val);
        } else {
            this.el.find('input').attr('checked', val);
            this.data.value = val;
            this.data.checked = val;
            // this.onChange(this.data.value);
        }
    }

    /**
     * checkbox 返回值
     */
    getValue() {
        if(this.data.items && this.data.items.length > 0) {
            return this.data.checkedItems;
        } else {
            return this.data.value;
        }
    }

    /**
     * 当值change时，做改变
     * 这个绑定到data的onChange事件上
     */
    onChange() {}
}