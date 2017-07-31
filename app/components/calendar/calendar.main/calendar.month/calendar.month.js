/**
 * Created by zj on 2017/7/27.
 */
import Component from "../../../../lib/component";
import template from './calendar.month.html';
import './calendar.month.scss';

import CalendarTableHeader from '../calendar.subcomponent/calendar.table.header/calendar.table.header';
import CalendarTableBody from '../calendar.subcomponent/calendar.table.body/calendar.table.body';

let config = {
    template: template,
    data: {
        weekListHead: [
            {itemTitle:'星期日'},
            {itemTitle:'星期一'},
            {itemTitle:'星期二'},
            {itemTitle:'星期三'},
            {itemTitle:'星期四'},
            {itemTitle:'星期五'},
            {itemTitle:'星期六'},
        ],
        weekListBody: [],
        monthDataList: [],
        todayStr: '',
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
            console.log(this.data.monthDataList);
            //$('td-week-list1').append('<td class="item-td">'+item.dayNum+'</td>');
            //this.append(new CalendarTableBody(this.data.monthDataList[0]), this.el.find('.month-body'));
            this.data.monthDataList.forEach((weekListObj, index) => {
                //this.append(new CalendarTableBody(weekListObj), this.el.find('.month-body'));
                if(index === 0) {
                    weekListObj.weekList.forEach(item => {
                        if(item['isPartOfMonth']) {
                            $('.td-week-list1').append('<td class="item-td">'+item.dayNum+'</td>');
                        }
                        else {
                            $('.td-week-list1').append('<td class="item-td">0</td>')
                        }
                    });

                }
                if(index === 1) {
                    weekListObj.weekList.forEach(item => {
                        if(item['isPartOfMonth']) {
                            $('.td-week-list2').append('<td class="item-td">'+item.dayNum+'</td>');
                        }
                        else {
                            $('.td-week-list2').append('<td class="item-td">0</td>')
                        }
                    });

                }
                if(index === 2) {
                    weekListObj.weekList.forEach(item => {
                        if(item['isPartOfMonth']) {
                            $('.td-week-list3').append('<td class="item-td">'+item.dayNum+'</td>');
                        }
                        else {
                            $('.td-week-list3').append('<td class="item-td">0</td>')
                        }
                    });

                }
                if(index === 3) {
                    weekListObj.weekList.forEach(item => {
                        if(item['isPartOfMonth']) {
                            $('.td-week-list4').append('<td class="item-td">'+item.dayNum+'</td>');
                        }
                        else {
                            $('.td-week-list4').append('<td class="item-td">0</td>')
                        }
                    });

                }
                if(index === 4) {
                    weekListObj.weekList.forEach(item => {
                        if(item['isPartOfMonth']) {
                            $('.td-week-list5').append('<td class="item-td">'+item.dayNum+'</td>');
                        }
                        else {
                            $('.td-week-list5').append('<td class="item-td">0</td>')
                        }
                    });

                }
                if(index === 5) {
                    weekListObj.weekList.forEach(item => {
                        if(item['isPartOfMonth']) {
                            $('.td-week-list6').append('<td class="item-td">'+item.dayNum+'</td>');
                        }
                        else {
                            $('.td-week-list6').append('<td class="item-td">0</td>')
                        }
                    });

                }
            });
        }
    },
    afterRender: function() {
        this.el.css({"height":"100%","width":"100%"});
        this.append(new CalendarTableHeader(this.data.weekListHead), this.el.find('.week-list'));
        let oDate = new Date(),
            year = oDate.getFullYear(),
            month = oDate.getMonth(),
            day = oDate.getDate(),
            week = oDate.getDay();
        this.todayStr = year + "-" + this.actions.addZero( month + 1 ) + "-" + this.actions.addZero( day );
        // 创建月历头
        this.actions.createMonthCalendar(year, month);
    }
};

class CalendarMonth extends Component {
    constructor() {
        super(config);
    }
}

export default CalendarMonth;