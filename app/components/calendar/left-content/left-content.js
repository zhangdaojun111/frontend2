import Component from "../../../lib/component";
import template from './left-content.html';
import './left-content.scss';
import LeftContentSelect from './leftContent.SelectLabel/leftContent.SelectLabel'
import LeftCalendar from './left-calendar/left-calendar';
import Mediator from '../../../lib/mediator';
let config = {
    template: template, 
    data:{
    	classifyList:[{Text: '提醒'},{Text:'chanpin'}],
    },
    actions: {
    	
    },
    afterRender: function() {
        this.el.css({"height":"100%","width":"100%"});
       this.append(new LeftCalendar, this.el.find('.left-calendar-box'));
       this.data.classifyList.forEach((row) => {
            this.append(new LeftContentSelect(row), this.el.find('.test1'));
        });
    }
};

class Leftcontent extends Component {
    constructor() {
        super(config);
    }
}
let contentStatus = 1;
function contentHide(){
	if(contentStatus == 1){
		$(".taskbar").animate({height:"60%"});
		$(".cate-hide").animate({height:"4%"});
	 	$(".item-content").hide();	 	
	 	contentStatus = 0;
	}
	else if(contentStatus == 0){
		$(".taskbar").animate({height:"25%"},1);
        $(".cate-hide").animate({height:"39%"});
		//$(".item-title").animate({marginTop:"100px"});
	 	$(".item-content").show();
	 	
	 	
	 	contentStatus = 1;
	}
}


$(function(){
	 $(".item-title").bind("click",function(){
	 	contentHide();
	 });
    
});
export default Leftcontent;