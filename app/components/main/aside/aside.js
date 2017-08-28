import Component from '../../../lib/component';
import template from './aside.html';
import './aside.scss';
import {MenuComponent} from '../menu-full/menu.full';
import Mediator from '../../../lib/mediator';
import {PersonSetting} from "../personal-settings/personal-settings";
import {HTTP} from '../../../lib/http';
import msgbox from "../../../lib/msgbox";
import {UserInfoService} from "../../../services/main/userInfoService";
// import {commonuse} from '../commonuse/commonuse';
// import {Uploader} from "../../../lib/uploader";


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

function presetCommonMenuData(menu, commonData) {
    let menuData = _.defaultsDeep([], menu);
    let commonKeys = commonData.data;
    function setUsed(item) {
        item.commonUsed = true;
        if (item.parent) {
            setUsed(item.parent);
        }
    }
    function step_one(menu, parent) {
        menu.forEach((item) => {
            item.parent = parent;
            let key = item.ts_name || item.table_id;
            item.commonUsed = false;
            if (commonKeys.indexOf(key) !== -1) {
                setUsed(item);
            }
            if (item.items) {
                step_one(item.items, item);
            }
        })
    };
    function setp_two(menu) {
        let res = [];
        menu.forEach((item) => {
            delete item.parent;
            if (item.commonUsed) {
                res.push(item);
            }
            if (item.items) {
                item.items = setp_two(item.items);
            }
        })
        return res;
    };
    step_one(menuData);
    return setp_two(menuData);
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

            HTTP.postImmediately('/user_preference/', {
                action: "save",
                pre_type: "8",
                content: "0"
            });
        },
        showCommonMenu: function (reload) {
            if (!this.commonMenu) {
                this.commonMenu = new MenuComponent({list: presetCommonMenuData(window.config.menu, window.config.commonUse)});
                this.commonMenu.render(this.el.find('.menu.common'));
            }
            if (reload) {
                this.commonMenu.data.list = presetCommonMenuData(window.config.menu, window.config.commonUse);
                this.commonMenu.reload();
            }
            if (this.allMenu) {
                this.allMenu.actions.hide();
            }
            this.commonMenu.actions.show();
            this.allBtn.removeClass('active');
            this.commonBtn.addClass('active');
            this.data.menuType = 'common';

            if (window.config.commonUse.data.length > 0) {
                HTTP.postImmediately('/user_preference/', {
                    action: "save",
                    pre_type: "8",
                    content: "1"
                });
            }
        },
        openWorkflowIframe: function () {
            Mediator.emit('menu:item:openiframe', {
                id: 'start-workflow',
                name: '发起工作流',
                url: window.config.sysConfig.create_wf
            });
        },
        showInfoSet:function () {
            PersonSetting.show();
        },
        initAvatar:function () {
            let src = this.data.avatar;
            // let para = this.data.avatar_content;
            if(src !== ''){
                let $img = $("<img>").addClass("set-info");
                $img.attr('src', src);
                this.el.find("div.avatar").append($img);
                $img.on('error', function () {
                    $img.remove();
                });
            }
        },
        logout: function () {
            HTTP.getImmediately('/logout/').then((res) => {
                if (res.success === 1) {
                    location.href = '/login';
                }
            })
        },
        /**
         * 编辑常用菜单
         */
        startEditModel: function () {
            this.el.find('.tabs').hide();
            this.el.find('.edit-model-title').show();
            this.el.find('.menu').addClass('edit');
            this.actions.showAllMenu();
            this.allMenu.actions.startEditModel();
        },
        cancelEditModel: function () {
            this.el.find('.tabs').show();
            this.el.find('.edit-model-title').hide();
            this.el.find('.menu').removeClass('edit');
            this.allMenu.actions.cancelEditModel();
        },
        resetAvatar:function(){
            let $img = this.el.find("img.set-info");
            if($img.length === 0){
                $img = $("<img>").addClass("set-info");
                $img.attr("src",window.config.sysConfig.userInfo.avatar);
                this.el.find("div.avatar").append($img);
            }else{
                $img.attr("src",window.config.sysConfig.userInfo.avatar);
            }
        },
        saveCommonuse: function (choosed) {
            HTTP.postImmediately('/user_preference/', {
                action: "save",
                pre_type: "8",
                content: "1"
            });
            HTTP.postImmediately('/user_preference/', {
                action: "save",
                pre_type: "7",
                content: JSON.stringify(choosed)
            });
            window.config.commonUse.data = choosed;
            this.actions.showCommonMenu(true);
        },
        onImageError: function () {

        },
        checkAgent:function () {
            let isOpenAgent = window.config.sysConfig.is_open_agent;
            if(isOpenAgent === true){
                msgbox.confirm("您的代理功能已开启，是否关闭该功能？")
                    .then((result) => {
                        if(result === true){
                            UserInfoService.shutDownAgent({quick_shutdown:0}).done((result) => {
                                console.log(result);
                                if(result === 1){
                                    console.log("quick shutdown success");
                                }else{
                                    console.log("quick shutdown failed",result)
                                }
                            })
                        }
                    })
            }
        }
    },
    binds: [
        {
            event: 'click',
            selector: '.edit-model-title a',
            callback: function () {
                this.actions.cancelEditModel();
                this.actions.saveCommonuse(this.allMenu.actions.getSelected());
            }
        },{
            event: 'click',
            selector: '.startwrokflow',
            callback: function () {
                this.actions.openWorkflowIframe();
            }
        },{
            event: 'click',
            selector: '.logout',
            callback: function () {
                this.actions.logout();
            }
        },{
            event: 'click',
            selector: '.tabs .edit',
            callback: function () {
                this.actions.startEditModel();
            }
        },{
            event: 'click',
            selector: '.tabs p.all',
            callback: function () {
                this.actions.showAllMenu();
            }
        },{
            event: 'click',
            selector: '.tabs p.common',
            callback: function () {
                this.actions.showCommonMenu();
            }
        },{
            event: 'click',
            selector: 'div.personal-setting',
            callback: function () {
                this.actions.showInfoSet();
            }
        }
    ],
    afterRender: function () {
        if (window.config && window.config.menu) {
            this.allBtn = this.el.find('.tabs p.all');
            this.commonBtn = this.el.find('.tabs p.common');
            this.actions.initAvatar();
            if (window.config.isCommon === "0" || window.config.commonUse.data.length === 0) {
                this.actions.showAllMenu();
            } else {
                this.actions.showCommonMenu();
            }
        }
        //此处检查用户是否开启代理，并做提醒
        this.actions.checkAgent();
    },
    firstAfterRender: function() {
        Mediator.on('aside:size', (order) => {
            if (order === 'full') {
                this.actions.setSizeToFull();
            } else {
                this.actions.setSizeToMini();
            }
        });
        Mediator.on("personal:setAvatar",() => {
            this.actions.resetAvatar();
        });
        Mediator.on('commonuse:change', () => {
            this.actions.showCommonMenu(true);
        });
        Mediator.on("personal:setAvatar",() => {
            this.actions.resetAvatar();
        })
    },
    beforeDestory: function() {
        Mediator.removeAll('aside');
    }
}

export const AsideInstance = new Component(config);
