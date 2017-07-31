import Component from "../../../lib/component";
import template from './right-content.html';
import './right-content.scss';

import Mediator from '../../../lib/mediator';
let config = {
    template: template,   
    actions: {
    	
    },
    afterRender: function() {

    }
};

class Rightcontent extends Component {
    constructor() {
        super(config);
    }
}
let contentStatus1 = 0;
let contentStatus2 = 0;
let contentStatus3 = 0;
function test(){
	$(".item-content-2").show()
	$(".item-content-3").show();
}
function contentHide1(){
	if(contentStatus1 == 1){
		$(".item-content-1").animate({height:"250px"},"fast");
	 	setTimeout(test,200);	
	 	contentStatus1 = 0;
	}
	else if(contentStatus1 == 0){
		$(".item-content-1").animate({height:"750px"},"fast");
	 	$(".item-content-2").hide();
	 	$(".item-content-3").hide();
	 	contentStatus1 = 1;
	}
}

function contentHide2(){
	if(contentStatus2 == 1){		
		$(".item-content-2").animate({height:"250px"});
		setTimeout($(".item-content-1").show(),50000)
	 	$(".item-content-1").show();
	 	$(".item-content-3").show();
	 	contentStatus2 = 0;
	}
	else if(contentStatus2 == 0){
		$(".item-content-2").show();
		$(".item-content-2").animate({height:"750px"});
	 	$(".item-content-1").hide();
	 	$(".item-content-3").hide();
	 	contentStatus2 = 1;
	}
}

function contentHide3(){
	if(contentStatus3 == 1){
		$(".item-content-3").show();
		$(".item-content-3").animate({height:"250px"});
	 	$(".item-content-1").show();
	 	$(".item-content-2").show();
	 	contentStatus3 = 0;
	}
	else if(contentStatus3 == 0){
		$(".item-content-3").animate({height:"750px"});
	 	$(".item-content-1").hide();
	 	$(".item-content-2").hide();
	 	contentStatus3 = 1;
	}
}
$(function(){
	$(".item-title-1").bind("click",function(){
	 	contentHide1();
	 	console.log(1);
	 });
	 $(".item-title-2").bind("click",function(){
	 	contentHide2();
	 	console.log(1);
	 });
	  $(".item-title-3").bind("click",function(){
	 	contentHide3();
	 	console.log(1);
	 });
    
});
export default Rightcontent;