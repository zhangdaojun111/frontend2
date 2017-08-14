import template from './autoSelect.html';
import './autoSelect.scss';
import Component from '../../../lib/component';
// import {AutoSelectItem} from './item/item';

let config = {
    template: template,
    data: {
        id: '',
        name: '',
        choosed: [],
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
                this.actions.setValue();
            } else {
                let id = item.data('id');
                let name = item.data('name');
                this.data.choosed = [{
                    id: item.data('id'),
                    name: item.data('name')
                }];
                this.actions.setValue();
            }
        },
        setValue: function () {
            let names = this.data.choosed.map((item) => {
                return item.name;
            });
            this.el.find('input').val(names.join(','));
        },
        clearValue: function () {
            this.data.id = '';
            this.data.name = '';
        },
        onInput: function (input) {
            let value = input.val();
            if (value === '') {
                this.el.find('li').show();
            } else {
                this.el.find('li').hide();
                this.el.find(`li[data-name*=${value}]`).show();
            }
            this.actions.clearValue();
        },
        showSelectBox: function () {
            this.el.find('ul').show();
        },
        hideSelectBox: function () {
            // this.el.find('ul').hide();
        },
        getId: function () {
            return this.data.id;
        }
    },
    afterRender: function () {
        let $wrap = this.el.find('ul');
        let that = this;
        $wrap.height(this.data.selectBoxHeight);
        this.el.on('click', 'li', function () {
            that.actions.selectItem($(this));
        }).on('input', 'input', _.debounce(function () {
            that.actions.onInput($(this));
        }, 1000)).on('mouseenter', () => {
            that.actions.showSelectBox();
        }).on('mouseleave', () => {
            that.actions.hideSelectBox();
        });

        if (this.data.displayType === 'popup') {
            this.el.find('ul').addClass('popup');
        }
    }
}

class AutoSelect extends Component {

    constructor(data) {
        super(config, data);
    }

}

export {AutoSelect}