import Component from "../../../../lib/component";
import template from './leftContent.calendarSet.html';
import './leftContent.calendarSet.scss';
import LeftContentSelect from '../leftContent.SelectLabel/leftContent.SelectLabel'
import {CalendarService} from '../../../../services/calendar/calendar.service';
import Mediator from '../../../../lib/mediator';
import CalendarSetting from '../../calendar.setting/calendar.setting';
import {PMAPI} from '../../../../lib/postmsg';

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
                Mediator.emit('calendar-left:checkbox3-check',{data:config.data.cancel_fields});
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
                Mediator.emit('calendar-left:checkbox3-check',{data:config.data.cancel_fields});
            }
        },
        approve_label:function(checkbox_a2){
            if(checkbox_a2.is(".workflow_checked")){
                checkbox_a2.removeClass("workflow_checked");
                config.data.cancel_fields.unshift('approve');
                Mediator.emit('calendar-left:unshowData',{data:config.data.cancel_fields});
                Mediator.emit('calendar-left:approveData',{data:false});
            }
            else{
                checkbox_a2.addClass("workflow_checked");
                config.data.cancel_fields.splice($.inArray('approve',config.data.cancel_fields),1);
                Mediator.emit('calendar-left:unshowData',{data:config.data.cancel_fields});
                Mediator.emit('calendar-left:approveData',{data:true});
            }
        },
        contentHide:function(){
            if(this.data.contentStatus === 1){
                this.el.find(".taskbar").animate({height:"61%"},200);
                this.el.find(".cate-hide").animate({height:"4%"},100);
                this.el.find(".item-content").hide();
                this.data.contentStatus = 0;
            }
            else if(this.data.contentStatus === 0){
                this.el.find(".taskbar").animate({height:"25%"},100);
                this.el.find(".cate-hide").animate({height:"40%"});
                this.el.find(".item-content").show();
                this.data.contentStatus = 1;
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
            console.log(hide_type_id);
            that.el.find(hide_type_id).hide();
            let isAllGroupchecked = true;
            that.el.find('.label-select-all-show').each(function(){
                if(!$(this).is('.label-select-all-checked')){
                    isAllGroupchecked = false;
                }
            });
            if(isAllGroupchecked){
                Mediator.emit('calendar-left:remind-checkbox',1);
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
            Mediator.emit('calendar-left:checkbox3-check',{data:config.data.cancel_fields});
            config.data.hide_table = {'tableName':"",'table_Id':''}
        }
    },
    afterRender: function() {
        this.el.css({"height":"100%","width":"100%"});
        let objects = {};
        let that = this;
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
            if(config.data.cancel_fields.indexOf('approve')){
                that.el.find($("#checkbox_a2").addClass("workflow_checked"));
            }
            else{
                that.el.find($("#checkbox_a2").removeClass("workflow_checked"));
            }
            objs.rows.forEach((data) =>{
                that.append(new LeftContentSelect(data,objs.cancel_fields,config.data.hide_item_table,config.data.hide_tables,config.data.rows), that.el.find('.remind-group'));
            });
            Mediator.emit('calendar-left:calendar-class-hide',{data:config.data.hide_tables});
            objects = objs;
        });
        let isAllGroupchecked = true;
        this.el.find('.label-select-all-show').each(function(){
            if(!$(this).is('.label-select-all-checked')){
                isAllGroupchecked = false;
            }
        });
        if(isAllGroupchecked){
            $("#checkbox_a3").addClass('label-select-all-checked');
        }
        Mediator.on('calendar-left:remind-checkbox',data =>{
            if(data === 1){
                that.el.find("#checkbox_a3").addClass('label-select-all-checked');
            }
            else{
                that.el.find("#checkbox_a3").removeClass('label-select-all-checked');
            }
        });
        Mediator.on('calendar-left:unshowData',data =>{
            config.data.cancel_fields = data.data;
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
                        if(config.data.cancel_fields.indexOf(config.data.rows[i].items[j].field_id) != -1){
                            config.data.cancel_fields.splice(config.data.cancel_fields.indexOf(config.data.rows[i].items[j].field_id),1);
                        }
                    }
                    break;
                }
            }
            Mediator.emit('calendar-left:unshowData',{data:config.data.cancel_fields});
            Mediator.emit('calendar-left:showRenmindclass',{data:config.data.cancel_fields,hide_tables:config.data.hide_tables});
        });
        that.el.on('click',"#checkbox_a3",function(){
            let label_select_all_show = that.el.find(".label-select-all-show");
            let select_label_children = that.el.find(".select-label-children");
            config.actions.checkbox_a3($(this),label_select_all_show,select_label_children,that);
        }).on('click',".approve-label",function(){
            let checkbox_a2 = that.el.find("#checkbox_a2");
            config.actions.approve_label(checkbox_a2);
        }).on('click', '.item-title', () =>{
            this.actions.contentHide();
        }).on('click',".hide-type-group",function(){
            config.actions.hide_group($(this),that);
        });
    }
};
class LeftcontentCalendarset extends Component {
    constructor() {
        super(config);
    }
}
export default LeftcontentCalendarset;