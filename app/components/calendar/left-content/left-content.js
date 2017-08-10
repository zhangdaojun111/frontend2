import Component from "../../../lib/component";
import template from './left-content.html';
import './left-content.scss';
import LeftContentSelect from './leftContent.SelectLabel/leftContent.SelectLabel'
import LeftCalendar from './left-calendar/left-calendar';
import LeftContentHide from './leftContent.hideContent/leftContent.hideContent';
import {CalendarService} from '../../../services/calendar/calendar.service';
import Mediator from '../../../lib/mediator';
import CalendarSetting from '../calendar.setting/calendar.setting';
import {PMAPI} from '../../../lib/postmsg';

let config = {
    template: template,
    data:{
        cancel_fields:[],
        hide_table:{'table_Id':'','tableName':''},
        hide_tables:[],
        Add_hideTable:[],
        contentStatus:1,
        rows:[],
        hide_item_table:[],
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
        contentHide:function(){
            if(this.data.contentStatus === 1){
                this.el.find(".taskbar").animate({height:"61%"},300);
                this.el.find(".cate-hide").animate({height:"4%"},100);
                this.el.find(".item-content").hide();
                this.data.contentStatus = 0;
            }
            else if(this.data.contentStatus === 0){
                this.el.find(".taskbar").animate({height:"25%"},1);
                this.el.find(".cate-hide").animate({height:"40%"});
                //$(".item-title").animate({marginTop:"100px"});
                this.el.find(".item-content").show();
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
        selectlabel:function(temp,that){
            let class_Name = ".select-children-"+temp.attr("id").split("-")[2];
            if(temp.prev('input').is(".label-select-all-checked"))
            {
                temp.prev('input').removeClass("label-select-all-checked");
                that.el.find(class_Name).each(function(){
                    $(this).addClass('unchecked');
                    $(this).prev('input').removeAttr('checked');
                    let filedId =$(this).attr("id").split("-")[2];
                    if(config.data.cancel_fields.indexOf(filedId) == -1){
                        config.data.cancel_fields.push(filedId);
                    }
                });
                Mediator.emit('calendar-left:unshowData',{data:config.data.cancel_fields});
                that.el.find("#checkbox_a3").removeClass('label-select-all-checked');
            } else {
                temp.prev('input').addClass("label-select-all-checked");
                that.el.find(class_Name).removeClass('unchecked');
                that.el.find(class_Name).each(function(){
                    let filedId = $(this).attr("id").split("-")[2];
                    if(config.data.cancel_fields.indexOf(filedId) != -1){
                        config.data.cancel_fields.splice($.inArray(filedId,config.data.cancel_fields),1);
                    }
                });
                Mediator.emit('calendar-left:unshowData',{data:config.data.cancel_fields});
                let isAllGroupchecked = true;
                that.el.find('.label-select-all-show').each(function(){
                    if(!$(this).is('.label-select-all-checked')){
                        isAllGroupchecked = false;
                    }
                });
                if(isAllGroupchecked){
                    that.el.find("#checkbox_a3").addClass('label-select-all-checked');
                }
            }
        },
        selectlabelchildren:function(temp,that){
            let checkboxId = temp.prevAll('input').attr('class').split(" ")[3].split("-");
            let fileId = checkboxId[2];
            let label_class = '.select-children-' +checkboxId[2];
            checkboxId = '#select-all-'+checkboxId[2];
            that.el.find(checkboxId).attr('checked',false);
            that.el.find(checkboxId).removeAttr('checked');
            if(temp.is(".unchecked"))
            {
                temp.removeClass('unchecked');
                temp.prevAll('input').attr('checked',false);
                let filedId = temp.attr("id").split("-")[2];
                config.data.cancel_fields.splice($.inArray(filedId,config.data.cancel_fields),1);
                Mediator.emit('calendar-left:unshowData',{data:config.data.cancel_fields});
                let isAllchecked = true;
                that.el.find(label_class).each(function(){
                    if($(this).is('.unchecked')){
                        isAllchecked = false;
                        return false;
                    }
                });
                if(isAllchecked){
                    that.el.find(checkboxId).addClass('label-select-all-checked');
                    let isAllGroupchecked = true;
                    that.el.find('.label-select-all-show').each(function(){
                        if(!$(this).is('.label-select-all-checked')){
                            isAllGroupchecked = false;
                        }
                    });
                    if(isAllGroupchecked){
                        that.el.find("#checkbox_a3").addClass('label-select-all-checked');
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
                Mediator.emit('calendar-left:unshowData',{data:config.data.cancel_fields});
                that.el.find(checkboxId).removeClass('label-select-all-checked');
                that.el.find("#checkbox_a3").removeClass('label-select-all-checked');
            }
        },
        checkbox_a3:function(temp,label_select_all_show,select_label_children,that){
            config.data.cancel_fields = that.el.find("#checkbox_a2").is(".workflow_checked")? []:['approve'];
            console.log(config.data.cancel_fields);
            if(temp.is(".label-select-all-checked")){
                temp.removeClass("label-select-all-checked");
                label_select_all_show.removeClass("label-select-all-checked");
                select_label_children.addClass("unchecked");
                for(let i = 0;i < config.data.rows.length;i++){
                    for(let j = 0;j < config.data.rows[i].items.length;j++){
                        if(config.data.cancel_fields.indexOf(config.data.rows[i].items[j].field_id) == -1){
                            config.data.cancel_fields.push(config.data.rows[i].items[j].field_id);
                        }
                    }
                }
                Mediator.emit('calendar-left:unshowData',{data:config.data.cancel_fields});
            }
            else{
                temp.addClass("label-select-all-checked");
                label_select_all_show.addClass("label-select-all-checked");
                select_label_children.removeClass("unchecked");
                console.log(config.data.hide_item_table,config.data.rows);
                for(let i = 0;i < config.data.rows.length;i++){
                    if(config.data.hide_item_table.indexOf(config.data.rows[i].table_id) != -1)
                    {
                        for(let j = 0;j < config.data.rows[i].items.length;j++){
                            if(config.data.cancel_fields.indexOf(config.data.rows[i].items[j].field_id) == -1){
                                config.data.cancel_fields.push(config.data.rows[i].items[j].field_id);
                            }
                        }
                    }
                }
                Mediator.emit('calendar-left:unshowData',{data:config.data.cancel_fields});
            }
        },
        approve_label:function(checkbox_a2){
            if(checkbox_a2.is(".workflow_checked")){
                checkbox_a2.removeClass("workflow_checked");
                config.data.cancel_fields.unshift('approve');
                Mediator.emit('calendar-left:unshowData',{data:config.data.cancel_fields});
                Mediator.emit('calendar-left:approve',0);
            }
            else{
                checkbox_a2.addClass("workflow_checked");
                config.data.cancel_fields.splice($.inArray('approve',config.data.cancel_fields),1);
                Mediator.emit('calendar-left:unshowData',{data:config.data.cancel_fields});
                Mediator.emit('calendar-left:approve',1);
            }
        },
        hide_group:function(temp,that){
            let hide_type_id = temp.attr("id").split('-');
            let hide_table_name = "";
            let hide_table_id = hide_type_id[2];
            let select_checkbox_Id = "#select-all-"+hide_type_id[2];
            hide_type_id = "#select-all-block-"+ hide_type_id[2];
            that.el.find(select_checkbox_Id).removeClass("label-select-all-show");
            let class_Name = ".select-children-"+temp.attr("id").split("-")[2];
            that.el.find(class_Name).each(function(){
                let filedId = $(this).attr("id").split("-")[2];
                console.log(filedId);
                if(config.data.cancel_fields.indexOf(filedId) == -1){
                    config.data.cancel_fields.push(filedId);
                }
            });
            that.el.find(hide_type_id).hide();
            let isAllGroupchecked = true;
            that.el.find('.label-select-all-show').each(function(){
                if(!$(this).is('.label-select-all-checked')){
                    isAllGroupchecked = false;
                }
            });
            if(isAllGroupchecked){
                that.el.find("#checkbox_a3").addClass('label-select-all-checked');
            }
            for(let j = 0;j < config.data.rows.length;j++) {
                if (hide_table_id == config.data.rows[j].table_id) {
                    hide_table_name = config.data.rows[j].table_name;
                }
            }
            config.data.hide_table.tableName = hide_table_name;
            config.data.hide_table.table_Id = hide_table_id;
            config.data.hide_item_table.push(hide_table_id);
            config.data.hide_tables.push(config.data.hide_table);
            Mediator.emit('calendar-left:hideRemindType',{data:config.data.hide_table});
            Mediator.emit('calendar-left:unshowData',{data:config.data.cancel_fields});
            config.data.hide_table = {'tableName':"",'table_Id':''}
        }
    },
    afterRender: function() {
        this.el.css({"height":"100%","width":"100%"});
        this.append(new LeftCalendar, this.el.find('.left-calendar-box'));
        let objects = {};
        let that = this;
        Mediator.on('calendar-left:unshowData',data =>{
            console.log(data);
        });
        Mediator.on('calendar-left:hideRemindType',data =>{
            config.data.Add_hideTable[0] = data.data;
            config.data.Add_hideTable.forEach((row) =>{
                that.append(new LeftContentHide(row), this.el.find('.item-content'));
            });
            config.data.Add_hideTable = [];
        });
        Mediator.on('calendar-left:showRemindType',data =>{
            that.el.find("#select-all-"+data.data).addClass("label-select-all-show label-select-all-checked");
            that.el.find("#select-all-block-"+data.data).show();
            that.el.find(".select-children-"+data.data).removeClass("unchecked");
            for(let i = 0;i < config.data.hide_tables.length;i++){
                if(config.data.hide_tables[i].table_Id == data.data){
                    config.data.hide_tables.splice(i,1);
                    config.data.hide_item_table.splice(i,1);
                    break;
                }
            }
            for(let i = 0;i < config.data.rows.length;i++){
                if(config.data.rows[i].table_id == data.data){
                    for(let j = 0;j < config.data.rows[i].items.length;j++){
                        console.log(44444);
                        config.data.cancel_fields.splice($.inArray(config.data.rows[i].items[j].field_id,config.data.cancel_fields),1);
                    }
                    break;
                }
            }
            Mediator.emit('calendar-left:unshowData',{data:config.data.cancel_fields});
        });
        CalendarService.getCalendarTreeData().then(objs => {
            config.data.cancel_fields = objs.cancel_fields;
            config.data.hide_item_table = objs.hide_tables;
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
                that.append(new LeftContentHide(row), that.el.find('.item-content'));
            });
            if(config.data.cancel_fields.indexOf('approve')){
                that.el.find($("#checkbox_a2").addClass("workflow_checked"));
            }
            else{
                that.el.find($("#checkbox_a2").removeClass("workflow_checked"));
            }
            that.actions.logincalendarTreeData(objs);
            objects = objs;
        });
        that.el.on("mouseleave",".float-button-group-hide",function(){
            $(this).children(".float-button-group").css("display","none");
        }).on("mouseover",".float-button-group-show",function(){
            $(this).nextAll(".float-button-group").css("display","block");
        }).on('click',"#checkbox_a3",function(){
            let label_select_all_show = that.el.find(".label-select-all-show");
            let select_label_children = that.el.find(".select-label-children");
            config.actions.checkbox_a3($(this),label_select_all_show,select_label_children,that);
        }).on('click',".approve-label",function(){
            let checkbox_a2 = that.el.find("#checkbox_a2");
            config.actions.approve_label(checkbox_a2);
        }).on('click', '.item-title', () => {
            this.actions.contentHide();
        }).on('click',".hide-type-group",function(){
            config.actions.hide_group($(this),that);
        }).on('click','.select-label-show',function(){
            config.actions.selectlabelshow($(this));
        }).on('click',".select-label",function(){
            config.actions.selectlabel($(this),that);
        }).on('click','.select-label-children',function () {
            config.actions.selectlabelchildren($(this),that);
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
        }).on('click', '.create-calendar', () => {
            //PMAPI.openDialogByIframe('/calendar_mgr/create/', {width: "1000", height: '550', title: '日历表'});
            PMAPI.openDialogByIframe(
                '/calendar_mgr/create/?table_id=1639_8QvxFmFvVpK33bVPXdk8hD',
                {
                    width: "1000",
                    height: '550',
                    title: '日历表'
                })
        });
    }
};
class Leftcontent extends Component {
    constructor() {
        super(config);
    }
}
export default Leftcontent;