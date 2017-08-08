import Component from "../../../../lib/component";
import template from './left-calendar.html';
import './left-calendar.scss';

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
            console.log(week);
            let calendarTable = [];
            for(let i=0 ;i<42;i++){
                calendarTable[i] = "";　//清空原来的text文本
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
        loadcalendarDate:function(yy,mm,dd){
            $(".now-year").html(yy);
            $(".now-month").html(mm);
            $("#calendar-body").html();
            let strhtml = config.actions.loadcalendarHtml(yy,mm,dd);
            $("#calendar-body").html(strhtml);
            $(".now-month-day").bind("click",function(){
                let nowYear = $(".now-year").html(),
                    nowMonth = $(".now-month").html(),
                    nowDay = $(this).html();
                CalendarService.CalendarMsgMediator.publish('leftSelectedDate', {year: nowYear, month: nowMonth, day: nowDay});
                $(".now-pitch-on").removeClass("now-pitch-on");
                $(this).addClass("now-pitch-on");
            });
            $(".last-month-day").on("click",function(){
                let nowYear = yy = $(".now-year").html(),
                    nowMonth = mm = $(".now-month").html(),
                    nowDay = dd = $(this).html();
                if(mm == 1){
                    mm = 12;
                    yy = parseInt(yy)-1;
                }
                else{
                    mm = parseInt(mm)-1;
                }
                CalendarService.CalendarMsgMediator.publish('last-month-day', {time: [yy,mm,dd]});
                config.actions.loadCalendarLastMonthData(nowYear,nowMonth,nowDay);
                let nowclickday = $(this).html();
                $(".now-month-day").each(function(){
                    if($(this).html() == nowclickday){
                        $(this).addClass("now-pitch-on");
                    }
                });
            });
            $(".next-month-day").on("click",function(yy,mm,dd){
                let nowYear = yy = $(".now-year").html(),
                    nowMonth = mm = $(".now-month").html(),
                    nowDay = dd = $(this).html();
                if(mm == 12){
                    mm = 1;
                    yy = parseInt(yy)+1;
                }
                else{
                    mm = parseInt(mm)+1;
                }
                CalendarService.CalendarMsgMediator.publish('next-month-day', {time: [yy,mm,dd]});
                config.actions.loadCalendarNextMonthData(nowYear,nowMonth,nowDay);
                let nowclickday = $(this).html();
                $(".now-month-day").each(function(){
                    if($(this).html() == nowclickday){
                        $(this).addClass("now-pitch-on");
                    }
                });
            });
        },
        loadCalendarLastMonthData:function(nowYear,nowMonth,dd){
            if(nowMonth == 1){
                nowMonth = 12;
                nowYear = nowYear -1;
            }
            else{
                nowMonth = nowMonth - 1;
            }
            config.actions.loadcalendarDate(nowYear,nowMonth,dd);
        },
        loadCalendarNextMonthData:function(nowYear,nowMonth,dd){
            if(nowMonth == 12){
                nowMonth = 1;
                nowYear = parseInt(nowYear)+1;
            }
            else{
                nowMonth = parseInt(nowMonth)+1;
            }
            config.actions.loadcalendarDate(nowYear,nowMonth,dd);
        },
    },
    afterRender: function() {
        config.actions.loadcalendarDate(year,month,day);
        this.el.on("click",".change-month-left",function(){
            let nowYear = $(".now-year").html(),
                nowMonth = $(".now-month").html(), day = day;
            config.actions.loadCalendarLastMonthData(nowYear,nowMonth,day);
        }).on("click",".change-month-right",function(){
            let nowYear = $(".now-year").html(),
                nowMonth = $(".now-month").html(),
                day = day;
            config.actions.loadCalendarNextMonthData(nowYear,nowMonth,day);
        });

    }
};
class Leftcalendar extends Component {
    constructor() {
        super(config);
    }
}
export default Leftcalendar;