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
                CalendarSetService.filterMenu(keyValue, subMenu).then(res => {
                    console.log(res);
                    let filterMenu = res['menu'];
                    let calendarSetItem = new CalendarSettingItem();
                    filterMenu.forEach(item => {
                        calendarSetItem.data.menuItem = item;
                        this.append(calendarSetItem, this.el.find('.setting-content'));
                    });
                })
            }else {
                let calendarSetItem = new CalendarSettingItem();
                this.data.menu.forEach(item => {
                    calendarSetItem.data.menuItem = item;
                    this.append(calendarSetItem, this.el.find('.setting-content'));
                });
            }

        });

        Mediator.on('calendar-left:calendar-set',data =>{
            this.el.find(".calendar-setting-item-content").empty();
            this.append(new CalendarSet(data.data), this.el.find('.calendar-setting-item-content'));
        });

        let that = this;
        Mediator.on('calendar-left:calendar-set',data =>{
            that.el.find(".calendar-setting-item-content").empty();
            console.log(data.data);
            that.append(new CalendarSet(data.data), this.el.find('.calendar-setting-item-content'));
        });
        this.el.on('click',".hide-con",function(){
            if(!$(this).is(".is-hide")){
                $(this).addClass("is-hide");
                that.el.find(".calendar-setting-items").css("width","30px");
                that.el.find(".search").hide();
                that.el.find(".setting-content").hide();
                that.el.find(".calendar-setting-item").css("width","calc(100% - 45px)");
            } else{
                $(this).removeClass("is-hide");
                that.el.find(".calendar-setting-items").css("width","200px");
                that.el.find(".search").show();
                that.el.find(".setting-content").show();
                that.el.find(".calendar-setting-item").css("width","calc(100% - 220px)");
            }

        });

    }
};

class CalendarSetting extends Component {
    constructor(data) {
        config.data.menu = data;
        super(config);
    }
}

export default CalendarSetting;