/**
 * Created by lipengfei.
 * 左侧小日历（已删除）
 */
import Component from "../../../../lib/component";
import template from './left-calendar.html';
import './left-calendar.scss';
import Mediator from '../../../../lib/mediator';
import {CalendarService} from '../../../../services/calendar/calendar.service';

let date = new Date(),
    year = date.getFullYear(),
    month = date.getMonth() + 1,
    day = date.getDate();
let config = {
    template: template,
    actions: {
        getdays:function(yy,mm){
            let time = yy+"-"+mm;
            let moment = require('moment');
            return moment(time,"YYYY-MM").daysInMonth();
        },
        getLastMonthDays:function(yy,mm){
            if(mm===1){
                return config.actions.getdays(yy-1,12);
            }
            return config.actions.getdays(yy,mm-1);
        },
        initCal:function(yy,mm,dd){
            let time = yy+"-"+mm+"-01";
            let moment = require('moment');
            let week = moment(time,"YYYY-MM-DD").format('d');
            let calendarTable = [];
            for(let i=0 ;i<42;i++){
                calendarTable[i] = "";　
            }
            let daysNowMonth = config.actions.getdays(yy,mm);
            for(let i = 0;i < daysNowMonth; i++){
                calendarTable[week % 7 +i] = i+1;
            }
            let daysLastMonth = config.actions.getLastMonthDays(yy,mm);
            for(let i = 0;i < week % 7;i++){
                calendarTable[week % 7 - i -1] = daysLastMonth - i;
            }
            for(let i = 0;i<42-week % 7-daysNowMonth;i++){
                calendarTable[week % 7 + daysNowMonth+i] = i+1;
            }
            return calendarTable;
        },
        loadcalendarHtml:function(yy,mm,dd){
            let strhtml = "";
            let dayTables = config.actions.initCal(yy,mm,dd);
            for(let i = 0;i < 2;i++){
                strhtml +="<tr>";
                for(let j = 0;j < 7;j++){
                    if(14<dayTables[i*7+j]) {
                        strhtml+="<td class='last-month-day'>"+ dayTables[i*7+j] +"</td>";
                    }
                    else if(dayTables[i*7+j] === day && mm === month && yy === year) {
                        strhtml+="<td class='now-month-day now-pitch-on' id ='now-day'>"+ dayTables[i*7+j] +"</td>";
                    } else {
                        strhtml+="<td class='now-month-day'>"+ dayTables[i*7+j] +"</td>";
                    }
                }
                strhtml +="</tr>";
            }
            for(let i = 2;i < 4;i++){
                strhtml +="<tr>";
                for(let j = 0;j < 7;j++){
                    if(dayTables[i*7+j] === day&& mm === month&&yy === year) {
                        strhtml+="<td class='now-month-day now-day'>"+ dayTables[i*7+j] +"</td>";
                    } else {
                        strhtml+="<td class='now-month-day'>"+ dayTables[i*7+j] +"</td>";
                    }
                }
                strhtml +="</tr>";
            }
            for(let i = 4;i < 6;i++){
                strhtml +="<tr>";
                for(let j = 0;j < 7;j++){
                    if(dayTables[i*7+j] < 14) {
                        strhtml+="<td class='next-month-day'>"+ dayTables[i*7+j] +"</td>";
                    }
                    else if(dayTables[i*7+j] === day&& mm === month&&yy === year) {
                        strhtml+="<td class='now-month-day now-day'>"+ dayTables[i*7+j] +"</td>";
                    } else {
                        strhtml+="<td class='now-month-day'>"+ dayTables[i*7+j] +"</td>";
                    }
                }
                strhtml +="</tr>";
            }
            return strhtml;
        },
        loadcalendarDate:function(yy,mm,dd,that){
            that.el.find(".now-year").html(yy);
            that.el.find(".now-month").html(mm);
            that.el.find("#calendar-body").html();
            let strhtml = config.actions.loadcalendarHtml(yy,mm,dd);
            that.el.find("#calendar-body").html(strhtml);
        },
        loadCalendarLastMonthData:function(nowYear,nowMonth,dd,that){
            if(nowMonth == 1){
                nowMonth = 12;
                nowYear = nowYear -1;
            }
            else{
                nowMonth = nowMonth - 1;
            }
            config.actions.loadcalendarDate(nowYear,nowMonth,dd,that);
        },
        loadCalendarNextMonthData:function(nowYear,nowMonth,dd,that){
            if(nowMonth == 12){
                nowMonth = 1;
                nowYear = parseInt(nowYear)+1;
            }
            else{
                nowMonth = parseInt(nowMonth)+1;
            }
            config.actions.loadcalendarDate(nowYear,nowMonth,dd,that);
        },
    },
    afterRender: function() {
        let that = this;
        config.actions.loadcalendarDate(year,month,day,that);
        this.el.on("click",".change-month-left",function(){
            let nowYear = that.el.find(".now-year").html(),
                nowMonth = that.el.find(".now-month").html(), day = day;
            config.actions.loadCalendarLastMonthData(nowYear,nowMonth,day,that);
        }).on("click",".change-month-right",function(){
            let nowYear = that.el.find(".now-year").html(),
                nowMonth = that.el.find(".now-month").html(),
                day = day;
            config.actions.loadCalendarNextMonthData(nowYear,nowMonth,day,that);
        }).on("click",".last-month-day",function(yy,mm,dd){
            let nowYear = yy = that.el.find(".now-year").html(),
                nowMonth = mm = that.el.find(".now-month").html(),
                nowDay = dd = $(this).html();
            if(mm == 1){
                mm = 12;
                yy = parseInt(yy)-1;
            }
            else{
                mm = parseInt(mm)-1;
            }
            Mediator.emit('calendar-left:leftSelectedDate',{year: yy, month: mm, day: dd});
            config.actions.loadCalendarLastMonthData(nowYear,nowMonth,nowDay,that);
            let nowclickday = $(this).html();
            that.el.find(".now-month-day").each(function(){
                if($(this).html() == nowclickday){
                    $(this).addClass("now-pitch-on");
                }
            });
        }).on("click",".next-month-day",function(yy,mm,dd){
            let nowYear = yy = that.el.find(".now-year").html(),
                nowMonth = mm = that.el.find(".now-month").html(),
                nowDay = dd = $(this).html();
            if(mm == 12){
                mm = 1;
                yy = parseInt(yy)+1;
            }
            else{
                mm = parseInt(mm)+1;
            }
            Mediator.emit('calendar-left:leftSelectedDate',{year: yy, month: mm, day: dd});
            config.actions.loadCalendarNextMonthData(nowYear,nowMonth,nowDay,that);
            let nowclickday = $(this).html();
            that.el.find(".now-month-day").each(function(){
                if($(this).html() == nowclickday){
                    $(this).addClass("now-pitch-on");
                }
            });
        }).on("click",".now-month-day",function(){
            let nowYear = that.el.find(".now-year").html(),
                nowMonth = that.el.find(".now-month").html(),
                nowDay = that.el.find(this).html();
            Mediator.emit('calendar-left:leftSelectedDate',{year: nowYear, month: nowMonth, day: nowDay});
            that.el.find(".now-pitch-on").removeClass("now-pitch-on");
            that.el.find(this).addClass("now-pitch-on");
        });
    }
};
class Leftcalendar extends Component {
    constructor() {
        super(config);
    }
}
export default Leftcalendar;