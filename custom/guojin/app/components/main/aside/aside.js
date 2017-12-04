/**
 * Created by zj on 2017/12/1.
 */
import {AsideComponent as AsideComponentOld} from '../../../../../../app/components/main/aside/aside'
import WorkbenchComponent from '../workbench/workbench';
import Mediator from '../../../../../../app/lib/mediator';
import template from './aside.html';
import './aside.scss';
let config = {
    template: template,
    data: {
    },
    actions: {


    },
    afterRender: function () {
        if (window.config && window.config.menu) {
            this.allBtn = this.el.find('.tabs p.all');
            this.commonBtn = this.el.find('.tabs p.common');
            this.actions.initAvatar();
            // if (window.config.isCommon === "0" || window.config.commonUse.data.length === 0) {
            //     this.actions.showAllMenu();
            // } else {
            //     this.actions.showCommonMenu();
            // }
        }
        this.append(new WorkbenchComponent(), this.el.find('.workbench'));
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
        });
        Mediator.on('tool-bar: workbench', () => {
            this.el.find('.workbench').empty();
            this.el.find('.menu').css('display','none');
            this.el.find('.menu-setting').css('display','none');
            this.append(new WorkbenchComponent(), this.el.find('.workbench'));
        });
        Mediator.on('tool-bar: folder', () => {
            this.el.find('.menu').css('display', 'inline');
            this.el.find('.workbench').empty();
            this.el.find('.menu-setting').css('display','inline');
            if (window.config.isCommon === "0" || window.config.commonUse.data.length === 0) {
                this.actions.showAllMenu();
            } else {
                this.actions.showCommonMenu();
            }
        });
        Mediator.on('tool-bar: message', () => {
            this.el.find('.workbench').empty();
            this.el.find('.menu').css('display','none');
            this.el.find('.menu-setting').css('display','none');
            let html = `<div class="list-item-label"><span class="title">消息提醒</span></div>`;
            this.el.find('.workbench').html(html);
        });
        Mediator.on('tool-bar: calendar', () => {
            this.el.find('.workbench').empty();
            this.el.find('.menu').css('display','none');
            this.el.find('.menu-setting').css('display','none');
            let html = `<div class="list-item-label"><span class="title">日历</span></div>`;
            this.el.find('.workbench').html(html);
        });
        Mediator.on('tool-bar: setting', () => {
            this.el.find('.workbench').empty();
            this.el.find('.menu').css('display','none');
            this.el.find('.menu-setting').css('display','none');
            let html = `<div class="list-item-label"><span class="title">主题设置</span></div>`;
            this.el.find('.workbench').html(html);
        })
    },
    beforeDestory: function() {
        Mediator.removeAll('aside');
        Mediator.removeAll('tool-bar');
        Mediator.removeAll('commonuse');
        Mediator.removeAll('personal');
    }
};

class AsideComponent extends AsideComponentOld{
    constructor(){
        super(config);
    }
}
export {AsideComponent};
