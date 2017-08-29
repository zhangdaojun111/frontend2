/**
 * Created by birdyy on 2017/8/24.
 * name auto输入组件
 */

import template from './autocomplete.html';
import './autocomplets.scss';
import {AutoCompleteItemComponent} from './item/item'
import {Base} from '../base'

let config = {
    template: template,
    data: {
        items: [], // autocomplete 原始数据列表
        onChange: null, // 当值改变时，如果设置了会触发
        onInput: null, // 当输入值，触发输入操作
    },
    actions:{

        /**
         *模糊匹配查询
         */
        searchSelect(query) {
            let items = [];
            if (query) {
                this.data.items.map(item => {
                    if (item['name'].indexOf(query) !== -1) {
                        items.push(item);
                    }
                });
            } else {
                items = this.data.items;
            }

            this.autoItem.data.items =items;
            this.autoItem.reload();
        },

        /**
         * 设置值
         * @param items = 渲染数据列表，select = 选中的值
         */

        setItems(items,value) {
            if(select !== undefined) {
                this.data.value = value;
                this.el.find('.mat-input-val').val(this.data.value);
            };
            this.data.items = this.autoItem.data.items = items;
            this.autoItem.reload();
        },

        /**
         * 设置编辑模式的值
         */
        setValue(value) {
            this.el.find('.mat-input-val').val(select.name);
            this.data.value = value;
        },

        /**
         * 返回选择中的值
         */

        getValue() {
            return this.data.value
        },

        /**
         * 当值改变时
         */
        onChange(val) {

        }

    },

    binds:[
        {
            event: 'focus',
            selector: '.mat-input-container .mat-input-val',
            callback: _.debounce(function () {
                this.el.find('.mat-select-list').fadeIn();
                // let top = $('.form-group-auto').offset().top + $('.mat-select-list').height() + $('.mat-input-container').height();
                // let maxHeight = $('.chart-form').height();
            },50)
        },
        {
            event: 'blur',
            selector: '.mat-input-container .mat-input-val',
            callback: _.debounce(function () {
                this.el.find('.mat-select-list').fadeOut();
            },50)
        },
        {
            event: 'input',
            selector: '.mat-input-container .mat-input-val',
            callback: _.debounce(function (context,event) {
                let query = $(context).val();
                if (this.data.onInput) {
                    this.data.onInput(query);
                };
                this.actions.searchSelect(query);

            },500)
        },
        {
            event: 'click',
            selector:'.mat-select-list ul li span',
            callback: function (context,event) {
                let val = $(context).html();
                this.el.find('.mat-input-container .mat-input-val').val(val);
                this.actions.searchSelect(val);
                this.data.select = JSON.parse($(context).closest('li').attr('data-item'));
                if (this.data.onChange) {
                    this.data.onChange(this.data.select)
                }
            }
        }
    ],
    afterRender(){
        this.$input = this.el.find('input');
        this.$label = this.el.find('.label');
    },
    firstAfterRender() {
        this.autoItem = new AutoCompleteItemComponent();
        this.autoItem.data.items = this.data.items;
        this.append(this.autoItem, this.el.find('.mat-select-list'));
    }
};

export class AutoSelect extends Base {
    constructor(data, event){
        super(config, data, event)
    }

    setValue(value){
        this.data.value = value;
        this.$input.val(value);
    }

    setLabel(label){
        this.data.label = label;
        this.$label.text(label);
    }
}