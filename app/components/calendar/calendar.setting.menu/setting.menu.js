/**
 * Created by zj on 2017/9/15.
 */

import Component from '../../../lib/component';
import template from './setting.menu.html';
import './setting.menu.scss';
import {FullMenuItem} from './menu.item/menu.item';

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
            if (text === '') {
                this.data.list = this.originData;
            } else {
                this.data.list = searchData(this.originData, text);
            }
            this.actions.renderMenuList();
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
            let allChildren = this.findAllChildren();
            allChildren.forEach((item) => {
                item.actions.setToFull();
            });
            this.actions.countHeight();
        },
        setSizeToMini: function () {
            this.el.addClass('mini');
            this.data.type = 'mini';
            let allChildren = this.findAllChildren();
            allChildren.forEach((item) => {
                item.actions.setToMini();
            });
            this.actions.countHeight();
        },
        startEditModel: function () {
            this.el.find('.custom-checkbox').show();
            this.el.find('.search').addClass('edit');
            this.el.find('.menu-full').addClass('edit');
            this.el.find('.menu-full-item > .row.full').addClass('edit');
            this.actions.countHeight();
        },
        cancelEditModel: function () {
            this.el.find('.custom-checkbox').hide();
            this.el.find('.search').removeClass('edit');
            this.el.find('.menu-full').removeClass('edit');
            this.el.find('.menu-full-item > .row.full').removeClass('edit');
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
        },
        renderMenuList: function () {
            this.destroyChildren();
            this.data.list.forEach((data) => {
                let component = new FullMenuItem(_.defaultsDeep({}, data, {
                    root: true,
                    offset: 0,
                    searchDisplay: true,
                    type: this.data.type
                }));
                this.append(component, this.$root, 'li');
            });
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
        this.$root = this.el.find('.root');
        this.actions.renderMenuList();
        // this.el.find('.search input:text').focus();
        this.actions.countHeight();
    },
    firstAfterRender: function() {
        this.originData = _.cloneDeep(this.data.list);
        $(window).on('resize.menu', () => {
            let menu = this.el.find('.menu-full');
            menu.css({
                height:0
            });
            menu.css({
                height: (document.body.scrollHeight - menu.offset().top) + 'px'
            });
        });
    },
    beforeDestory: () => {
        $(window).off('resize.menu')
    }
}

class SettingMenuComponent extends Component {
    constructor(data){
        super(config, data);
    }
}


export {SettingMenuComponent};