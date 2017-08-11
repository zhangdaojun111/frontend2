/**
 * Created by zj on 2017/8/2.
 */
import Component from "../../../lib/component";
import template from './calendar.setting.html';
import './calendar.setting.scss';
import Mediator from '../../../lib/mediator';
import CalendarSettingItem from './calendar.setting.item/calendar.setting.item';
import CalendarSet from '../../calendar.set/calendar.set';
import {CalendarService} from '../../../services/calendar/calendar.service';

let config = {
    template: template,
    data: {
        menu: []
    },
    actions: {

    },
    afterRender: function() {
        CalendarService.getMenu().then(res => {
            console.log(res);
            res['menuList'].forEach(item => {
                this.append(new CalendarSettingItem(item), this.el.find('.setting-content'));
            });
            this.append(new CalendarSet(res['menuList'][0]['table_id']), this.el.find('.calendar-setting-item-content'));
        });
        Mediator.on('calendar-left:calendar-set',data =>{
            this.el.find(".calendar-setting-item-content").empty();
            this.append(new CalendarSet(data.data), this.el.find('.calendar-setting-item-content'));
        });
        let that = this;
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

        })
    }
};

class CalendarSetting extends Component {
    constructor() {
        super(config);
    }
}

export default CalendarSetting;