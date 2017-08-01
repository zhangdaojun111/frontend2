import Component from '../../../lib/component';
import template from './aside.html';
import './aside.scss';
import {MenuComponent} from '../menu-full/menu.full';
import {HTTP} from '../../../lib/http';

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
    data: {
        // systemName: '前端重构系统',
        // username: 'asdasd',
        // role: '管理员',
        // avatar: ''
    },
    actions: {},
    afterRender: function () {
        if (window.config && window.config.menu) {
            let allMenu = new MenuComponent({list: presetMenuData(window.config.menu)});
            let commonMenu = new MenuComponent({list: presetMenuData(window.config.menu)});
            allMenu.render(this.el.find('.menu.all'));
            commonMenu.render(this.el.find('.menu.common')).actions.hide();
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
    }
}

export const AsideInstance = new Component(config);