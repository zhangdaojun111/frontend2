import template from './autoSelect.html';
import './autoSelect.scss';
import Component from '../../../lib/component';
// import {AutoSelectItem} from './item/item';

let config = {
    template: template,
    data: {
        /**
         * 数据格式
         * {
         *     id: '',
         *     name: '',
         *     py: ''
         * }
         */
        list: [],                       // 全部列表
        /**
         * {
         *      id: '',
         *      name: ''
         * }
         */
        choosed: [],                    // 已经选择的数据
        displayType: 'popup',           // popup或者static popup为弹出的形式 static 为静态显示
        multiSelect: true,              // 是否多选
        selectBoxHeight: 300,           // select 框的高度
        width: 0,                       // 为0表示显示默认宽度240
        editable: true,                 // 是否可编辑
        displayChoosed: true,           // 是否显示已选中的
        onSelect: null                  // 选择时的事件
    },
    actions: {
        selectItem: function (item) {
            if (this.data.multiSelect === true) {
                let choosed = this.el.find('input:checked');
                choosed = Array.from(choosed).map((item) => {
                    let $item = $(item);
                    return {
                        id: $item.data('id'),
                        name: $item.data('name')
                    }
                });
                this.data.choosed = choosed;
            } else {
                if (item.find('input:checkbox')[0].checked) {
                    this.data.choosed = [{
                        id: item.data('id'),
                        name: item.data('name')
                    }];
                } else {
                    this.data.choosed = [];
                }
            }
            this.actions.renderChoosed();
        },
        unSelectItem: function (id) {
            _.remove(this.data.choosed, function (item) {
                return item.id === id;
            });
            this.actions.renderChoosed();
        },
        clearValue: function () {
            this.data.choosed = [];
            this.actions.renderChoosed();
        },
        onInput: function (input) {
            let value = input.val();
            if (value === '') {
                this.listWrap.find('li').show();
            } else {
                this.listWrap.find('li').hide();
                this.listWrap.find(`li[data-name*=${value}]`).show();
                this.listWrap.find(`li[data-py*=${value}]`).show();
            }
        },
        showSelectBox: function () {
            window.clearTimeout(this.data.timer);
            this.listWrap.show();
        },
        hideSelectBox: function () {
            window.clearTimeout(this.data.timer);
            this.data.timer = window.setTimeout(() => {
                if (this.listWrap) {
                    this.listWrap.hide();
                }
            }, 500);
        },
        getValue: function () {
            return this.data.choosed;
        },
        setChoosed: function (choosed) {
            console.log(choosed);
            this.data.choosed = choosed;
            this.actions.renderChoosed();
        },
        renderChoosed: function () {
            this.listWrap.find('input:checkbox:checked').each(function () {
                this.checked = false;
            });
            if (this.data.onSelect) {
                this.data.onSelect(this.data.choosed);
            }

            this.trigger('onSelect', this.data.choosed);
            if (this.data.choosed.length) {
                if (this.data.displayChoosed === true) {
                    this.choosedWrap.show();
                } else {
                    this.choosedWrap.hide();
                }
                let html = [];
                this.data.choosed.forEach((item) => {
                    let checkbox = this.listWrap.find(`input:checkbox[data-id=${item.id}]`);
                    checkbox[0].checked = true;
                    if (this.data.displayChoosed === true) {
                        html.push(`<div class="item" title="点击删除" data-id="${item.id}">${item.name}</div>`)
                    };
                });
                this.el.find('.select-all span').text(this.data.choosed.length);
                this.choosedWrap.html(html.join(''));
            } else {
                this.choosedWrap.hide();
            }
        },
        selectAll: function () {
            if (this.data.choosed.length === this.data.list.length) {
                this.data.choosed = [];
            } else {
                this.data.choosed = this.data.list;
            }
            this.actions.renderChoosed();
        }
    },
    binds:[
        {
            event: 'click',
            selector: 'li',
            callback: _.debounce(function (context) {
                this.actions.selectItem($(context));
            }, 50)
        },{
            event: 'input',
            selector: 'input.text',
            callback: _.debounce(function (context) {
                this.actions.onInput($(context));
            }, 1000)
        },{
            event: 'click',
            selector: '.choosed',
            callback: function (context) {
                let id = $(context).data('id');
                this.actions.unSelectItem(id);
            }
        },{
            event: 'click',
            selector: '.select-all a',
            callback: function () {
                this.actions.selectAll();
            }
        }
    ],
    afterRender: function () {
        this.listWrap = this.el.find('.list');
        this.choosedWrap = this.el.find('.choosed');
        this.actions.renderChoosed();
        this.listWrap.height(this.data.selectBoxHeight);
        if (this.data.displayType === 'popup') {
            this.listWrap.addClass('popup');
        }
        if (this.data.multiSelect === false) {
            this.el.find('.auto-select-component').addClass('single-select');
        }
        if (this.data.width !== 0) {
            this.el.find('.auto-select-component').css('width', this.data.width);
        }
        if (this.data.editable === false) {
            this.el.find('input.text').attr('disabled', 'true');
        }
        if (this.data.multiSelect === false) {
            this.listWrap.find('button').hide();
            this.listWrap.find('ul').height('100%');
        }
    },
    firstAfterRender: function () {
        let that = this;
        if (this.data.editable === true) {
            if (this.data.displayType === 'popup') {
                this.el.on('mouseenter', () => {
                    that.actions.showSelectBox();
                }).on('mouseleave', () => {
                    that.actions.hideSelectBox();
                })
            }
        } else {
            this.cancelEvents();
        }
    }
}

class AutoSelect extends Component {

    constructor(data, events) {
        super(config, data, events);
    }

}

export {AutoSelect}