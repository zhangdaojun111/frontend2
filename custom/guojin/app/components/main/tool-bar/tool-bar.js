/**
 * Created by zj on 2017/11/30.
 */
import Component from '../../../../../../app/lib/component';
import template from './tool-bar.html';
import './tool-bar.scss';
import '../../../assets/scss/guojin/icon-guojin-toolbar.scss';
import 'jquery-ui/ui/widgets/tooltip';
import Mediator from '../../../../../../app/lib/mediator';
import {systemMessageUtil} from '../../../../../../app/components/main/system-message/system-message';
import {SysSetting} from "../../../../../../app/components/main/system-setting/system-setting"
import {PMAPI, PMENUM} from '../../../../../../app/lib/postmsg';

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
         * 打开日历窗口
         */
        openCalendarIframe: function () {
            Mediator.emit('menu:item:openiframe', {
                id: 'calendar',
                name: '日历',
                url: window.config.sysConfig.calendar_index
            });
        },
        /**
         * 将菜单尺寸设为正常模式
         */
        setSizeToFull: function () {
            $('#header').removeClass('mini');
            $('.fold').removeClass('refold');
        },
        /**
         * 将菜单尺寸设为迷你模式
         */
        setSizeToMini: function () {
            $('#header').addClass('mini');
            $('.fold').addClass('refold');
        },
        /**
         * 系统设置界面显示
         */
        goSystemSetting: function () {
            SysSetting.show();
        },

        /**
         * 有未读的消息显示红点提醒
         */
        displayMessageUnread: function (data) {
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
    },
    binds: [
        {
            event: 'click',
            selector: '.icon-toolbar-message',
            callback: function(){
                this.el.find('.icon, .icon-toolbar').removeClass('active');
                this.el.find('.message, .icon-toolbar-message').addClass('active');
                this.actions.openMessageDialog();
            }
        },  {
            event: 'click',
            selector: '.icon-toolbar-workbench',
            callback: function(){
                this.el.find('.icon, .icon-toolbar').removeClass('active');
                this.el.find('.workbench, .icon-toolbar-workbench').addClass('active');
                Mediator.emit('tool-bar: workbench');
            }
        },  {
            event: 'click',
            selector: '.icon-toolbar-calendar',
            callback: function () {
                this.el.find('.icon, .icon-toolbar').removeClass('active');
                this.el.find('.calendar, .icon-toolbar-calendar').addClass('active');
                this.actions.openCalendarIframe();
            }
        }, {
            event: 'click',
            selector: '.icon-toolbar-folder',
            callback: function(){
                this.el.find('.icon, .icon-toolbar').removeClass('active');
                this.el.find('.folder, .icon-toolbar-folder').addClass('active');
                Mediator.emit('tool-bar: folder');
            }
        },  {
            event: 'click',
            selector: '.icon-toolbar-setting',
            callback: function () {
                this.el.find('.icon, .icon-toolbar').removeClass('active');
                this.el.find('.setting, .icon-toolbar-setting').addClass('active');
                this.actions.goSystemSetting();
            }
        },
    ],

    afterRender: function () {
        this.el.tooltip();
        this.actions.displayMessageUnread({
            badge: window.config.sysConfig.unread_msg_count
        });
    },
    firstAfterRender: function () {
        // let that = this;
        // Mediator.on('socket:online_user_num', that.actions.refreshOnlineNum);
        // Mediator.on('socket:personal_message', this.actions.displayMessageUnread);
        // Mediator.on('socket:notice', this.actions.onSocketNotice);
        // Mediator.on('sysmsg:refresh_unread',(data) => {
        //     that.actions.displayMessageUnread({
        //         badge: window.config.sysConfig.unread_msg_count
        //     })
        // });
        //加载全局搜索窗口

    },

    beforeDestory: function () {
    }
};

class ToolBar extends Component{
    constructor(newConfig){
        super($.extend(true,{},config,newConfig))
    }
}

export {ToolBar};

// export const HeaderInstance = new Component(config, {});