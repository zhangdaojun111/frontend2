import Component from "../../../lib/component";
import template from './left-content.html';
import './left-content.scss';
import LeftCalendar from './left-calendar/left-calendar';
import Mediator from '../../../lib/mediator';
let config = {
    template: template,   
    actions: {
    	
    },
    afterRender: function() {
       this.append(new LeftCalendar, this.el.find('.left-calendar-box'));
    }
};

class Leftcontent extends Component {
    constructor() {
        super(config);
    }
}
let contentStatus = 0;
function contentHide(){
	if(contentStatus == 1){
		$(".item-title").animate({marginTop:"420px"});
	 	$(".item-content").hide();
	 	contentStatus = 0;
	}
	else if(contentStatus == 0){
		$(".item-title").animate({marginTop:"100px"});
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