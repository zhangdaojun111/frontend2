import Component from "../../../../lib/component";
import template from './leftContent.SelectLabel.html';
import './leftContent.SelectLabel.scss';
import {CalendarService} from '../../../../services/calendar/calendar.service';
import {dgcService} from '../../../../services/dataGrid/data-table-control.service';
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
                    "<label class='select-label-children select-children-"+data.table_id;
                if(config.data.cancel_fields.indexOf(items.field_id) != -1){
                    strhtml+=" unchecked"
                }
                let color = that.actions.colorRgb(items.color,0.7);
                strhtml+="'style='background-color:"+ color+"' for='select-children-"+items.field_id+"' id='select-children-"+items.field_id+"'>" +
                    "</label><label>"+items.field_name+"</label>"+
                    "</div>";
            });
            strhtml+="</div>";
            that.el.find(".checkbox-group").html(strhtml);
        },
        colorRgb: function(str, opcity){
            let sColor = str.toLowerCase();
            if(sColor){
                if(sColor.length === 4){
                    let sColorNew = "#";
                    for(let i=1; i<4; i+=1){
                        sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));
                    }
                    sColor = sColorNew;
                }
                //处理六位的颜色值
                let sColorChange = [];
                for(let i=1; i<7; i+=2){
                    sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));
                }
                return "rgba(" + sColorChange.join(",")+","+opcity + ")";
            }else{
                return sColor;
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
        showfirst:function(that){
            let items_Id = [];
            let IsChecked = true;
            if(that.data.hide_item_table.indexOf(that.data.dataitem.table_id) !== -1){
                this.el.find(".select-head").removeClass("label-select-all-show");
                this.el.find(".select-all").hide();
            }
            that.data.dataitem.items.forEach((itemsid) =>{
                items_Id.push(itemsid.field_id);
            });
            for(let i = 0;i< items_Id.length;i++){
                if(config.data.cancel_fields.indexOf(items_Id[i]) !== -1){
                    IsChecked = false;
                    break;
                }
                IsChecked = true;
            }
            if(IsChecked){
                console.log(IsChecked);
                this.el.find(".select-head").addClass("label-select-all-checked");
            }
        },
        goSearch:function(a,id){
            let temp;
            for( let d of config.data.rows ){
                if(d.table_id === a){
                    temp = d;
                }
            }
            temp.searchValue = id;
            let json = {};
            for( let d of config.data.rows ){
                if( d.searchValue !== '0' ){
                    let val = d.searchValue;
                    for( let search of d.query_params){
                        if( val === search.id.toString()){
                            json[d.table_id] = dgcService.translateAdvancedQuery( JSON.parse(search.queryParams));
                        }
                    }
                }
            }
            Mediator.emit('CalendarSelected: Search', json);
        }
    },
    afterRender: function() {
        let that = this;
        that.actions.showfirst(that);
        config.actions.loaddatahtml(that,config.data.dataitem);
        Mediator.on('calendar-left:checkbox3-check',data =>{
            config.data.cancel_fields = data.data;
        });
        that.el.on("mouseleave",".float-button-group",function(){
            $(this).css("display","none");
        }).on("click",".float-button-group-show",function(){
            that.el.find(".float-button-group").css({"display":"block","top":document.body.scrollLeft + event.clientY - 87});
        }).on('click','.select-label-show',function(){
            config.actions.selectlabelshow($(this));
        }).on('click',".select-label",function(){
            config.actions.selectlabel($(this),that);
        }).on('click','.select-label-children',function () {
            config.actions.selectlabelchildren($(this),that);
        }).on('mouseover',".hide-span-function",function () {
            event.stopPropagation();
            that.el.find(".search-function").show();
        }).on('mouseover',".float-button-group", () =>{
            event.stopPropagation();
            this.el.find(".float-button-group").show();
        }).on('mouseover',".hide-type-group", () => {
            that.el.find(".search-function").css("display","none");
        }).on('click','.search-function-children',function () {
            that.actions.goSearch($(this).parent(".search-function").attr("class").split(" ")[1],$(this).attr("class").split(" ")[1]);
        });
        $(document).mouseover(function(){
            that.el.find(".float-button-group").hide();
            that.el.find(".search-function").css("display","none");
        });
    }
}
class LeftContentSelect extends Component {
    constructor(data,cancel_fields,hide_item_table,hide_tables,rows){
        config.data.dataitem = data;
        config.data.dataitem.searchValue = 0;
        config.data.cancel_fields = cancel_fields;
        config.data.hide_item_table = hide_item_table;
        config.data.hide_tables = hide_tables;
        config.data.rows = rows;
        super(config);
    }

}
export default LeftContentSelect;