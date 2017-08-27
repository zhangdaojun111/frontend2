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
        fiterItems: [], // 模糊查询出的item
        select: null, //当前选中的值
        onSelect: null

    },
    actions:{

    },

    binds:[
        {
            event: 'focus',
            selector: '.mat-input-container .mat-input-val',
            callback: _.debounce(function () {
                this.el.find('.mat-select-list').fadeIn();
                let top = $('.form-group-auto').offset().top + $('.mat-select-list').height() + $('.mat-input-container').height();
                let maxHeight = $('.chart-form').height();
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
                console.log(this.data.onSelect);
                if (this.data.onSelect) {
                    console.log('xxxxxxxxx');
                    this.data.onSelect(this.data.select);
                }
            }
        }
    ],
    afterRender() {},
    firstAfterRender() {
        this.autoItem = new AutoCompleteItemComponent();
        this.autoItem.data.items = this.data.items;
        this.append(this.autoItem, this.el.find('.mat-select-list'))
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
     */

    setValue(items,select = null) {
        if(select) {
            this.data.select = select;
        }
        this.data.items = this.autoItem.data.items = items;
        this.autoItem.reload();
    }

    /**
     * 返回选择中的值
     */

    getValue() {
        return this.data.select
    }


}