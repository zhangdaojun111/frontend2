import Component from '../../../lib/component';
import template from './header.html';
import './header.scss';
import 'jquery-ui/ui/widgets/tooltip';
import Mediator from '../../../lib/mediator';
import msgbox from '../../../lib/msgbox';
import {systemMessageUtil} from '../system-message/system-message';
import {SysSetting} from "../system-setting/system-setting"
import {postMessageUtil} from '../post-message/post-message';
import {GlobalSearch} from '../global-search/global-search';
import {OnlineDisplay} from "../online-users/online-users"

let config = {
    template: template,
    data: {
        asideSize: 'full',
        postMessageVisible: window.config.sysConfig.userInfo.is_superuser.toString() === "1",
        calendarVisible: window.config.sysConfig.logic_config.use_calendar.toString() === "1",
        biVisible: window.config.sysConfig.logic_config.use_bi.toString() === "1",
        // imVisible: window.config.sysConfig.logic_config.use_im.toString() === "1",
    },
    actions: {
        /**
         * 将菜单尺寸设为正常模式
         */
        setSizeToFull: function () {
            this.el.removeClass('mini');
            this.el.find('.fold').removeClass('refold');
        },
        /**
         * 将菜单尺寸设为迷你模式
         */
        setSizeToMini: function () {
            this.el.addClass('mini');
            this.el.find('.fold').addClass('refold');
        },
        /**
         * 打开bi窗口
         */
        openBiIframe: function () {
            Mediator.emit('menu:item:openiframe', {
                id: 'bi',
                name: 'BI',
                url: window.config.sysConfig.bi_index
            });
        },
        /**
         * 打开日历窗口
         */
        openCalendarIframe: function () {
            Mediator.emit('menu:item:openiframe', {
                id: 'calendar',
                name: '日历',
                url: window.config.sysConfig.calendar_index
            });
        },
        // openHome: function () {
        //     msgbox.alert("打开首页按钮预留");
        // },
        /**
         * 在线人数页面显示
         */
        goOnlineNumber: function () {
            OnlineDisplay.show();
        },
        /**
         * 系统设置界面显示
         */
        goSystemSetting: function () {
            SysSetting.show();
        },
        /**
         * 刷新在线人数提示
         */
        refreshOnlineNum: function (data) {
            let title = "在线人数：" + data.online_user_num;
            this.el.find('a.online-num').attr("title",title);
        },
        /**
         * 有未读的消息显示红点提醒
         */
        displayMessageUnread: function (data) {
            console.log('do reset red point')
            let badge = parseInt(data.badge);
            if (_.isNaN(badge)) {
                badge = 0;
            }
            if (badge > 0) {
                this.el.find('.icon.message').addClass('unread');
            } else {
                this.el.find('.icon.message').removeClass('unread');
            }
        },
        /**
         * 消息提醒界面显示
         */
        openMessageDialog: function () {
            systemMessageUtil.show();
        },
        /**
         * 全局搜索框组件初始化
         */
        initGlobalSearch:function () {
            let component = new GlobalSearch();
            let $container = this.el.find(".global-search");
            component.render($container);
        },
        /**
         * 打开消息推送界面
         */
        openPostMessageDialog: function () {
            postMessageUtil.show();
        },
        /**
         * 显示单条推送消息
         */
        onSocketNotice: function (data = {}) {
            systemMessageUtil.showMessageDetail('推送消息', data.title, data.content, true);
        }
        // setOnlineNum:function () {
        //     //更新在线人数
        //     GlobalService.getOnlineUserData().done((result) => {
        //         if(result.success === 1){
        //             if(result.total <= 999){
        //                 this.el.find('.online-num').find('span').html(result.total);
        //             }else{
        //                 this.el.find('.online-num').find('span').html("999+");
        //             }
        //         }else{
        //             console.log("获取数据失败");
        //         }
        //     })
        // }
    },
    binds: [
        {
            event: 'click',
            selector: '.fold',
            callback: function () {
                this.data.asideSize = this.data.asideSize === 'full' ? 'mini' : 'full';
                Mediator.emit('aside:size', this.data.asideSize);
                if (this.data.asideSize === 'full') {
                    this.actions.setSizeToFull();
                } else {
                    this.actions.setSizeToMini();
                }
            }
        }, {
            event: 'click',
            selector: '.bi',
            callback: function (context) {
                this.actions.openBiIframe();
            }
        }, {
            event: 'click',
            selector: '.calendar',
            callback: function () {
                this.actions.openCalendarIframe();
            }
        }, {
            event: 'click',
            selector: '.task',
            callback: function () {
                msgbox.confirm('这是提示123123')
            }
        }, {
            event: 'click',
            selector: '.online-num',
            callback: function () {
                this.actions.goOnlineNumber();
            }
        }, {
            event: 'click',
            selector: '.setting',
            callback: function () {
                this.actions.goSystemSetting();
            }
        }, {
            event: 'click',
            selector: '.home',
            callback: function(){
                this.actions.openHome();
            }
        }, {
            event: 'click',
            selector: '.message',
            callback: function(){
                this.actions.openMessageDialog();
            }
        }, {
            event: 'click',
            selector: '.message-push',
            callback: function(){
                this.actions.openPostMessageDialog();
            }
        }
    ],

    afterRender: function () {
        this.el.tooltip();
        this.actions.displayMessageUnread({
            badge: window.config.sysConfig.unread_msg_count
        });
    },
    firstAfterRender: function () {
        let that = this;
        Mediator.on('socket:online_user_num', that.actions.refreshOnlineNum);
        Mediator.on('socket:personal_message', this.actions.displayMessageUnread);
        Mediator.on('socket:notice', this.actions.onSocketNotice);
        Mediator.on('sysmsg:refresh_unread',(data) => {
            that.actions.displayMessageUnread({
                badge: window.config.sysConfig.unread_msg_count
            })
        });
        //加载全局搜索窗口
        this.actions.initGlobalSearch();
    },

    beforeDestory: function () {
        // Mediator.removeAll('socket:online_user_num');
        // Mediator.removeAll('socket:personal_message');
        // Mediator.removeAll('socket:notice');
        // Mediator.removeAll('socket:voice_message');
        // Mediator.removeAll('socket:workflow_approve_msg');
    }
}

class HeaderComponent extends Component{
    constructor(newConfig){
        super($.extend(true,{},config,newConfig))
    }
}

export {HeaderComponent};

// export const HeaderInstance = new Component(config, {});