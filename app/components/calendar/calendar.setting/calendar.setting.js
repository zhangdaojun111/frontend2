/**
 * Created by zj on 2017/8/2.
 */


import Component from "../../../lib/component";
import template from './calendar.setting.html';
import './calendar.setting.scss';
import Mediator from '../../../lib/mediator';
import CalendarSettingItem from './calendar.setting.item/calendar.setting.item';
import CalendarSet from '../../calendar.set/calendar.set';
import {CalendarSetService} from "../../../services/calendar/calendar.set.service"
import {SettingMenuComponent} from '../calendar.setting.menu/setting.menu';

let config = {
    template: template,
    data: {
        menu: [],
        isHide: true,
        calendarSet: []
    },
    actions: {
        getFilterMenu: function (keyValue, subMenu) {
            CalendarSetService.filterMenu(keyValue, subMenu).then(res => {
                let filterMenu = res['menu'];
                // let calendarSetItem = new CalendarSettingItem();
                // filterMenu.forEach(item => {
                //     calendarSetItem.data.menuItem = item;
                //     this.append(calendarSetItem, this.el.find('.setting-content'));
                // });
                let settingMenuComponent = new SettingMenuComponent({list: filterMenu});
                this.append(settingMenuComponent, this.el.find('.setting-content'));
            })
        },
        /**
         *设置左边菜单的隐藏
         */
        hideLeftMenu: function (isHide) {
            if (isHide) {
                this.data.isHide = false;
                this.el.find('.setting-content').addClass('hide');
                this.el.find('.search').addClass('hide-search');
                this.el.find('.calendar-setting-items').addClass('hide-menu');
                this.el.find('.calendar-setting-item').addClass('hide');
            } else {
                this.data.isHide = true;
                this.el.find('.setting-content').removeClass('hide');
                this.el.find('.search').removeClass('hide-search');
                this.el.find('.calendar-setting-items').removeClass('hide-menu');
                this.el.find('.calendar-setting-item').removeClass('hide');
            }
        },

    },
    firstAfterRender: function () {

    },
    binds: [
        {
            event: 'click',
            selector: '.hide-con',
            callback: function () {
                this.actions.hideLeftMenu(this.data.isHide);
            }
        },
        {
            event: 'input propertychange',
            selector: '.setting-search',
            callback: function () {
                let keyValue = this.el.find('.setting-search').val();
                let subMenu = "";
                this.el.find('.setting-content').empty();
                if (keyValue !== '') {
                    this.actions.getFilterMenu(keyValue, subMenu);

                } else {
                    // let calendarSetItem = new CalendarSettingItem();
                    // this.data.menu.forEach(item => {
                    //     calendarSetItem.data.menuItem = item;
                    //     this.append(calendarSetItem, this.el.find('.setting-content'));
                    // });
                    let settingMenuComponent = new SettingMenuComponent({list: this.data.menu});
                    this.append(settingMenuComponent, this.el.find('.setting-content'));
                }
            }
        },
    ],
    afterRender: function () {
        // let calendarSetItem = new CalendarSettingItem();
        // this.data.menu.forEach(item => {
        //     calendarSetItem.data.menuItem = item;
        //     this.append(calendarSetItem, this.el.find('.setting-content'));
        // });
        let settingMenuComponent = new SettingMenuComponent({list: this.data.menu});
        this.append(settingMenuComponent, this.el.find('.setting-content'));
        Mediator.on('calendar-set-left:calendar-set', data => {
            this.el.find('.form-title').html('【' + data.label + '】');
            this.el.find('.calendar-setting-item-content').empty();
            this.append(new CalendarSet(data.table_id), this.el.find('.calendar-setting-item-content'));
        });
    },
    beforeDestory: function () {
        debugger;
        Mediator.removeAll('calendar-set-left:calendar-set');
    }
};

class CalendarSetting extends Component {
    constructor(data) {
        config.data.menu = data;
        super(config);
    }
}

export default CalendarSetting;