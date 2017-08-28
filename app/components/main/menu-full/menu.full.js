import Component from '../../../lib/component';
import template from './menu.full.html';
import './menu.full.scss';
import {FullMenuItem} from './item/item';

function searchData(menu, text) {
    let res = _.cloneDeep(menu);
    
    function search(_menu, _text, _parent) {
        _menu.forEach(function(item) {
            item.parent = _parent;
            item.searchDisplay = false;
            let reg = new RegExp(text, 'g');
            if (reg.test(item.label) || reg.test(item.name_py)) {
                setDisplay(item);
            } else {
                if (item.items) {
                    search(item.items, text, item);
                }
            }
            delete item.parent;
        });
    }
    
    function setDisplay(_item) {
        _item.searchDisplay = true;
        if (_item.parent) {
            setDisplay(_item.parent);
        }
    }
    search(res, text, null);
    return res;

}

let config = {
    template: template,
    data: {
        list: [],
        text: '',
        type: 'full'
    },
    actions: {
        search: function (text) {
            this.data.text = text;
            let menu = searchData(this.originData, text);
            this.data.list = menu;
            this.reload();
        },
        hide: function() {
            this.el.hide();
        },
        show: function() {
            this.el.show();
            this.actions.countHeight();
        },
        countHeight: function() {
            $(window).trigger('resize.menu');
        },
        setSizeToFull: function () {
            this.el.removeClass('mini');
            this.data.type = 'full';
            this.reload();
            this.actions.countHeight();
        },
        setSizeToMini: function () {
            this.el.addClass('mini');
            this.data.type = 'mini';
            this.reload();
            this.actions.countHeight();
        },
        startEditModel: function () {
            this.el.find('.custom-checkbox').show();
            this.el.find('.search').addClass('edit');
            this.el.find('.menu-full').addClass('edit');
            this.actions.countHeight();
        },
        cancelEditModel: function () {
            this.el.find('.custom-checkbox').hide();
            this.el.find('.search').removeClass('edit');
            this.el.find('.menu-full').removeClass('edit');
            this.actions.countHeight();
        },
        getSelected: function () {
            let choosed = this.el.find('input:checkbox:checked.leaf[key]');
            let res = Array.from(choosed).map((item) => {
                return $(item).attr('key');
            });
            _.remove(res, function (i) {
                return i === '0';
            });
            return res;
        }
    },

    binds: [
        {
            event: 'input',
            selector: 'label.search input:text',
            callback: _.debounce(function(context) {
                this.actions.search(context.value);
            }, 1000)
        }
    ],

    afterRender: function () {
        let $root = this.el.find('.root');
        this.data.list.forEach((data) => {
            let component = new FullMenuItem(_.defaultsDeep({}, data, {
                root: true,
                offset: 0,
                searchDisplay: true,
                type: this.data.type
            }));
            this.append(component, $root, 'li');
        });
        this.el.find('.search input:text').focus();
        this.actions.countHeight();
    },
    firstAfterRender: function() {
        this.originData = _.cloneDeep(this.data.list);
        $(window).on('resize.menu', () => {
            let menu = this.el.find('.menu-full');
            menu.css({
                height:0
            })
            menu.css({
                height: (document.body.scrollHeight - menu.offset().top) + 'px'
            });
        });
    },
    beforeDestory: () => {
        $(window).off('resize.menu')
    }
}

class MenuComponent extends Component {
    constructor(data){
        super(config, data);
    }
}


export {MenuComponent};