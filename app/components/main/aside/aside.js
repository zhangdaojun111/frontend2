import Component from '../../../lib/component';
import template from './aside.html';
import './aside.scss';
import {MenuComponent} from '../menu-full/menu.full';
import Mediator from '../../../lib/mediator';
import {PersonSetting} from "../personal-settings/personal-settings";
import {HTTP} from '../../../lib/http';
import {commonuse} from '../commonuse/commonuse';
import {Uploader} from "../../../lib/uploader";


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

    function plusParentNumber(item) {
        if (item) {
            item.childrenIsCommonUseNumber += 1;
            if (item.parent) {
                plusParentNumber(item.parent);
            }
        }
    }

    function preset_one(_menu, parent) {
        _menu.forEach((item) => {
            let key = item.ts_name || item.table_id;
            if (item.commonUseNum === undefined) {
                item.childrenIsCommonUseNumber = 0;
            }
            if (commonKeys.indexOf(key) !== -1) {
                plusParentNumber(parent);
                item.isCommonUse = true;
            } else {
                item.isCommonUse = false;
            }
            if (item.items) {
                preset_one(item.items, item);
            }
        });
    }
    preset_one(menuData);

    function preset_two (_menu, parent) {
        let res = [];
        _menu.forEach((item) => {
            if (item.childrenIsCommonUseNumber > 0) {
                item.isCommonUse = true;
                preset_two(item.items, item);
            }
            if (item.isCommonUse === true) {
                res.push(item);
            }
        });
        if (parent !== null) {
            parent.items = res;
        }
        return res;
    }
    return preset_two(menuData, null);
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
            //检查页面是否已创建
            let $page = $(document).find("div#personal-setting-page");
            console.log($page);
            if($page.length !== 0){
                $page.focus();
            }else{
                //打开个人设置页面
                // PersonSetting.show();
                PersonSetting.showUserInfo({name:"赵俨"});
            }
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
        editCommonUse: function () {
            commonuse.show();
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
        onImageError: function () {

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
            }).on('click','div.personal-setting',() => {
                this.actions.showInfoSet();
            });
            this.actions.initAvatar();
            if (window.config.isCommon === "0" || window.config.commonUse.data.length === 0) {
                this.actions.showAllMenu();
            } else {
                this.actions.showCommonMenu();
            }
        }
        Mediator.on("personal:setAvatar",() => {
            this.actions.resetAvatar();
        })
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

        //上传初始化
        let state = 'on';
        let uploader = new Uploader();
        let temp;

        this.el.on('click', '.startwrokflow', () => {
            this.actions.openWorkflowIframe();
        }).on('click', '.logout', () => {
            this.actions.logout();
        }).on('click', '.tabs .edit', () => {
            this.actions.editCommonUse();
        }).on('click','.uploader-button',()=>{
            //upload_attachment示例
            // //中断后续传
            // if(state.startsWith('paused')){
            //     let str = state.split(',');
            //     uploader.shiftOn(str[1],str[2]);
            //     console.log('shifton:'+str[1]+","+str[2]);
            //     state = 'on';
            //     return;
            // }
            //上传文件
            uploader.addFile('test1').then(res=>{
                temp = res;
                uploader.appendData({
                    md5:true,
                    per_size:1024*1024,
                    dinput_type:9,
                    content_type:true
                });
                // //暂停传输
                setTimeout(()=>{
                    let codes = Object.keys(res);
                    uploader.pause('test1',codes[0]);
                    console.log('paused');
                    state = 'paused,test1,'+codes[0];
                },3000);
                uploader.upload('/upload_attachment/?is_image_type=0',{},(event)=>{
                    console.log('name:'+event.name+',code:'+event.code);
                    console.log(' position:'+(event.loaded||event.position) +",total:"+event.total);
                })
            });

            //upload_data
            // uploader.addFile('test2').then(res=>{
            //     temp = res;
            //     uploader.appendData({
            //         upload_file:true,
            //         table_id:'5931_dWhWjDuongKecmfFopzdND',
            //         parent_table_id:'',
            //         parent_real_id:'',
            //         parent_temp_id:'',
            //         is_batch:0,
            //         warning_msg:''
            //     });
            //     uploader.upload('/upload_data/',{},(event)=>{
            //         console.log('name:'+event.name+',code:'+event.code);
            //         console.log(' position:'+(event.loaded||event.position) +",total:"+event.total);
            //     })
            // })
        }).on('click','.delete-button',()=>{
            //删除文件
            console.log('delete');
            //deleteFileByName
            // uploader.deleteFileByName('test1','/delete_attachment/');
            //deleteFileByCode
            let code = Object.keys(temp)[0];
            uploader.deleteFileByCode(code,'/delete_attachment/');
         });
    },
    beforeDestory: function() {
        Mediator.removeAll('aside');
    }
}

export const AsideInstance = new Component(config);
