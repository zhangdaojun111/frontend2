import template from './autoSelect.html';
import './autoSelect.scss';
import Component from '../../../lib/component';
// import {AutoSelectItem} from './item/item';

let config = {
    template: template,
    data: {
        id: '',
        name: ''
    },
    actions: {
        selectItem: function (item) {
            let id = item.data('id');
            let name = item.data('name');
            this.actions.setValue(id, name);
        },
        setValue: function (id, name) {
            this.data.id = id;
            this.data.name = name;
            this.el.find('input').val(name);
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
        getId: function () {
            return this.data.id;
        }
    },
    afterRender: function () {
        let $wrap = this.el.find('ul');
        let that = this;
        $wrap.height(this.el.height() - 31);
        this.el.on('click', 'li', function () {
            that.actions.selectItem($(this));
        }).on('input', 'input', _.debounce(function () {
            that.actions.onInput($(this));
        }, 1000));
    }
}

class AutoSelect extends Component {

    constructor(data) {
        super(config, data);
    }
}

export {AutoSelect}