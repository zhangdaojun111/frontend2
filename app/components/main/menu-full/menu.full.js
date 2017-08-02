import Component from '../../../lib/component';
import template from './menu.full.html';
import './menu.full.scss';
import 'jquery-ui/ui/widgets/menu';
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
        text: '',
        type: 'full'
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
        }
    },
    afterRender: function () {

        let $root = this.el.find('.root');
        this.data.list.forEach((data) => {
            let component = new FullMenuItem(_.defaultsDeep({}, data, {
                root: true,
                offset: 0,
                searchDisplay: true
            }));
            this.append(component, $root, 'li');
        });

        let that = this;
        this.el.find('#search-menu-button').on('input', _.debounce(function() {
            that.actions.search(this.value);
        }, 1000));

        if (this.data.type === 'mini') {
            this.el.find('.root').menu({
            });
        }
        this.actions.countHeight();
    },
    firstAfterRender: function() {
        this.originData = _.defaultsDeep([], this.data.list);
        let that = this;
        $(window).on('resize.menu', function () {
            let menu = that.el.find('.menu-full');
            menu.css({
                height: (document.body.scrollHeight - menu.offset().top) + 'px',
                overflow: 'auto'
            });
        });
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