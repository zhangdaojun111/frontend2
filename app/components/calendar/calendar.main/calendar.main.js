/**
 * Created by zj on 2017/7/27.
 */
import Component from "../../../lib/component";
import template from './calendar.main.html';
import './calendar.main.scss';

import CalendarMonth from './calendar.month/calendar.month';
import CalendarWeek from './calendar.week/calendar.week';
import CalendarDay from './calendar.day/calendar.day';

import {CalendarService} from '../../../service/calendar.service';

let config = {
    template: template,
    data: {
        leftChooseDate: '',
        monthDataList: [],
        weekDataList: [],
        todayStr: '',
        calendarContent: 'month',
        selectData: {},
        selectedDateShow: '2121'
    },
    actions: {
        getDayNumOfMonth: function ( year , month ) {
            month++;
            let d = new Date( year , month , 0 );
            return d.getDate();
        },
        getWeekByDay: function( year, month, day ){
            let d = new Date( year, month, day );
            return d.getDay();
        },
        addZero( num ){
            return ( num < 10 ) ? ( "0" + num ) : num;
        },

        createMonthCalendar: function (y,m){
            let monthDayNum = this.actions.getDayNumOfMonth( y , m ),
                firstDayWeek = this.actions.getWeekByDay( y , m , 1 );
            let endNum = ( monthDayNum + firstDayWeek ) > 35 ? 42 : 35;
            let startNum = 1 - firstDayWeek;

            //组成数据
            this.data.monthDataList.length = 0;

            let arr = [];
            for( let i=1; i<=42 ;i++ ){
                let obj = {};
                if( startNum<1 || startNum>monthDayNum){
                    obj['isPartOfMonth'] = false;
                }else {
                    let dateTime = y + "-" + this.actions.addZero( m + 1 ) + "-" + this.actions.addZero( startNum );
                    obj['isToday'] = dateTime == this.data.todayStr ? true : false;
                    obj['dataTime'] = dateTime;
                    obj['dayNum'] = startNum;
                    obj['week'] = arr.length;
                    obj['year'] = y;
                    obj['month'] = m;
                    // obj['isSelect'] = ( this.chooseDate == dateTime ) ? true : false;
                    obj['isPartOfMonth'] = true;
                }
                startNum++;
                arr.push( obj );
                if( i % 7 === 0 && i >= 7 ){
                    this.data.monthDataList.push( { "weekList": arr } );
                    arr  =[];
                }
            }
            let pre_m = m,
                pre_y = y;
            if( pre_m === 0 ){
                pre_y = pre_y-1;
                pre_m = 11;
            }else {
                pre_m = pre_m - 1;
            }
            let prevMonthNum = this.actions.getDayNumOfMonth( pre_y , pre_m );
            for( let i=6 ;i>=0; i-- ){
                let day = this.data.monthDataList[0]['weekList'][i];
                if( !day['isPartOfMonth'] ){
                    day['dayNum'] = prevMonthNum;
                    day['week'] = 6-i;
                    day['year'] = pre_y;
                    day['month'] = pre_m;
                    day['dataTime'] = pre_y + "-" + this.actions.addZero( pre_m + 1 ) + "-" + this.actions.addZero( prevMonthNum );
                    prevMonthNum--;
                }
            }

            let next_m = m,
                next_y = y;
            if( next_m === 11 ){
                next_y = next_y + 1;
                next_m = 0;
            }else {
                next_m = next_m + 1;
            }

            let j = 1;
            for( let i = 0;i<=6;i++ ){
                let day = this.data.monthDataList[4]['weekList'][i];
                if( !day['isPartOfMonth'] ){
                    day['dayNum'] = j;
                    day['week'] = i;
                    day['year'] = next_y;
                    day['month'] = next_m;
                    day['dataTime'] = next_y + "-" + this.actions.addZero( next_m + 1 ) + "-" + this.actions.addZero( j );
                    j++;
                }
            }
            for( let i = 0;i<=6;i++ ){
                let day = this.data.monthDataList[5]['weekList'][i];
                if( !day['isPartOfMonth'] ){
                    day['dayNum'] = j;
                    day['year'] = next_y;
                    day['month'] = next_m;
                    day['dataTime'] = next_y + "-" + this.actions.addZero( next_m + 1 ) + "-" + this.actions.addZero( j );
                    j++;
                }
            }


        },

        createWeekCalendar: function (){
            this.weekDataList = [];
            let weekData = [];
            for( let data of this.data.monthDataList ){
                //console.log(this.data.monthDataList);
                for( let d of data['weekList'] ){
                    if( d['dataTime'] === this.data.leftChooseDate ){
                        weekData = data['weekList'];
                        break;
                    }
                }
            }
            // let arrHead = [{time:'',isTime:true,isHead: true}];
            let arrHead = [];
            for( let d of weekData ){
                arrHead.push( {time:d.dataTime,isTime:false,isHead: true} );
            }

            this.data.weekDataList.push( arrHead );
            this.data.weekDataList.push( weekData );
        },

        changeMonth: function (lr) {
            let y = this.data.selectData['y'];
            let m = this.data.selectData['m'];
            if( m > 0 && lr === 'l' ){
                this.data.selectData['m'] = m - 1;
            }
            if( m === 0 && lr === 'l' ){
                this.data.selectData['y'] = y - 1;
                this.data.selectData.m = 11;
            }
            if( m < 11 && lr === 'r' ){
                this.data.selectData['m'] = m + 1;
            }
            if( m === 11 && lr === 'r' ){
                this.data.selectData['y'] = y + 1;
                this.data.selectData['m'] = 0;
            }

            if(lr === 'l') {
                this.data.selectedDateShow = y +'年'+ m +'月';
                $('.nowDate').html(this.data.selectedDateShow);
                this.actions.createMonthCalendar(y, m-1);
            } else if (lr === 'r') {
                this.data.selectedDateShow = y +'年'+ (m+2) +'月';
                $('.nowDate').html(this.data.selectedDateShow);
                this.actions.createMonthCalendar(y, m+1);
            }
        },

        changeWeek: function (lr) {
            let slect = this.data.selectData.y + "-" + this.actions.addZero( this.data.selectData.m + 1 ) + "-" + this.actions.addZero( this.selectData.d );
            let oldWeekDay = new Date(slect).getTime();
            if( lr === 'l' ){
                oldWeekDay = oldWeekDay-7*24*60*60*1000;
            }else if( lr === 'r' ){
                oldWeekDay = oldWeekDay+7*24*60*60*1000;
            }
            let nweTime = new Date(oldWeekDay);
            let year = nweTime.getFullYear(),
                month = nweTime.getMonth(),
                day = nweTime.getDate(),
                week = nweTime.getDay();
            this.data.selectData = {'y':year, 'm':month, 'd':day, 'w':week};

        },

        changeDay: function (lr) {
            let oldDate = this.data.selectData.y+'-'+this.actions.addZero(this.data.selectData.m+1)+'-'+this.actions.addZero(this.data.selectData.d);
            let oldMyTime = new Date(oldDate).getTime();
            if( lr === 'l' ){
                oldMyTime = oldMyTime - 24*60*60*1000;
            }else if( lr === 'r' ) {
                oldMyTime = oldMyTime + 24*60*60*1000;
            }
            let nweTime = new Date(oldMyTime);
            let year = nweTime.getFullYear(),
                month = nweTime.getMonth(),
                day = nweTime.getDate(),
                week = nweTime.getDay();
            this.selectData = {'y':year, 'm':month, 'd':day, 'w':week};
        },

    },
    afterRender: function() {
        this.el.css({"height":"100%","width":"100%"});

        let oDate = new Date(),
            year = oDate.getFullYear(),
            month = oDate.getMonth(),
            day = oDate.getDate(),
            week = oDate.getDay();
        this.data.selectData = Object.assign({}, {'y': year, 'm':month, 'd':day, 'w':week});
        console.log(this.data.selectData);
        this.data.todayStr = year + "-" + this.actions.addZero( month + 1 ) + "-" + this.actions.addZero( day );
        this.data.leftChooseDate = '2017-07-29';
        this.data.selectedDateShow = year+'年'+(month+1) +'月';
        $('.nowDate').html(this.data.selectedDateShow);
        this.actions.createMonthCalendar(year, month);
        this.actions.createWeekCalendar();
        this.append(new CalendarMonth(this.data.monthDataList), this.el.find(".calendar-main-content"));

        CalendarService.CalendarMsgMediator.subscribe('now-month-day',data => {
            console.log(data);
        });
        CalendarService.CalendarMsgMediator.subscribe('next-month-day',data => {
            console.log(data);
        });

        this.el.on('click', '#monthView', () => {
            $('.calendar-main-content').empty();
            this.data.calendarContent = 'month';
            this.append(new CalendarMonth(this.data.monthDataList), this.el.find(".calendar-main-content"));
        }).on('click', '#weekView', () => {
            this.data.calendarContent = 'week';
            $('.calendar-main-content').empty();
            this.append(new CalendarWeek(this.data.weekDataList), this.el.find(".calendar-main-content"));
        }).on('click', '#dayView', () => {
            this.data.calendarContent = 'day';
            $('.calendar-main-content').empty();
            this.append(new CalendarDay(), this.el.find(".calendar-main-content"));
        }).on('click', '.pre-date', () => {
            if(this.data.calendarContent === 'month') {
                this.actions.changeMonth('l');
                $('.calendar-main-content').empty();
                this.append(new CalendarMonth(this.data.monthDataList), this.el.find(".calendar-main-content"));
            } else if (this.data.calendarContent === 'week') {
                this.actions.changeWeek('l');
            } else if (this.data.calendarContent === 'day') {
                this.actions.changeDay('l');
            }
        }).on('click', '.next-date', () => {
            if(this.data.calendarContent === 'month') {
                this.actions.changeMonth('r');
                $('.calendar-main-content').empty();
                this.append(new CalendarMonth(this.data.monthDataList), this.el.find(".calendar-main-content"));
            } else if (this.data.calendarContent === 'week') {
                this.actions.changeWeek('r');
            } else if (this.data.calendarContent === 'day') {
                this.actions.changeDay('r');
            }
        });
    }
};

class CalendarMain extends Component {
    constructor() {
        super(config);
    }
}

export default CalendarMain;