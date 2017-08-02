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
    },
    actions: {

    },
    afterRender: function() {
        this.el.css({"height":"100%","width":"100%"});
        this.append(new LeftCalendar, this.el.find('.left-calendar-box'));
        let strhtml = "";
        CalendarService.getCalendarTreeData().then(objs => {
            console.log(objs);
            objs.rows.forEach((data) =>{
                strhtml += "<div class='select-all'>" + "<input type='checkbox' id='select-all-"+data.table_id+"' class='chk_1 chk_remind label-select-all' />" +
                    "<label class='select-label' for='select-all-"+data.table_id+"' id='label-all-"+data.table_id+"'></label><label class='select-label-show'>"+data.table_name+"</label>"+
                    "<div class=\"checkbox-group\">";
                data.items.forEach((items) =>{
                    strhtml+="<div class=\"label-task-children\">\n" +
                        "<input type='checkbox' id='select-children-"+items.field_id+"' class='chk_1 chk_approve label-select-all checkbox-children-"+data.table_id +"' checked />" +
                        "<label class='select-label-children select-children-"+data.table_id+" ";
                    console.log(objs.cancel_fields.indexOf(items.field_id));
                        if(objs.cancel_fields.indexOf(items.field_id) != -1){
                            strhtml+="unchecked";
                        }
                    strhtml+="'style='background-color:"+ items.color+"' for='select-children-"+items.field_id+"' id='select-children-"+items.field_id+"'></label><label>"+items.field_name+"</label>"+
                        "</div>";
                });
                strhtml+="</div></div>";
            });
            $(".remind-group").html(strhtml);
            $('.select-label-show').bind('click',function(){
                if(!$(this).hasClass('hide-check-group'))
                {
                    $(this).addClass("hide-check-group");
                    console.log($(this));
                    $(this).nextAll('.checkbox-group').hide();
                    console.log(1);
                }
                else{
                    $(this).removeClass("hide-check-group");
                    $(this).nextAll('.checkbox-group').show();
                    console.log(0);
                }
            });
            $(".select-label").bind('click',function(){
                var val=$(this).attr("id");
                var id = val.split("-");
                let class_Name = ".select-children-"+id[2];
                console.log(class_Name);
                if($(this).prev('input').prop("checked"))
                {
                    $(class_Name).addClass('unchecked');
                }
                else if(!$(this).prev('input').prop("checked"))
                {
                    $(class_Name).removeClass('unchecked');
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
                if(!$(this).prevAll('input').prop("checked"))
                {
                    $(this).removeClass('unchecked');
                    $(this).prevAll('input').attr('checked',false);
                    $(checkboxId).attr('checked',false);
                    $(this).removeClass('unchecked');
                    console.log(checkboxId);
                }
                else {
                    $(this).addClass('unchecked');
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