import Component from "../../../../lib/component";
import template from './left-calendar.html';
import './left-calendar.scss';

import Mediator from '../../../../lib/mediator';

let date = new Date(),
  year = date.getFullYear(),
  month = date.getMonth() + 1,
  day = date.getDate(),days;
  function getdays(yy,mm){
  	 if(mm ==2 && yy%4 == 0 && yy%100 !==0 ){
	  	return 29;
	  }else if(mm == 1 || mm == 3 || mm == 5 || mm == 7 || mm == 8 || mm == 10 || mm == 12){
	  	return 31;
	  }else if(mm==4 || mm==6 || mm==9 || mm==11 ){
	  	return 30;
	  }else{
	  	return 28;
	  }
  }
  function getLastMonthDays(yy,mm){
  	if(mm==1){
  		return getdays(yy-1,12);
  	}
  	return getdays(yy,mm-1);
  }
 function initCal(yy,mm,dd){
 
	  let days = getdays(yy,mm);
	  let m = mm < 3 ? (mm == 1 ? 13 : 14): mm;
	  yy = m > 12 ? yy - 1 : yy;
	  let c = Number(yy.toString().substring(0,2));
	  let y = Number(yy.toString().substring(2,4));
	   let d = 1;
	  //蔡勒公式
	  var week = y + parseInt(y/4) + parseInt(c/4) - 2*c + parseInt(26*(m+1)/10) + d - 1;
	 
	  week = week < 0 ? (week%7+7)%7 : week%7;
	 var calendarTable = [];
	  for(var i=0 ;i<42;i++){
	     　　　calendarTable[i] = "";　//清空原来的text文本
	  }
	 let daysNowMonth = getdays(yy,mm);
	  for(var i = 0;i < daysNowMonth; i++){
	  	calendarTable[week % 7 +i] = i+1;　　　
	  }
	  let daysLastMonth = getLastMonthDays(yy,mm);
	  for(var i = 0;i < week % 7;i++){
	  	calendarTable[week % 7 - i -1] = daysLastMonth - i;
	  }
	  for(let i = 0;i<42-week % 7-daysNowMonth;i++){
	  	calendarTable[week % 7 + daysNowMonth+i] = i+1;
	  }
	  console.log(calendarTable);
	  return calendarTable;
	  
	  
 }
let config = {
    template: template,   
    actions: {
    	loadcalendarDate:function(year,month,day){
    		$(".now-year").html(year);
    		$(".now-month").html(month);
    		$("#calendar-body").html();
    		let strhtml = "";
    		var dayTables = initCal(year,month,day);
    		for(let i = 0;i < 6;i++){
    			strhtml +="<tr></tr><tr>";
    			for(let j = 0;j < 7;j++){
    				strhtml+="<td>"+ dayTables[i*7+j] +"</td>";
    			}
    			strhtml +="</tr>";
    		}
    		$("#calendar-body").html(strhtml);
    	},
    	loadCalendarLastMonthData:function(){
    		let nowYear = $(".now-year").html();
    		let nowMonth = $(".now-month").html();
    		if(nowMonth == 1){
    			nowMonth = 12;
    			nowYear = nowYear -1;
    		}
    		else{
    			nowMonth = nowMonth - 1;
    		}
    		config.actions.loadcalendarDate(nowYear,nowMonth,day);
    	},
    	loadCalendarNextMonthData:function(){
    		let nowYear = $(".now-year").html();
    		let nowMonth = $(".now-month").html();
    		if(nowMonth == 12){
    			nowMonth = 1;
    			nowYear = parseInt(nowYear)+1;
    		}
    		else{
    			nowMonth = parseInt(nowMonth)+1;
    		}
    		config.actions.loadcalendarDate(nowYear,nowMonth,day);
    	}
    },
    afterRender: function() {

    }
};
$(function(){
	config.actions.loadcalendarDate(year,month,day); 
	$(".change-month-left").bind("click",function(){
	 	config.actions.loadCalendarLastMonthData();
	 });
	 $(".change-month-right").bind("click",function(){
	 	config.actions.loadCalendarNextMonthData();
	 });
});
class Leftcalendar extends Component {
    constructor() {
        super(config);
    }
}
export default Leftcalendar;