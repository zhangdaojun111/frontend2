import Component from '../../../lib/component';
import template from './aside.html';
import './aside.scss';
import {MenuComponent} from '../menu-full/menu.full';
import Mediator from '../../../lib/mediator';
import {PersonSetting} from "../personal-settings/personal-settings";
import {HTTP} from '../../../lib/http';
import msgbox from "../../../lib/msgbox";
import {UserInfoService} from "../../../services/main/userInfoService";
import {AvatarSet} from '../personal-settings/set-avatar/set-avatar';
// import {commonuse} from '../commonuse/commonuse';
// import {Uploader} from "../../../lib/uploader";

/**
 * 预处理window.config.menu数据用于生成全部菜单
 */
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

/**
 * 预处理window.config.commonUse数据用于生成常用菜单
 */
function presetCommonMenuData(menu, commonData) {
    let menuData = _.defaultsDeep([], menu);
    let commonKeys = commonData.data;
    //递归设置该选项及其所有祖宗选项为常用
    function setUsed(item) {
        item.commonUsed = true;
        if (item.parent) {
            setUsed(item.parent);
        }
    }
    //遍历全部菜单，为每个选项设置父节点引用，根据commonKeys将常用选项及其父节点设置常用属性为true
    function step_one(menu, parent) {
        menu.forEach((item) => {
            item.parent = parent;
            // let key = item.ts_name || item.table_id;
            let key;
            if (item.table_id && item.table_id !== '' && item.table_id !== "0") {
                key = item.table_id;
            }else{
                key = item.ts_name || "0";
            }

            item.commonUsed = false;
            if (commonKeys.indexOf(key) !== -1) {
                setUsed(item);
            }
            if (item.items) {
                step_one(item.items, item);
            }
        })
    };
    //遍历全部菜单，删除父节点引用，被设为常用的选项加入res，用于生成常用菜单
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
        /**
         * 正常模式显示菜单
         */
        setSizeToFull: function() {
            this.el.removeClass('mini');
            if (this.data.menuType === 'all') {
                this.allMenu.actions.setSizeToFull();
            } else {
                this.commonMenu.actions.setSizeToFull();
            }
        },
        /**
         * 迷你模式显示菜单
         */
        setSizeToMini: function() {
            this.el.addClass('mini');
            if (this.data.menuType === 'all') {
                this.allMenu.actions.setSizeToMini();
            } else {
                this.commonMenu.actions.setSizeToMini();
            }
        },
        /**
         * 展示全部菜单
         */
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
            //0表示当前处于全部菜单状态，1表示当前处于常用菜单状态
            HTTP.postImmediately('/user_preference/', {
                action: "save",
                pre_type: "8",
                content: "0"
            });
        },
        /**
         * 展示常用菜单
         */
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
        /**
         * 频道监听发起工作流
         */
        openWorkflowIframe: function () {
            Mediator.emit('menu:item:openiframe', {
                id: 'start-workflow',
                name: '发起工作流',
                url: window.config.sysConfig.create_wf
            });
        },
        /**
         * 打开个人信息设置页面
         */
        showInfoSet:function () {
            PersonSetting.show();
            // PersonSetting.showUserInfo({'name':'赵俨'})
        },
        /**
         * 设置用户头像
         */
        initAvatar:function () {
            let src = this.data.avatar;
            if(src !== ''){
                let $img = $("<img>").addClass("set-info");
                $img.attr('src', src);
                this.el.find("div.avatar").append($img);
                let that = this;
                $img.on('error', function () {
                    $img.remove();
                    that.el.find('.avatar').addClass('default-avatar');
                });
            }else{
                this.el.find('.avatar').addClass('default-avatar');
            }
        },
        /**
         * 用户登出
         */
        logout: function () {
            HTTP.getImmediately('/logout/').then((res) => {
                if (res.success === 1) {
                    location.href = '/login';
                }
            })
        },
        /**
         * 进入常用菜单编辑模式
         */
        startEditModel: function () {
            this.el.find('.tabs').hide();
            this.el.find('.edit-model-title').show();
            this.el.find('.menu').addClass('edit');
            this.actions.showAllMenu();
            this.allMenu.actions.startEditModel();
        },
        /**
         * 退出常用菜单编辑模式
         */
        cancelEditModel: function () {
            this.el.find('.tabs').show();
            this.el.find('.edit-model-title').hide();
            this.el.find('.menu').removeClass('edit');
            this.allMenu.actions.cancelEditModel();
        },
        /**
         * 修改后重置用户头像
         */
        resetAvatar:function(){
            let $img = this.el.find("img.set-info");
            if($img.length === 0){
                $img = $("<img>").addClass("set-info");
                $img.attr("src",window.config.sysConfig.userInfo.avatar);
                this.el.find(".avatar").append($img);
            }else{
                $img.attr("src",window.config.sysConfig.userInfo.avatar);
            }
            console.log($img);
        },
        /**
         * 保存常用菜单
         */
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
        /**
         * 提醒用户是否关闭当前开启的代理功能
         */
        checkAgent:function () {
            let isOpenAgent = window.config.sysConfig.is_open_agent;
            if(isOpenAgent === true){
                msgbox.confirm("您的代理功能已开启，是否关闭该功能？")
                    .then((result) => {
                        if(result === true){
                            UserInfoService.shutDownAgent({quick_shutdown:0}).done((result) => {
                                if(result === 1){
                                    // console.log("quick shutdown success");
                                }else{
                                    console.log("quick shutdown failed",result)
                                }
                            })
                        }
                    })
            }
        },
        /**
         * 检测系统名称长度，调整ERDS logo位置
         */
        checkSysName:function () {
            if(this.data.hasOwnProperty('systemName')){
                let lenght = this.data.systemName.length;
                if(lenght > 8){
                    this.el.find('.erds-logo').css('padding-top','10px');
                }
            }
        }
    },
    binds: [
        {
            event: 'click',
            selector: '.edit-model-title a',
            callback: function () {
                this.actions.saveCommonuse(this.allMenu.actions.getSelected());
                this.actions.cancelEditModel();
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
        },{
            event:'click',
            selector:'.avatar',
            callback:function () {
                AvatarSet.show();
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
        //检测系统名称名字长度，长于8则修改ERDS logo的padding
        this.actions.checkSysName();
    },
    firstAfterRender: function() {
        Mediator.on('aside:size', (order) => {
            if (order === 'full') {
                this.actions.setSizeToFull();
            } else {
                this.actions.setSizeToMini();
            }
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
};

export const AsideInstance = new Component(config);
