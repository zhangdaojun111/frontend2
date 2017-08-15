import template from './autoSelect.html';
import './autoSelect.scss';
import Component from '../../../lib/component';
// import {AutoSelectItem} from './item/item';

let config = {
    template: template,
    data: {
        list: [],                       // 全部列表
        choosed: [],                    // 已经选择的数据
        displayType: 'popup',           // popup或者static popup为弹出的形式 static 为静态显示
        multiSelect: true,
        selectBoxHeight: 300            // select 框的高度
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
                let checked = item.find('input:checkbox')[0].checked;
                if (checked) {
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
            }
        },
        showSelectBox: function () {
            this.listWrap.show();
        },
        hideSelectBox: function () {
            this.listWrap.hide();
        },
        getValue: function () {
            return this.data.choosed;
        },
        renderChoosed: function () {
            this.listWrap.find('input:checkbox:checked').each(function () {
                this.checked = false;
            });
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
        let that = this;
        this.actions.renderChoosed();
        this.listWrap.height(this.data.selectBoxHeight);
        this.el.on('click', 'li', function () {
            that.actions.selectItem($(this));
        }).on('input', 'input', _.debounce(function () {
            that.actions.onInput($(this));
        }, 1000)).on('mouseenter', () => {
            that.actions.showSelectBox();
        }).on('mouseleave', () => {
            that.actions.hideSelectBox();
        }).on('click', '.choosed .item', function () {
            let id = $(this).data('id');
            that.actions.unSelectItem(id);
        });

        if (this.data.displayType === 'popup') {
            this.listWrap.addClass('popup');
        }
        if (this.data.multiSelect === false) {
            this.el.find('.auto-select-component').addClass('single-select');
        }
    }
}

class AutoSelect extends Component {

    constructor(data) {
        super(config, data);
    }

}

export {AutoSelect}