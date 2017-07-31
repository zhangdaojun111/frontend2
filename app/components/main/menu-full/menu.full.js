import Component from '../../../lib/component';
import template from './menu.full.html';
import './menu.full.scss';

import {FullMenuItem} from './item/item';

console.log(window.config);

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
        list: window.config.menu,
    },
    actions: {
        search: function (text) {
            let menu = _.defaultsDeep([], window.config.menu);
            searchData(menu, text, null);
            this.data.list = menu;
            this.reload();
        }
    },
    afterRender: function () {
        this.data.children = [];
        this.data.list.forEach((data) => {
            let component = new FullMenuItem(_.defaultsDeep({}, data, {
                root: true,
                offset: 0,
                searchDisplay: true
            }));
            this.append(component, this.el.find('.root'));
        });
        this.el.css({
            height: 'calc(100% - 230px)',
            overflow: 'auto'
        })
    },
    firstAfterRender: function () {

    },
    beforeDestory: () => {

    }
}


export const FullMenuInstance = new Component(config);