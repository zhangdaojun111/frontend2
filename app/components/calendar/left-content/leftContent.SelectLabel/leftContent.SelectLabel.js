import Component from "../../../../lib/component";
import template from './leftContent.SelectLabel.html';
import './leftContent.SelectLabel.scss';
import {CalendarService} from '../../../../services/calendar/calendar.service';
import Mediator from '../../../../lib/mediator';
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
                Mediator.emit('calendar-left:remind-checkbox',-1);
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
            }
            Mediator.emit('calendar-left:unshowData',{data:config.data.cancel_fields});
        },
        selectlabelchildren:function(temp,that){
            let checkboxId = temp.prevAll('input').attr('class').split(" ")[3].split("-");
            let fileId = checkboxId[2];
            let label_class = '.select-children-' +checkboxId[2];
            checkboxId = '#select-all-'+checkboxId[2];
            if(temp.is(".unchecked"))
            {
                temp.removeClass('unchecked');
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

    },
    afterRender: function() {
        let that = this;
        let items_Id = [];
        let IsChecked = true;
        if(that.data.hide_item_table.indexOf(that.data.dataitem.table_id) != -1){
            this.el.find(".select-head").removeClass("label-select-all-show");
            this.el.find(".select-all").hide();
        }
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
        that.el.on("mouseleave",".float-button-group",function(){
            $(this).css("display","none");
        }).on("click",".float-button-group-show",function(){
            $(this).parent().nextAll(".float-button-group").css("display","block");
            $(this).parent().nextAll(".float-button-group").css("top", document.body.scrollLeft + event.clientY - 87);
        }).on('click','.select-label-show',function(){
            config.actions.selectlabelshow($(this));
        }).on('click',".select-label",function(){
            config.actions.selectlabel($(this),that);
        }).on('click','.select-label-children',function () {
            config.actions.selectlabelchildren($(this),that);
        }).on('mouseover',".hide-span-function",function () {
            that.el.find(".search-function").css("display","block");
        }).on("mouseover",".float-button-group-hide",function(){
            that.el.find(".search-function").css("display","none");
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