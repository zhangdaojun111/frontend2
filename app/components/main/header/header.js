import Component from '../../../lib/component';
import template from './header.html';
import './header.scss';
import 'jquery-ui/ui/widgets/tooltip';
import Mediator from '../../../lib/mediator';
import msgbox from '../../../lib/msgbox';
import OtherLogin from "../login-by-other/login-by-other";

let config = {
    template: template,
    data: {
        asideSize: 'full',
        otherLoginVisible:window.config.sysConfig.logic_config.use_register,
        homeVisible:true,
        calendarVisible: window.config.sysConfig.logic_config.use_canlendar,
        biVisible: window.config.sysConfig.logic_config.use_bi,
        // imVisible: window.config.sysConfig.logic_config.use_im,
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
        otherLogin:function () {
            OtherLogin.show();
        },
        goOnlineNumber: function () {
            
        },
        goSystemSetting: function () {
            
        },
        openHome:function () {

        },

    },
    afterRender: function () {
        this.el.tooltip();
    },
    firstAfterRender: function () {
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

        }).on('click', '.online-num', () => {

        }).on('click','a.other-login', () => {   //他人登录
            this.actions.otherLogin();
        }).on('click','icon.home', () => {
            this.actions.openHome();
        });
        Mediator.on('socket:online_user_num', function (data) {
            console.log(data);
        });
    },
    
    beforeDestory: function () {
        Mediator.removeAll('socket:online_user_num');
    }
}

export const HeaderInstance = new Component(config, {

});