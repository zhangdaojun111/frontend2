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
        renderChoosed: function () {
            this.listWrap.find('input:checkbox:checked').each(function () {
                this.checked = false;
            });
            if (this.data.onSelect) {
                this.data.onSelect(this.data.choosed);
            }
            if (this.data.choosed.length) {
                this.choosedWrap.show();
                let html = [];
                this.data.choosed.forEach((item) => {
                    let checkbox = this.listWrap.find(`input:checkbox[data-id=${item.id}]`);
                    checkbox[0].checked = true;
                    html.push(`<div class="item" title="点击删除" data-id="${item.id}">${item.name}</div>`)
                });
                this.choosedWrap.html(html.join(''));
            } else {
                this.choosedWrap.hide();
            }
        }
    },
    afterRender: function () {
        this.listWrap = this.el.find('ul');
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
    },
    firstAfterRender: function () {
        let that = this;
        if (this.data.editable === true) {
            this.el.on('click', 'li', _.debounce(function () {
                that.actions.selectItem($(this));
            }, 50)).on('input', 'input.text', _.debounce(function () {
                that.actions.onInput($(this));
            }, 1000)).on('mouseenter', () => {
                that.actions.showSelectBox();
            }).on('mouseleave', () => {
                that.actions.hideSelectBox();
            }).on('click', '.choosed .item', function () {
                let id = $(this).data('id');
                that.actions.unSelectItem(id);
            });
        }
    }
}

class AutoSelect extends Component {

    constructor(data) {
        super(config, data);
    }
}

export {AutoSelect}