import Component from "../../../lib/component";
import template from './left-content.html';
import './left-content.scss';
import LeftContentSelect from './leftContent.SelectLabel/leftContent.SelectLabel'
import LeftCalendar from './left-calendar/left-calendar';
import {CalendarService} from '../../../services/calendar/calendar.service';
import Mediator from '../../../lib/mediator';
let config = {
    template: template, 
    data:{
    	classifyList:[{Text: '提醒1',labelId:3,tablechildren:[{Text: '提醒11',tableId:11,labelId:3},{Text: '提醒12',tableId:12,labelId:3},{Text: '提醒13',tableId:13,labelId:3},{Text: '提醒15',tableId:15,labelId:3},]},{Text:'提醒2',labelId:2,tablechildren:[{Text: '提醒21',tableId:21,labelId:2},{Text: '提醒22',tableId:22,labelId:2}]}],
    },
    actions: {
        showHideGroup:function(){

        }
    },
    afterRender: function() {
        this.el.css({"height":"100%","width":"100%"});
       this.append(new LeftCalendar, this.el.find('.left-calendar-box'));
       let strhtml = "";
       this.data.classifyList.forEach((data) => {
           strhtml += "<div class='select-all'>" + "<input type='checkbox' id='select-all-"+data.labelId+"' class='chk_1 chk_remind label-select-all' checked='true' />" +
               "<label class='select-label' for='select-all-"+data.labelId+"' id='label-all-"+data.labelId+"'></label><label class='select-label-show'>"+data.Text+"</label>"+
               "<div class=\"checkbox-group\">";
           data.tablechildren.forEach((data) =>{
               strhtml+="<div class=\"label-task-children\">\n" +
                   "<input type='checkbox' id='select-children-"+data.tableId+"' class='chk_1 chk_approve label-select-all checkbox-children-"+data.labelId +"' checked='true' />" +
                   "<label class='select-label-children' for='select-children-"+data.tableId+"' id='select-children-"+data.labelId+"'></label><label>"+data.Text+"</label>"+
                   "</div>";
           });
              strhtml+="</div></div>";
        });
       $(".remind-group").html(strhtml);
        $('.select-label-show').bind('click',function(){
            if($(this).hasClass('hide-check-group'))
            {
                $(this).removeClass("hide-check-group");
                console.log($(this));
                $(this).nextAll('.checkbox-group').hide();
                console.log(1);
            }
            else{
                $(this).addClass("hide-check-group");
                $(this).nextAll('.checkbox-group').show();
                console.log(0);
            }
        });
        $(".select-label").bind('click',function(){
            var val=$(this).attr("id");
            var id = val.split("-");
            console.log(id[2]);
            let class_Name = ".checkbox-children-"+id[2];
            console.log(class_Name);
            if($(this).prev('input').prop("checked"))
            {
                $(class_Name).attr('checked',false);
            }
            else if(!$(this).prev('input').prop("checked"))
            {
                $(class_Name).attr('checked',true);
            }

        });
        $('.select-label-children').bind('click',function () {
            var val1=$(this).prevAll('input').attr('class');
            var className1 = val1.split(" ");
            console.log(className1);
            let class_Name1 = "";
            class_Name1 += className1[3];
            var checkboxId = class_Name1.split("-");
            checkboxId = '#select-all-'+checkboxId[2];
            if($(this).prevAll('input').prop("checked"))
            {
                $(this).prevAll('input').attr('checked',false);
                $(checkboxId).attr('checked',false);
                console.log(checkboxId);
            }
            else if(!$(this).prevAll('input').prop("checked"))
            {
                $(this).prevAll('input').attr('checked',true);
                var val1=$(this).prevAll('input').attr('class');
                var className = val1.split(" ");
                className ="." + className[2];
                // $(this).prevAll('input').addClass("checked");
                $(checkboxId).attr('checked',true);
                if($(className).each(function(){
                        if(!$(this).hasClass('checked')){
                            $(checkboxId).attr('checked',false);
                        }
                    }));
            }
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
		$(".taskbar").animate({height:"58%"},300);
		$(".cate-hide").animate({height:"4%"},100);
	 	$(".item-content").hide();	 	
	 	contentStatus = 0;
	}
	else if(contentStatus == 0){
		$(".taskbar").animate({height:"25%"},1);
        $(".cate-hide").animate({height:"37%"});
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