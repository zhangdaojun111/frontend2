/**
 * Created by zj on 2017/8/16.
 */

export const CalendarTimeService = {
    moment : require('moment'),

    getOneMonthDays: function(y,m){
        m = m+1;
        let time = y + "-" + m;
        return this.moment(time,"YYYY-MM").daysInMonth();
    },
    getDayDate: function () {
        return this.moment().format('YYYY-MM-DD');
    },

    getYear: function () {
        return this.moment().year();
    },

    getMonth: function () {
        return this.moment().month();
    },

    getWeek: function () {
        return this.moment().day();
    },

    getWeekByDay: function( y, m, d ){
        let day = new Date( y, m, d );
        return day.getDay();
    },

    getDay: function () {
        return this.moment().date();
    },

    formatDate: function (y,m,d) {
        return this.moment([y,m,d]).format('YYYY-MM-DD');
    },

    getPreMonth: function (y,m) {
        let pre_m = m,
            pre_y = y;
        if( pre_m === 0 ){
            pre_y = pre_y-1;
            pre_m = 11;
        }else {
            pre_m = pre_m - 1;
        }
        return [pre_y, pre_m];
    },

    getNextMonth: function (y,m) {
        let next_m = m,
            next_y = y;
        if( next_m === 11 ){
            next_y = next_y + 1;
            next_m = 0;
        }else {
            next_m = next_m + 1;
        }
        return [next_y, next_m];
    },
    
    addOneDay: function (y,m,d) {
        return this.moment([y,m,d]).add(1,'days');
    }

};

export const CalendarToolService = {
    handleColorRGB: function (str, opcity) {
        let sColor = str.toLowerCase();
        if(sColor){
            if(sColor.length === 4){
                let sColorNew = "#";
                for(let i=1; i<4; i+=1){
                    sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));
                }
                sColor = sColorNew;
            }
            //处理六位的颜色值
            let sColorChange = [];
            for(let i=1; i<7; i+=2){
                sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));
            }
            return "rgba(" + sColorChange.join(",")+","+opcity + ")";
        }else{
            return sColor;
        }
    }
};

export const CalendarHandleDataService = {
    monthDataList: [],
    weekDataList: [],
    createMonthCalendar: function (y,m, todayStr) {
        let monthDayNum = CalendarTimeService.getOneMonthDays(y,m),
            firstDayWeek = CalendarTimeService.getWeekByDay( y , m , 1 );
        let endNum = ( monthDayNum + firstDayWeek ) > 35 ? 42 : 35;
        let startNum = 1 - firstDayWeek;

        //组成数据
        this.monthDataList.length = 0;
        let arr = [];
        for( let i=1; i<=42 ;i++ ){
            let obj = {};
            obj['data'] = [];
            if( startNum<1 || startNum>monthDayNum){
                obj['isPartOfMonth'] = false;
            }else {
                let dateTime = CalendarTimeService.formatDate(y,m,startNum);
                obj['isToday'] = dateTime === todayStr ? true : false;
                obj['dataTime'] = dateTime;
                obj['dayNum'] = startNum;
                obj['week'] = arr.length;
                obj['year'] = y;
                obj['month'] = m;
                obj['isPartOfMonth'] = true;
            }
            startNum++;
            arr.push( obj );
            if( i % 7 === 0 && i >= 7 ){
                this.monthDataList.push( { "weekList": arr } );
                arr  =[];
            }
        }


        // 获得前一个月
        let [pre_y,pre_m] = CalendarTimeService.getPreMonth(y,m);

        // 获取前一个月天数
        let prevMonthNum = CalendarTimeService.getOneMonthDays(pre_y , pre_m );

        for( let i=6 ;i>=0; i-- ){
            let day = this.monthDataList[0]['weekList'][i];
            if( !day['isPartOfMonth'] ){
                day['dayNum'] = prevMonthNum;
                day['week'] = 6-i;
                day['year'] = pre_y;
                day['month'] = pre_m;
                day['dataTime'] = CalendarTimeService.formatDate(pre_y, pre_m, prevMonthNum);
                prevMonthNum--;
            }
        }

        // 获取下个月
        let [next_y, next_m] = CalendarTimeService.getNextMonth(y,m);

        let j = 1;
        for( let i = 0;i<=6;i++ ){
            let day = this.monthDataList[4]['weekList'][i];
            if( !day['isPartOfMonth'] ){
                day['dayNum'] = j;
                day['week'] = i;
                day['year'] = next_y;
                day['month'] = next_m;
                day['dataTime'] = CalendarTimeService.formatDate(next_y, next_m, j);
                j++;
            }
        }
        for( let i = 0;i<=6;i++ ){
            let day = this.monthDataList[5]['weekList'][i];
            if( !day['isPartOfMonth'] ){
                day['dayNum'] = j;
                day['year'] = next_y;
                day['month'] = next_m;
                day['dataTime'] = CalendarTimeService.formatDate(next_y, next_m, j);
                j++;
            }
        }
        return this.monthDataList;
    },

    createWeekCalendar: function (selectData){
        let chooseDate = CalendarTimeService.formatDate(selectData.y, selectData.m, selectData.d);
        this.weekDataList = [];
        let weekData = [];
        for( let data of this.monthDataList ){
            for( let d of data['weekList'] ){
                if( d['dataTime'] === chooseDate ){
                    weekData = data['weekList'];
                    break;
                }
            }
        }
        let arrHead = [];
        for( let d of weekData ){
            arrHead.push( {time:d.dataTime,isTime:false,isHead: true} );
        }

        this.weekDataList.push( arrHead );
        this.weekDataList.push( weekData );

        return this.weekDataList;
    },

    date2settings: {},
    calendarSettings: {},
    tableid2name: {},
    fieldInfos: {},
    get
    
    // handleDayData: function (id, date, count) {
    //
    // }
};


