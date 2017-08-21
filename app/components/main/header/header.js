import Component from '../../../lib/component';
import template from './header.html';
import './header.scss';
import 'jquery-ui/ui/widgets/tooltip';
import Mediator from '../../../lib/mediator';
import msgbox from '../../../lib/msgbox';
import OtherLogin from "../login-by-other/login-by-other";
import {systemMessageUtil} from '../system-message/system-message';
import {SysSetting} from "../system-setting/system-setting"
import {postMessageUtil} from '../post-message/post-message';
import {GlobalSearch} from '../global-search/global-search';
import {OnlineDisplay} from "../online-users/online-users"
import {GlobalService} from "../../../services/main/globalService"

let config = {
    template: template,
    data: {
        asideSize: 'full',

        // homeVisible: true,
        // calendarVisible: true,
        // biVisible: true,

        postMessageVisible: window.config.sysConfig.userInfo.is_superuser.toString() === "1",
        calendarVisible: window.config.sysConfig.logic_config.use_calendar.toString() === "1",
        biVisible: window.config.sysConfig.logic_config.use_bi.toString() === "1",
        imVisible: window.config.sysConfig.logic_config.use_im.toString() === "1",
    },
    actions: {
        setSizeToFull: function () {
            this.el.removeClass('mini');
            this.el.find('.fold').removeClass('refold');
        },
        setSizeToMini: function () {
            this.el.addClass('mini');
            this.el.find('.fold').addClass('refold');
        },
        openBiIframe: function () {
            Mediator.emit('menu:item:openiframe', {
                id: 'bi',
                name: 'BI',
                url: window.config.sysConfig.bi_index
            });
        },
        openCalendarIframe: function () {
            Mediator.emit('menu:item:openiframe', {
                id: 'calendar',
                name: '日历',
                url: window.config.sysConfig.calendar_index
            });
        },
        openHome: function () {
            msgbox.alert("打开首页按钮预留");
        },
        otherLogin: function () {
            OtherLogin.show();
        },
        goOnlineNumber: function () {
            OnlineDisplay.show();
        },
        goSystemSetting: function () {
            SysSetting.show();
        },
        refreshOnlineNum: function (data) {
            this.el.find('.online-num span').text(data.online_user_num);
        },

        showMessageUnread: function () {
            this.el.find('.icon.message').addClass('unread');
        },

        hideMessageUnread: function () {
            this.el.find('.icon.message').removeClass('unread');
        },

        openMessageDialog: function () {
            this.actions.hideMessageUnread();
            // $("<div></div>").appendTo
            systemMessageUtil.show();
        },
        initGlobalSearch:function () {
            let component = new GlobalSearch();
            let $container = this.el.find(".global-search");
            component.render($container);
        },
        openPostMessageDialog: function () {
            postMessageUtil.show();
        },
        setOnlineNum:function () {
            //更新在线人数
            GlobalService.getOnlineUserData().done((result) => {
                if(result.success === 1){
                    if(result.total <= 999){
                        this.el.find('.online-num').find('span').html(result.total);
                    }else{
                        this.el.find('.online-num').find('span').html("999+");
                    }
                }else{
                    console.log("获取数据失败");
                }
            })
        }
    },

    afterRender: function () {
        this.el.tooltip();
    },
    firstAfterRender: function () {
        let that = this;
        this.el.on('click', '.fold', () => {
            this.data.asideSize = this.data.asideSize === 'full' ? 'mini' : 'full';
            Mediator.emit('aside:size', this.data.asideSize);
            if (this.data.asideSize === 'full') {
                this.actions.setSizeToFull();
            } else {
                this.actions.setSizeToMini();
            }
        }).on('click', '.bi', () => {
            this.actions.openBiIframe();
        }).on('click', '.calendar', () => {
            this.actions.openCalendarIframe();
        }).on('click', '.task', function () {
            // $(`<div>12123</div>`).appendTo('body').dialog({
            //     width: 400,
            //     height: 400,
            //     modal: true,
            //     title: '提示'
            // })
            // msgbox.confirm('xxxxxxxxxxxxx').then((res) => {
            //     console.log(res);
            // });
            // $(this).disableClick();
            //
            // console.log('click');

            // _.delay(function () {
            //     $(this).enableClick();
            // }.bind(this), 1000);

            msgbox.confirm('这是提示123123')

        }).on('click', '.online-num', () => {
            // msgbox.confirm('这是提示123123123')
            that.actions.goOnlineNumber();
        }).on('click', '.system-setting', () => {
            that.actions.goSystemSetting();
            // }).on('click','a.other-login', () => {   //他人登录
            //     this.actions.otherLogin();
        }).on('click', '.home', () => {
            this.actions.openHome();
        }).on('click', '.message', () => {
            this.actions.openMessageDialog();
        }).on('click', '.message-push', () => {
            this.actions.openPostMessageDialog();
        }).on('mouseenter','.setting', () => {
            this.actions.setOnlineNum();
        });
        Mediator.on('socket:online_user_num', that.actions.refreshOnlineNum);
        Mediator.on('socket:personal_message', this.actions.showMessageUnread);
        Mediator.on('socket:notice', this.actions.showMessageUnread);
        Mediator.on('socket:voice_message', this.actions.showMessageUnread);
        Mediator.on('socket:workflow_approve_msg', this.actions.showMessageUnread);
        Mediator.on('socket:online_user_num', function (data) {
            that.actions.refreshOnlineNum(data.online_user_num);
        });
        //加载全局搜索窗口
        this.actions.initGlobalSearch();
    },

    beforeDestory: function () {
        Mediator.removeAll('socket:online_user_num');
        Mediator.removeAll('socket:personal_message');
        Mediator.removeAll('socket:notice');
        Mediator.removeAll('socket:voice_message');
        Mediator.removeAll('socket:workflow_approve_msg');
    }
}

export const HeaderInstance = new Component(config, {});