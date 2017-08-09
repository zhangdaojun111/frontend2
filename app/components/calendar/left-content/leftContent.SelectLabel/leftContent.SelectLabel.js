import Component from "../../../../lib/component";
import template from './leftContent.SelectLabel.html';
import './leftContent.SelectLabel.scss';
import {CalendarService} from '../../../../services/calendar/calendar.service';
import Mediator from '../../../../lib/mediator';
import LeftContentHide from '../leftContent.hideContent/leftContent.hideContent';
let config = {
    template: template,
    data:{
        labelId:Number,
        tablechildren:[],
        dataitem:[],
        cancel_fields:[],
        hide_tables:[],
        hide_item_table:[],
        hide_table:{'table_Id':'','tableName':''},
        rows:[],
    },
    actions: {
        loaddatahtml:function(that,data){
            let strhtml = "";
            data.items.forEach((items) =>{
                strhtml+="<div class=\"label-task-children\">\n" +
                    "<input type='checkbox' id='select-children-"+items.field_id+"' class='chk_1 chk_approve label-select-all checkbox-children-"+data.table_id +"'";
                strhtml+="/>" +
                    "<label class='select-label-children select-children-"+data.table_id+" ";
                strhtml+="'style='background-color:"+ items.color+"' for='select-children-"+items.field_id+"' id='select-children-"+items.field_id+"'>" +
                    "</label><label>"+items.field_name+"</label>"+
                    "</div>";
            });
            strhtml+="</div>";
            that.el.find(".checkbox-group").html(strhtml);
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
                Mediator.emit('calendar-left:remind-checkbox',-1);
                that.el.find("#checkbox_a3").removeClass('label-select-all-checked');
            } else {
                temp.prev('input').addClass("label-select-all-checked");
                that.el.find(class_Name).removeClass('unchecked');
                console.log(111);
                that.el.find(class_Name).each(function(){
                    let filedId = $(this).attr("id").split("-")[2];
                    if(config.data.cancel_fields.indexOf(filedId) != -1){
                        config.data.cancel_fields.splice($.inArray(filedId,config.data.cancel_fields),1);
                    }
                });
                let isAllGroupchecked = true;
                that.el.parent().find(".label-select-all-show").each(function(){
                    if(!$(this).is('.label-select-all-checked')){
                        isAllGroupchecked = false;
                    }
                });
                if(isAllGroupchecked){
                    Mediator.emit('calendar-left:remind-checkbox',1);
                    that.el.find("#checkbox_a3").addClass('label-select-all-checked');
                }
                Mediator.emit('calendar-left:unshowData',{data:config.data.cancel_fields});
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
                    that.el.parent().find('.label-select-all-show').each(function(){
                        if(!$(this).is('.label-select-all-checked')){
                            isAllGroupchecked = false;
                        }
                    });
                    if(isAllGroupchecked){
                        Mediator.emit('calendar-left:remind-checkbox',1);
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
                Mediator.emit('calendar-left:remind-checkbox',-1);
                that.el.find("#checkbox_a3").removeClass('label-select-all-checked');
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
            that.el.parent().find('.label-select-all-show').each(function(){
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
            config.data.hide_table = {'tableName':"",'table_Id':''}
        }
    },
    afterRender: function() {
        let that = this;
        if(that.data.hide_item_table.indexOf(that.data.dataitem.table_id) != -1){
            this.el.find(".select-head").removeClass("label-select-all-show");
            this.el.find(".select-all").hide();
        }
        let items_Id = [];
        let IsChecked = true;
        that.data.dataitem.items.forEach((itemsid) =>{
            items_Id.push(itemsid.field_id);
        });
        for(let i = 0;i< items_Id.length;i++){
            if(config.data.cancel_fields.indexOf(items_Id[i]) != -1){
                IsChecked = false;
                break;
            }
            IsChecked = true;
        }
        if(IsChecked){
            this.el.find(".select-head").addClass("label-select-all-checked");
        }
        config.actions.loaddatahtml(that,config.data.dataitem);
        Mediator.on('calendar-left:checkbox3-check',data =>{
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
        });
        that.el.on("mouseleave",".float-button-group-hide",function(){
            $(this).children(".float-button-group").css("display","none");
        }).on("mouseover",".float-button-group-show",function(){
            $(this).nextAll(".float-button-group").css("display","block");
        }).on('click',".hide-type-group",function(){
            config.actions.hide_group($(this),that);
        }).on('click','.select-label-show',function(){
            config.actions.selectlabelshow($(this));
        }).on('click',".select-label",function(){
            config.actions.selectlabel($(this),that);
        }).on('click','.select-label-children',function () {
            config.actions.selectlabelchildren($(this),that);
        });
    }
}
class LeftContentSelect extends Component {
    constructor(data,cancel_fields,hide_item_table,hide_tables,rows){
        config.data.dataitem = data;
        config.data.cancel_fields = cancel_fields;
        config.data.hide_item_table = hide_item_table;
        config.data.hide_tables = hide_tables;
        config.data.rows = rows;
        super(config);
    }

}
export default LeftContentSelect;