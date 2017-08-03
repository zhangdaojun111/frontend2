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
        logincalendarTreeData:function(objs){
            $(".remind-group").html("");
            let strhtml = "";
            let IsChecked = true;
            objs.rows.forEach((data) =>{
                let items_Id = [];
                data.items.forEach((itemsid) =>{
                    items_Id.push(itemsid.field_id);
                });
                for(let i = 0;i< items_Id.length;i++){
                    if(objs.cancel_fields.indexOf(items_Id[i]) != -1){
                        IsChecked = false;
                        break;
                    }
                    IsChecked = true;
                }
                console.log(IsChecked);
                strhtml += "<div class='select-all'";
                if(objs.hide_tables.indexOf(data.table_id) != -1){
                    console.log(objs.hide_tables.indexOf(data.table_id));
                    strhtml +="style = 'display:none'";
                }
                strhtml +=">" + "<input type='checkbox' id='select-all-"+data.table_id+"'";
                console.log(objs.hide_tables.indexOf(data.table_id));
                strhtml +=" class='chk_1 chk_remind label-select-all ";
                if(objs.hide_tables.indexOf(data.table_id) == -1){
                    strhtml +="label-select-all-show ";
                }
                if(IsChecked){
                    strhtml +="label-select-all-checked 'checked";
                }
                strhtml +="/>" +
                    "<label class='select-label' for='select-all-"+data.table_id+"' id='label-all-"+data.table_id+"'></label><label class='select-label-show'>"+data.table_name+"</label>"+
                    "<div class=\"checkbox-group\">";
                data.items.forEach((items) =>{
                    strhtml+="<div class=\"label-task-children\">\n" +
                        "<input type='checkbox' id='select-children-"+items.field_id+"' class='chk_1 chk_approve label-select-all checkbox-children-"+data.table_id +"'";
                    if(objs.cancel_fields.indexOf(items.field_id) == -1){
                        strhtml+="checked ;";
                    }
                    strhtml+="/>" +
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
            let isAllGroupchecked = true;
            $('.label-select-all-show').each(function(){
                console.log('sssssssss');
                if(!$(this).is('.label-select-all-checked')){
                    isAllGroupchecked = false;
                }
            });
            if(isAllGroupchecked){
                $("#checkbox_a3").addClass('label-select-all-checked');
            }
            $("#checkbox_a3").bind('click',function(){
                if($(this).is(".label-select-all-checked")){
                    $(this).removeClass("label-select-all-checked");
                    $(".label-select-all-show").removeClass("label-select-all-checked");
                    $(".select-label-children").addClass("unchecked");
                }
                else{
                    $(this).addClass("label-select-all-checked");
                    $(".label-select-all-show").addClass("label-select-all-checked");
                    $(".select-label-children").removeClass("unchecked");
                }
            });
        }

    },
    afterRender: function() {
        this.el.css({"height":"100%","width":"100%"});
        this.append(new LeftCalendar, this.el.find('.left-calendar-box'));
        let objects = {};
        CalendarService.getCalendarTreeData().then(objs => {
            this.actions.logincalendarTreeData(objs);
            objects = objs;
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
                if($(this).prev('input').is(".label-select-all-checked"))
                {
                    $(this).prev('input').removeClass("label-select-all-checked");
                    $(class_Name).each(function(){
                            $(this).addClass('unchecked');
                            $(this).prev('input').removeAttr('checked');
                    });
                    $("#checkbox_a3").removeClass('label-select-all-checked');
                }
                else
                {
                    $(this).prev('input').addClass("label-select-all-checked");
                    $(class_Name).removeClass('unchecked');
                    let isAllGroupchecked = true;
                    $('.label-select-all-show').each(function(){
                        console.log($(this).is('.label-select-all-checked'));
                        if(!$(this).is('.label-select-all-checked')){
                            isAllGroupchecked = false;
                        }
                    });
                    if(isAllGroupchecked){
                        $("#checkbox_a3").addClass('label-select-all-checked');
                    }
                }

            });
            $('.select-label-children').bind('click',function () {
                var val1=$(this).prevAll('input').attr('class');
                var className1 = val1.split(" ");
                console.log(className1);
                let class_Name1 = "";
                class_Name1 += className1[3];
                var checkboxId = class_Name1.split("-");
                let fileId = checkboxId[2];
                let label_class = '.select-children-' +checkboxId[2];
                checkboxId = '#select-all-'+checkboxId[2];
                $(checkboxId).attr('checked',false);
                $(checkboxId).removeAttr('checked');
                if($(this).is(".unchecked"))
                {
                    $(this).removeClass('unchecked');
                    $(this).prevAll('input').attr('checked',false);
                    let isAllchecked = true;
                    $(label_class).each(function(){
                        if($(this).is('.unchecked')){
                            isAllchecked = false;
                            return false;
                        }
                    });
                    if(isAllchecked){
                        $(checkboxId).addClass('label-select-all-checked');
                        let isAllGroupchecked = true;
                        $('.label-select-all').each(function(){
                            if(!$(this).is('.label-select-all-checked')){
                                isAllGroupchecked = false;
                                return false;
                            }
                        });
                        if(isAllGroupchecked){
                            $("#checkbox_a3").addClass('label-select-all-checked');
                        }
                    }

                }
                else {
                    $(this).addClass('unchecked');
                    $(this).prevAll('input').attr('checked',true);
                    console.log(fileId);
                    objs.cancel_fields.push(fileId);
                    console.log(objs.cancel_fields);
                    $(checkboxId).removeClass('label-select-all-checked');
                    $("#checkbox_a3").removeClass('label-select-all-checked');
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