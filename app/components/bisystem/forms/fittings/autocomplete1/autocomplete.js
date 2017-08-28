/**
 * Created by birdyy on 2017/8/24.
 * name auto输入组件
 */

import template from './autocomplete.html';
import './autocomplets.scss';
import {FormFittingAbstract} from '../form.abstract'
import {AutoCompleteItemComponent} from './item/item'


let config = {
    template: template,
    data: {
        items: [], // autocomplete 原始数据列表
        select: null, //当前选中的值
        onChange: null, // 当值改变时，如果设置了会触发
        onInput: null, // 当输入值，触发输入操作
        title: '请输入标题',
    },
    actions:{

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
                this.searchSelect(query);

            },500)
        },
        {
            event: 'click',
            selector:'.mat-select-list ul li span',
            callback: function (context,event) {
                let val = $(context).html();
                this.el.find('.mat-input-container .mat-input-val').val(val);
                this.searchSelect(val);
                this.data.select = JSON.parse($(context).closest('li').attr('data-item'));
                if (this.data.onChange) {
                    this.data.onChange(this.data.select)
                }
            }
        }
    ],
    afterRender() {},
    firstAfterRender() {
        this.autoItem = new AutoCompleteItemComponent();
        this.autoItem.data.items = this.data.items;
        this.append(this.autoItem, this.el.find('.mat-select-list'));
        // if (this.data.onChange) {
        //     this.data.onChange(this.data.select)
        // }

    }
};

export class AutoCompleteComponent1 extends FormFittingAbstract {
    constructor(data) {
        config.data = data;
        super(config);
    }


    /**
     *模糊匹配查询
     */
    searchSelect(query) {
        let items = [];
        if (query) {
            console.log(this.data.items);
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
    }

    /**
     * 设置值
     * @param items = 渲染数据列表，select = 选中的值
     */

    setItems(items,select) {
        if(select !== undefined) {
            this.data.select = select;
            this.el.find('.mat-input-val').val(this.data.select);
        };
        this.data.items = this.autoItem.data.items = items;
        this.autoItem.reload();
    }

    /**
     * 设置编辑模式的值
     */
    setValue(select) {
        this.el.find('.mat-input-val').val(select.name);
        this.data.select = select;
    }

    /**
     * 返回选择中的值
     */

    getValue() {
        return this.data.select
    }

    /**
     * 当值改变时
     */
    onChange(val) {

    }

}