import Component from "../../../lib/component";
import template from './left-content.html';
import './left-content.scss';
import LeftContentSelect from './leftContent.SelectLabel/leftContent.SelectLabel'
import LeftCalendar from './left-calendar/left-calendar';
import LeftContentHide from './leftContent.hideContent/leftContent.hideContent';
import {CalendarService} from '../../../services/calendar/calendar.service';
import Mediator from '../../../lib/mediator';
import CalendarSetting from '../calendar.setting/calendar.setting';

let config = {
    template: template,
    data:{
        cancel_fields:[],
        hide_table:{'table_Id':'','tableName':''},
        hide_tables:[],
        Add_hideTable:[],
        contentStatus:1,
        rows:[],
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
                strhtml += "<div class='select-all' id = 'select-all-block-"+data.table_id+"'";
                if(objs.hide_tables.indexOf(data.table_id) != -1){
                    strhtml +="style = 'display:none'";
                }
                strhtml +=">" + "<div class='float-button-group-hide'><span class=\"ui-icon ui-icon-triangle-1-s float-button-group-show\"></span><div class='float-button-group' style='display: none'><button class='hide-type-group' id='hide-type-"+ data.table_id+"'>隐藏</button><button>常用功能查询</button></div></div>" +
                    "<input type='checkbox' id='select-all-"+data.table_id+"'";
                strhtml +=" class='chk_1 chk_remind label-select-all ";
                if(objs.hide_tables.indexOf(data.table_id) == -1){
                    strhtml +="label-select-all-show ";
                }
                if(IsChecked){
                    strhtml +="label-select-all-checked 'checked";
                }
                else{
                    strhtml +="'";
                }
                strhtml +="/>" +
                    "<label class='select-label' for='select-all-"+data.table_id+"' id='label-all-"+data.table_id+"'></label><label class='select-label-show' id='select-label-show-"+data.table_id+"'>"+data.table_name+"</label>"+
                    "<div class=\"checkbox-group\">";
                data.items.forEach((items) =>{
                    strhtml+="<div class=\"label-task-children\">\n" +
                        "<input type='checkbox' id='select-children-"+items.field_id+"' class='chk_1 chk_approve label-select-all checkbox-children-"+data.table_id +"'";
                    if(objs.cancel_fields.indexOf(items.field_id) == -1){
                        strhtml+="checked ;";
                    }
                    strhtml+="/>" +
                        "<label class='select-label-children select-children-"+data.table_id+" ";
                    if(objs.cancel_fields.indexOf(items.field_id) != -1){
                        strhtml+="unchecked";
                    }
                    strhtml+="'style='background-color:"+ items.color+"' for='select-children-"+items.field_id+"' id='select-children-"+items.field_id+"'></label><label>"+items.field_name+"</label>"+
                        "</div>";
                });
                strhtml+="</div></div>";
            });
            this.el.find(".remind-group").html(strhtml);
            let isAllGroupchecked = true;
            this.el.find('.label-select-all-show').each(function(){
                if(!$(this).is('.label-select-all-checked')){
                    isAllGroupchecked = false;
                }
            });
            if(isAllGroupchecked){
                $("#checkbox_a3").addClass('label-select-all-checked');
            }
        },
        removeRemindType:function(){
            if($("#checkbox_a2").is(".workflow_checked")){
                config.data.cancel_fields = [];
                CalendarService.CalendarMsgMediator.publish('unshowData',{data:config.data.cancel_fields});
            }
            else{
                config.data.cancel_fields = ['approve'];
                CalendarService.CalendarMsgMediator.publish('unshowData',{data:config.data.cancel_fields});
            }
        },
        contentHide:function(){
            if(this.data.contentStatus === 1){
                $(".taskbar").animate({height:"61%"},300);
                $(".cate-hide").animate({height:"4%"},100);
                $(".item-content").hide();
                this.data.contentStatus = 0;
            }
            else if(this.data.contentStatus === 0){
                $(".taskbar").animate({height:"25%"},1);
                $(".cate-hide").animate({height:"40%"});
                //$(".item-title").animate({marginTop:"100px"});
                $(".item-content").show();
                this.data.contentStatus = 1;
            }
        },
        selectlabelshow:function(temp){
            if(!temp.hasClass('hide-check-group'))
            {
                temp.addClass("hide-check-group");
                temp.nextAll('.checkbox-group').hide();
            }
            else{
                temp.removeClass("hide-check-group");
                temp.nextAll('.checkbox-group').show();
            }
        },
        selectlabel:function(temp){
            let class_Name = ".select-children-"+temp.attr("id").split("-")[2];
            if(temp.prev('input').is(".label-select-all-checked"))
            {
                temp.prev('input').removeClass("label-select-all-checked");
                $(class_Name).each(function(){
                    $(this).addClass('unchecked');
                    $(this).prev('input').removeAttr('checked');
                    let filedId = temp.attr("id").split("-")[2];
                    if(config.data.cancel_fields.indexOf(filedId) == -1){
                        config.data.cancel_fields.push(filedId);
                    }
                });
                CalendarService.CalendarMsgMediator.publish('unshowData',{data:config.data.cancel_fields});
                $("#checkbox_a3").removeClass('label-select-all-checked');
            }
            else {
                temp.prev('input').addClass("label-select-all-checked");
                $(class_Name).removeClass('unchecked');
                $(class_Name).each(function(){
                    let filedId = $(this).attr("id").split("-")[2];
                    if(config.data.cancel_fields.indexOf(filedId) != -1){
                        config.data.cancel_fields.splice($.inArray(filedId,config.data.cancel_fields),1);
                    }
                });
                CalendarService.CalendarMsgMediator.publish('unshowData',{data:config.data.cancel_fields});
                let isAllGroupchecked = true;
                $('.label-select-all-show').each(function(){
                    if(!$(this).is('.label-select-all-checked')){
                        isAllGroupchecked = false;
                    }
                });
                if(isAllGroupchecked){
                    $("#checkbox_a3").addClass('label-select-all-checked');
                }
            }
        },
        selectlabelchildren:function(temp){
            var val1=temp.prevAll('input').attr('class');
            var className1 = val1.split(" ");
            let class_Name1 = "";
            class_Name1 += className1[3];
            var checkboxId = class_Name1.split("-");
            let fileId = checkboxId[2];
            let label_class = '.select-children-' +checkboxId[2];
            checkboxId = '#select-all-'+checkboxId[2];
            $(checkboxId).attr('checked',false);
            $(checkboxId).removeAttr('checked');
            if(temp.is(".unchecked"))
            {
                temp.removeClass('unchecked');
                temp.prevAll('input').attr('checked',false);
                let filedId = temp.attr("id").split("-")[2];
                config.data.cancel_fields.splice($.inArray(filedId,config.data.cancel_fields),1);
                CalendarService.CalendarMsgMediator.publish('unshowData',{data:config.data.cancel_fields});
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
                    $('.label-select-all-show').each(function(){
                        if(!$(this).is('.label-select-all-checked')){
                            isAllGroupchecked = false;
                        }
                    });
                    if(isAllGroupchecked){
                        $("#checkbox_a3").addClass('label-select-all-checked');
                    }
                }
            }
            else {
                temp.addClass('unchecked');
                temp.prevAll('input').attr('checked',true);
                let filedId = temp.attr("id").split("-")[2];
                if(config.data.cancel_fields.indexOf(fileId) == -1){
                    config.data.cancel_fields.push(filedId);
                }
                CalendarService.CalendarMsgMediator.publish('unshowData',{data:config.data.cancel_fields});
                $(checkboxId).removeClass('label-select-all-checked');
                $("#checkbox_a3").removeClass('label-select-all-checked');
            }
        },
        checkbox_a3:function(temp){
            if(temp.is(".label-select-all-checked")){
                temp.removeClass("label-select-all-checked");
                $(".label-select-all-show").removeClass("label-select-all-checked");
                $(".select-label-children").addClass("unchecked");
                config.data.cancel_fields = ['remind','workflow'];
                CalendarService.CalendarMsgMediator.publish('unshowData',{data:['remind','workflow']});
            }
            else{
                temp.addClass("label-select-all-checked");
                $(".label-select-all-show").addClass("label-select-all-checked");
                $(".select-label-children").removeClass("unchecked");
                config.actions.removeRemindType();
            }
        },
        approve_label:function(){
            if($("#checkbox_a2").is(".workflow_checked")){
                $("#checkbox_a2").removeClass("workflow_checked");
                config.data.cancel_fields.unshift('approve');
                CalendarService.CalendarMsgMediator.publish('unshowData',{data:config.data.cancel_fields});
            }
            else{
                $("#checkbox_a2").addClass("workflow_checked");
                config.data.cancel_fields.splice($.inArray('approve',config.data.cancel_fields),1);
                CalendarService.CalendarMsgMediator.publish('unshowData',{data:config.data.cancel_fields});
            }
        },
        hide_group:function(temp){
            let hide_type_id = temp.attr("id").split('-');
            let hide_table_name = "";
            let hide_table_id = hide_type_id[2];
            let select_checkbox_Id = "#select-all-"+hide_type_id[2];
            hide_type_id = "#select-all-block-"+ hide_type_id[2];
            $(select_checkbox_Id).removeClass("label-select-all-show");
            let class_Name = ".select-children-"+$('.hide-type-group').attr("id").split("-")[2];
            $(class_Name).each(function(){
                let filedId = $(this).attr("id").split("-")[2];
                if(config.data.cancel_fields.indexOf(filedId) == -1){
                    config.data.cancel_fields.push(filedId);
                }
            });
            $(hide_type_id).hide();
            let isAllGroupchecked = true;
            $('.label-select-all-show').each(function(){
                if(!$(this).is('.label-select-all-checked')){
                    isAllGroupchecked = false;
                }
            });
            if(isAllGroupchecked){
                $("#checkbox_a3").addClass('label-select-all-checked');
            }
            for(let j = 0;j < config.data.rows.length;j++) {
                if (hide_table_id == config.data.rows[j].table_id) {
                    hide_table_name = config.data.rows[j].table_name;
                }
            }
            config.data.hide_table.tableName = hide_table_name;
            config.data.hide_table.table_Id = hide_table_id;
            CalendarService.CalendarMsgMediator.publish('hideRemindType',{data:config.data.hide_table});
            config.data.hide_table = {'tableName':"",'table_Id':''}
        }
    },
    afterRender: function() {
        this.el.css({"height":"100%","width":"100%"});
        this.append(new LeftCalendar, this.el.find('.left-calendar-box'));
        let objects = {};
        CalendarService.CalendarMsgMediator.subscribe('hideRemindType',data => {
            config.data.Add_hideTable[0] = data.data;
            config.data.Add_hideTable.forEach((row) =>{
                this.append(new LeftContentHide(row), this.el.find('.item-content'));
            });
            config.data.Add_hideTable = [];
        });
        CalendarService.CalendarMsgMediator.subscribe('showRemindType',data => {
            this.el.find("#select-all-"+data.data).addClass("label-select-all-show label-select-all-checked");
            this.el.find("#select-all-block-"+data.data).show();
            this.el.find(".select-children-"+data.data).removeClass("unchecked");

        });
        CalendarService.getCalendarTreeData().then(objs => {
            config.data.cancel_fields = objs.cancel_fields;
            config.data.rows = objs.rows;
            for(let i = 0;i<objs.hide_tables.length;i++){
                let hide_table_name = "";
                let hide_table_id = objs.hide_tables[i];
                for(let j = 0;j < objs.rows.length;j++){
                    if(hide_table_id == objs.rows[j].table_id){
                        hide_table_name = objs.rows[j].table_name;
                    }
                }
                config.data.hide_table.tableName = hide_table_name;
                config.data.hide_table.table_Id = hide_table_id;
                config.data.hide_tables[i] = config.data.hide_table;
                config.data.hide_table = {'tableName':"",'table_Id':''}
            }
            config.data.hide_tables.forEach((row) =>{
                this.append(new LeftContentHide(row), this.el.find('.item-content'));
            })
            if(config.data.cancel_fields.indexOf('approve')){
                $("#checkbox_a2").addClass("workflow_checked");
            }
            else{
                $("#checkbox_a2").removeClass("workflow_checked");
            }
            this.actions.logincalendarTreeData(objs);
            objects = objs;
            this.el.find(".float-button-group-show").hover(function(){
                $(this).nextAll(".float-button-group").css("display","block");
            });
            this.el.find(".float-button-group-hide").mouseleave(function(){
                $(this).children(".float-button-group").css("display","none");
            });
        });
        this.el.on('click',"#checkbox_a3",function(){
             config.actions.checkbox_a3($(this));
        }).on('click',".approve-label",function(){
            config.actions.approve_label();
        }).on('click', '.item-title', () => {
            this.actions.contentHide();
        }).on('click','.set-calendar',() =>{
            let component = new CalendarSetting();
            let el = $('<div>').appendTo(document.body);
            component.render(el);
            el.dialog({
                title: '日历设置',
                width: '99%',
                height: '950',
                background: '#ddd',
                close: function() {
                    $(this).dialog('destroy');
                    component.destroySelf();
                }
            });
        }).on('click',".hide-type-group",function(){
            config.actions.hide_group($(this));
        }).on('click','.select-label-show',function(){
            config.actions.selectlabelshow($(this));
        }).on('click',".select-label",function(){
            config.actions.selectlabel($(this));
        }).on('click','.select-label-children',function () {
            config.actions.selectlabelchildren($(this));
        });
    }
};
class Leftcontent extends Component {
    constructor() {
        super(config);
    }
}
export default Leftcontent;