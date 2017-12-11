/**
 * Created by zj on 2017/8/2.
 */


import Component from "../../../lib/component";
import template from './calendar.setting.html';
import './calendar.setting.scss';
import Mediator from '../../../lib/mediator';
import CalendarSet from '../../calendar.set/calendar.set';
import {CalendarSetService} from "../../../services/calendar/calendar.set.service"
import {SettingMenuComponent} from '../calendar.setting.menu/setting.menu';
import {PMAPI, PMENUM} from '../../../lib/postmsg';
import {CalendarService} from '../../../services/calendar/calendar.service';
let config = {
    template: template,
    data: {
        menu: [],
        isHide: true,
        calendarSet: [],
        cancel_fields:[],
    },
    actions: {
        getFilterMenu: function (keyValue, subMenu) {
            CalendarSetService.filterMenu(keyValue, subMenu).then(res => {
                let filterMenu = res['menu'];
                let settingMenuComponent = new SettingMenuComponent({data: {list: filterMenu}});
                this.append(settingMenuComponent, this.el.find('.setting-content'));
            })
        },
        /**
         *设置左边菜单的隐藏
         */
        hideLeftMenu: function (isHide) {
            if (isHide) {
                this.data.isHide = false;
                this.el.find('.setting-content,.calendar-setting-item').addClass('hide');
                this.el.find('.search').addClass('hide-search');
                this.el.find('.calendar-setting-items').addClass('hide-menu');
            } else {
                this.data.isHide = true;
                this.el.find('.setting-content,.calendar-setting-item').removeClass('hide');
                this.el.find('.search').removeClass('hide-search');
                this.el.find('.calendar-setting-items').removeClass('hide-menu');
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
                    let settingMenuComponent = new SettingMenuComponent({data: {list: this.data.menu}});
                    this.append(settingMenuComponent, this.el.find('.setting-content'));
                }
            }
        },
    ],
    afterRender: function () {
        PMAPI.getIframeParams(window.config.key).then(params => {
            this.data.cancel_fields = params.data.cancel_fields;
        });
        Mediator.on('Calendar:calendarReset', data => {
            this.data.cancel_fields = _.difference(this.data.cancel_fields, data);
            let preference = {"content": this.data.cancel_fields};
            CalendarService.getCalendarPreference(preference);
        });
        // let settingMenuComponent = new SettingMenuComponent({list: this.data.menu});
        let settingMenuComponent = new SettingMenuComponent({data: {list: this.data.menu}});
        this.append(settingMenuComponent, this.el.find('.setting-content'));
        Mediator.on('calendar-set-left:calendar-set', data => {
            this.el.find('.form-title').html('【' + data.label + '】');
            this.el.find('.calendar-setting-item-content').empty();
            this.append(new CalendarSet({data: {tableId: data.table_id}}), this.el.find('.calendar-setting-item-content'));
        });
    },
    beforeDestory: function () {
        debugger;
        Mediator.removeAll('calendar-set-left:calendar-set');
    }
};

// class CalendarSetting extends Component {
//     constructor(data) {
//         config.data.menu = data;
//         super(config);
//     }
// }
//
// export default CalendarSetting;
let CalendarSetting = Component.extend(config);

export default CalendarSetting;