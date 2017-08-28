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
                    let checkedItems = [];
                    me.data.checkedItems.map(item => {
                        if (item.id !== me.data.items[index].id) {
                            checkedItems.push(item);
                        };
                    });
                    me.data.checkedItems = checkedItems;
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
        if(val.length >= 0) {
            val.map((choosed,choosedIndex) => {
                this.data.items.forEach((item,index) => {
                    if (choosed.id == item.id) {
                        this.el.find('input').eq(index).attr('checked', true);
                    }
                })
            })
            this.data.checkedItems = val;
        } else {
            this.el.find('input').attr('checked', val);
            this.data.value = val;
            this.data.checked = val;
        }
    }


    /**
     * 设置所有为选中状态
     */
    setCheck() {
        this.data.items.map((choosed,choosedIndex) => {
            this.el.find('input').attr('checked', true)
        })
        this.data.checkedItems = this.data.items;
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