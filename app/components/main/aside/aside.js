import Component from '../../../lib/component';
import template from './aside.html';
import './aside.scss';
import {MenuComponent} from '../menu-full/menu.full';
import Mediator from '../../../lib/mediator';
import PersonalSettings from "../personal-settings/personal-settings";
import {cookie} from '../../../lib/cookie';
import {HTTP} from '../../../lib/http';


function presetMenuData(menu, leaf) {
    let res;
    if (leaf !== true) {
        res = _.defaultsDeep([], menu);
    } else {
        res = menu;
    }
    res.forEach((item) => {
        item.mid = item.folder_id;
        if (item.items) {
            presetMenuData(item.items, true);
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
            if (this.data.menuType === 'all') {
                this.allMenu.actions.setSizeToFull();
            } else {
                this.commonMenu.actions.setSizeToFull();
            }
        },
        setSizeToMini: function() {
            this.el.addClass('mini');
            if (this.data.menuType === 'all') {
                this.allMenu.actions.setSizeToMini();
            } else {
                this.commonMenu.actions.setSizeToMini();
            }
        },
        showAllMenu: function () {
            if (!this.allMenu) {
                this.allMenu = new MenuComponent({list: presetMenuData(window.config.menu)});
                this.allMenu.render(this.el.find('.menu.all'));
            }
            if (this.commonMenu) {
                this.commonMenu.actions.hide();
            }
            this.allMenu.actions.show();
            this.allBtn.addClass('active');
            this.commonBtn.removeClass('active');
            this.data.menuType = 'all';
        },
        showCommonMenu: function () {
            if (!this.commonMenu) {
                this.commonMenu = new MenuComponent({list: presetMenuData(window.config.menu)});
                this.commonMenu.render(this.el.find('.menu.common'));
            }
            if (this.allMenu) {
                this.allMenu.actions.hide();
            }
            this.commonMenu.actions.show();
            this.allBtn.removeClass('active');
            this.commonBtn.addClass('active');
            this.data.menuType = 'common';
        },
        openWorkflowIframe: function () {
            Mediator.emit('menu:item:openiframe', {
                id: 'start-workflow',
                name: '发起工作流',
                url: window.config.sysConfig.create_wf
            });
        },
        showInfoSet:function () {
            //检查页面是否已创建
            let $page = $(document).find("div#personal-setting-page");
            console.log($page);
            if($page.length !== 0){
                $page.focus();
            }else{
                //打开个人设置页面
                PersonalSettings.show();
            }
        },
        logout: function () {
            HTTP.getImmediately('/logout/').then((res) => {
                if (res.success === 1) {
                    location.href = '/login';
                }
            })
        }
    },
    afterRender: function () {
        if (window.config && window.config.menu) {
            this.allBtn = this.el.find('.tabs p.all');
            this.commonBtn = this.el.find('.tabs p.common');
            this.el.on('click', '.tabs p.all', () => {
                this.actions.showAllMenu();
            }).on('click', '.tabs p.common', () => {
                this.actions.showCommonMenu();
            }).on('click','.set-info', () => {
                this.actions.showInfoSet();
            });
            this.actions.showAllMenu();
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
        this.el.on('click', '.startwrokflow', () => {
            this.actions.openWorkflowIframe();
        }).on('click', '.logout', () => {
            this.actions.logout();
        });
    },
    beforeDestory: function() {
        Mediator.removeAll('aside');
    }
}

export const AsideInstance = new Component(config);