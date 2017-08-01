import Component from '../../../lib/component';
import template from './menu.full.html';
import './menu.full.scss';

import {FullMenuItem} from './item/item';

function searchData(menu, text, parent) {
    menu.forEach(function(item) {
        item.parent = parent;
        item.searchDisplay = false;
        if (new RegExp(text, 'g').test(item.label)) {
            setSearchDisplayTrue(item);
        } else {
            if (item.items) {
                searchData(item.items, text, item);
            }
        }
    });
}

function setSearchDisplayTrue(item) {
    item.searchDisplay = true;
    if (item.parent) {
        setSearchDisplayTrue(item.parent);
    }
}

let config = {
    template: template,
    data: {
        list: [],
        text: ''
    },
    actions: {
        search: function (text) {
            this.data.text = text;
            let menu = _.defaultsDeep([], this.originData);
            searchData(menu, text, null);
            this.data.list = menu;
            this.reload();
        },
        hide: function() {
            this.el.hide();
        },
        show: function() {
            this.el.show();
        }
    },
    afterRender: function () {
        this.originData = _.defaultsDeep([], this.data.list);
        this.data.children = [];
        this.data.list.forEach((data) => {
            let component = new FullMenuItem(_.defaultsDeep({}, data, {
                root: true,
                offset: 0,
                searchDisplay: true
            }));
            this.append(component, this.el.find('.root'));
        });
        let that = this;
        this.el.find('#search-menu-button').on('input', _.debounce(function() {
            that.actions.search(this.value);
        }, 1000));
        let _m = this.el.find('.menu-full');

        $(window).on('resize.menu', function () {
            _m.css({
                height: (document.body.scrollHeight - _m.offset().top) + 'px',
                overflow: 'auto'
            });
        });
        $(window).trigger('resize.menu');
    },
    beforeDestory: () => {
        this.el.find('#search-menu-button').off();
        $(window).off('resize.menu')
    }
}

class MenuComponent extends Component {
    constructor(data){
        super(config, data);
    }
}


export {MenuComponent};