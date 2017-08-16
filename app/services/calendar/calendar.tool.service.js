/**
 * Created by zj on 2017/8/16.
 */

export const CalendarTimeService = {
    moment : require('moment'),

    getdays: function(yy,mm){

        console.log(this.moment().date());
        let time = yy+"-"+mm;
        console.log(this.moment(time,"YYYY-MM").daysInMonth());
        return this.moment(time,"YYYY-MM").daysInMonth();
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
        return {pre_y: pre_y, pre_m: pre_m};
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