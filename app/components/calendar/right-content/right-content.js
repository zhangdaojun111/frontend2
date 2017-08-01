import Component from "../../../lib/component";
import template from './right-content.html';
import './right-content.scss';

import Mediator from '../../../lib/mediator';
let config = {
    template: template,   
    actions: {
    	
    },
    afterRender: function() {
        this.el.css({"height":"100%","width":"100%"});
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
function test(i,g){
	let item1 = ".item-content-"+i;
	let item2 = ".item-content-"+g;
	$(item1).show(300);
	$(item2).show(300);
}
function changeWolkFlowHeight(work1,work2){
	let item1 = ".item-content-"+work1;
	let item2 = ".item-content-"+work2;
	$(item1).height("29%");
	$(item2).height("29%");
	contentStatus1 = 0;
}
function contentHide1(){
	if(contentStatus1 == 1){
		$(".item-content-1").animate({height:"29%"},"fast");
	 	setTimeout(function(){test(2,3)},200);	
	 	contentStatus1 = 0;
	 	contentStatus2 = 0;
	 	contentStatus3 = 0;
	}
	else if(contentStatus1 == 0){
		$(".item-content-1").show();
		$(".item-content-1").animate({height:"87%"},"fast");
	 	changeWolkFlowHeight(2,3);
        $(".item-content-2").hide();
	 	$(".item-content-3").hide();
	 	contentStatus1 = 1;
	 	contentStatus2 = 0;
	 	contentStatus3 = 0;
	}
}

function contentHide2(){
	if(contentStatus2 == 1){
		$(".item-content-2").show();
        $(".item-content-2").animate({height:"29%"},350);
		$(".item-content-1").show(350);
        $(".item-content-1").animate({height:"29%"});
	 	setTimeout(function(){$(".item-content-3").show();},370);
	 	contentStatus2 = 0;
	 	contentStatus1 = 0;
	 	contentStatus3 = 0;
	}
	else if(contentStatus2 == 0){
		$(".item-content-2").show();
        $(".item-content-2").animate({height:"87%"});
		changeWolkFlowHeight(1,3);
		$(".item-content-1").height("10px;");
		$(".item-content-1").hide(350);
	 	$(".item-content-3").hide();
		contentStatus1 = 0;
	 	contentStatus3 = 0;
	 	contentStatus2 = 1;
	}
}

function contentHide3(){
	if(contentStatus3 == 1){		
		$(".item-content-3").show();
		$(".item-content-3").animate({height:"29%"},"fast");
	 	test(1,2);
	 	contentStatus2 = 0;
	 	contentStatus1 = 0;
	 	contentStatus3 = 0;
	}
	else if(contentStatus3 == 0){
		$(".item-content-3").show();
		changeWolkFlowHeight(1,2);
		$(".item-content-1").hide(50);
	 	$(".item-content-2").hide(50);
        $(".item-content-3").animate({height:"87%"});
	 	contentStatus3 = 1;
	 	contentStatus2 = 0;
	 	contentStatus1 = 0;
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