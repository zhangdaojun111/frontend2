import Component from '../../../lib/component';
import template from './aside.html';
import './aside.scss';
import {MenuComponent} from '../menu-full/menu.full';
import Mediator from '../../../lib/mediator';

function presetMenuData(menu) {
    let res = _.defaultsDeep([], menu);
    res.forEach((item) => {
        item.mid = item.folder_id;
        if (item.items) {
            presetMenuData(item.items);
        }
    });
    return res;
}

let config = {
    template: template,
    data: {},
    actions: {
        setSizeToFull: function() {
            this.el.removeClass('mini');
            this.allMenu.actions.setSizeToFull();
            this.commonMenu.actions.setSizeToFull();
        },
        setSizeToMini: function() {
            this.el.addClass('mini');
            this.allMenu.actions.setSizeToMini();
            this.commonMenu.actions.setSizeToMini();
        }
    },
    afterRender: function () {
        if (window.config && window.config.menu) {
            this.allMenu = new MenuComponent({list: presetMenuData(window.config.menu)});
            this.commonMenu = new MenuComponent({list: presetMenuData(window.config.menu)});
            this.allMenu.render(this.el.find('.menu.all'));
            this.commonMenu.render(this.el.find('.menu.common')).actions.hide();
            let allBtn = this.el.find('.tabs p.all');
            let commonBtn = this.el.find('.tabs p.common');
            this.el.on('click', '.tabs p', function () {
                let me = $(this);
                if (me.hasClass('all')) {
                    allMenu.actions.show();
                    commonMenu.actions.hide();
                    allBtn.addClass('active');
                    commonBtn.removeClass('active');
                } else {
                    allMenu.actions.hide();
                    commonMenu.actions.show();
                    allBtn.removeClass('active');
                    commonBtn.addClass('active');
                }
            })
        }
    },
    firstAfterRender: function() {
        Mediator.on('aside:size', (order) => {
            if (order === 'full') {
                this.actions.setSizeToFull();
            } else {
                this.actions.setSizeToMini();
            }
        });
    },
    beforeDestory: function() {
        Mediator.removeAll('aside');
    }
}

export const AsideInstance = new Component(config);