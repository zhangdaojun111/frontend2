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

let config = {
    template: template,
    data: {
        menu: []
    },
    actions: {
        getFilterMenu: function (keyValue, subMenu) {
            CalendarSetService.filterMenu(keyValue, subMenu).then(res => {
                console.log(res);
                let filterMenu = res['menu'];
                let calendarSetItem = new CalendarSettingItem();
                filterMenu.forEach(item => {
                    calendarSetItem.data.menuItem = item;
                    this.append(calendarSetItem, this.el.find('.setting-content'));
                });
            })
        }
    },
    firstAfterRender: function () {

    },
    afterRender: function() {
        let calendarSetItem = new CalendarSettingItem();
        this.data.menu.forEach(item => {
            calendarSetItem.data.menuItem = item;
            this.append(calendarSetItem, this.el.find('.setting-content'));
        });
        let _this = this;
        this.el.on('input propertychange', '.setting-search', () => {
            let keyValue = _this.el.find('.setting-search').val();
            let subMenu = "";
            this.el.find('.setting-content').empty();
            if(keyValue !== '') {
                _this.actions.getFilterMenu(keyValue, subMenu);

            }else {
                let calendarSetItem = new CalendarSettingItem();
                this.data.menu.forEach(item => {
                    calendarSetItem.data.menuItem = item;
                    this.append(calendarSetItem, this.el.find('.setting-content'));
                });
            }

        });

        Mediator.on('calendar-set-left:calendar-set',data =>{
            this.el.find('.form-title').html('【'+ data.label +'】');
            this.el.find('.calendar-setting-item-content').empty();
            //$(".calendar-setting-item-content").empty();
            this.append(new CalendarSet(data.data), this.el.find('.calendar-setting-item-content'));
        });
        let isHide = true;
        this.el.on('click',".hide-con",function(){
            if(isHide) {
                isHide = false;
                _this.el.find('.setting-content').addClass('hide');
                _this.el.find('.search').addClass('hide-search');
                _this.el.find('.calendar-setting-items').addClass('hide-menu');
                _this.el.find('.calendar-setting-item').addClass('hide');
            } else {
                isHide = true;
                _this.el.find('.setting-content').removeClass('hide');
                _this.el.find('.search').removeClass('hide-search');
                _this.el.find('.calendar-setting-items').removeClass('hide-menu');
                _this.el.find('.calendar-setting-item').removeClass('hide');
            }
        });

    },
    beforeDestory: function () {
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