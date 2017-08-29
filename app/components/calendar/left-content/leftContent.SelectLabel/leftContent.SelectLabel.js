 /**
 * Created by lipengfei.
 * 日历树选择
 */
import Component from "../../../../lib/component";
import template from './leftContent.SelectLabel.html';
import './leftContent.SelectLabel.scss';
import {CalendarToolService} from '../../../../services/calendar/calendar.tool.service';
import {CalendarService} from '../../../../services/calendar/calendar.service';
import {dgcService} from '../../../../services/dataGrid/data-table-control.service';
import Mediator from '../../../../lib/mediator';
let config = {
    template: template,
    data:{
        dataitem:[],
        cancel_fields:[],
        hide_tables:[],
        hide_item_table:[],
        hide_table:{'table_Id':'','tableName':''},
        rows:[],
        items:[],
    },
    actions: {
        /**
         *加载子checkbox选中状态
         */
        loaddatahtml:function(that,data){
            data.items.forEach((items) =>{
                let filed_id = "#select-children-"+items.field_id;
                if(this.data.cancel_fields.indexOf(items.field_id) !== -1){
                    that.el.find(filed_id).addClass("unchecked");
                }
                let color = CalendarToolService.handleColorRGB(items.color,1);
                that.el.find(filed_id).css({backgroundColor:color});
            });
        },
        /**
         *隐藏子checkbox
         */
        selectlabelshow:function(temp){
            if(!temp.hasClass('hide-check-group'))
            {
                temp.addClass("hide-check-group");
                temp.parent(".calendar-select-table").nextAll('.checkbox-group').hide();
            }
            else{
                temp.removeClass("hide-check-group");
                temp.parent(".calendar-select-table").nextAll('.checkbox-group').show();
            }
        },
        /**
         *父checkbox发生选择
         */
        selectlabel:function(temp,that){
            let staus = false;
            if(temp.is(".label-select-all-checked"))
            {
                staus = true;
                this.events.checkbox({type:'unshowData',staus:staus,data:this.data.items});
                temp.removeClass("label-select-all-checked");
                that.el.find(".select-label-children").addClass('unchecked');
                this.events.checkbox({type:'remind-checkbox',data:-1});
                that.el.find("#checkbox_a3").removeClass('label-select-all-checked');
            } else {
                staus = false;
                this.events.checkbox({type:'unshowData',staus:staus,data:this.data.items});
                temp.addClass("label-select-all-checked");
                that.el.find(".select-label-children").removeClass('unchecked');
                let isAllGroupchecked = true;
                that.el.parent().find(".label-select-all-show").each(function(){
                    if(!$(this).is('.label-select-all-checked')){
                        isAllGroupchecked = false;
                    }
                });
                if(isAllGroupchecked){
                    this.events.checkbox({type:'remind-checkbox',data:1});
                    that.el.find("#checkbox_a3").addClass('label-select-all-checked');
                }
            }
        },
        /**
         *子checkbox发生选择
         */
        selectlabelchildren:function(temp){
            let dataItem=[];
            dataItem[0] = temp.attr("id").split("-")[2];
            if(temp.is(".unchecked"))
            {
                this.events.checkbox({type:'unshowData',staus:false,data:dataItem});
                temp.removeClass('unchecked');
                let isAllchecked = true;
                this.el.find(".select-label-children").each(function(){
                    if($(this).is('.unchecked')){
                        isAllchecked = false;
                        return false;
                    }
                });
                if(isAllchecked){
                    this.el.find(".select-head").addClass('label-select-all-checked');
                    let isAllGroupchecked = true;
                    this.el.parent().find('.label-select-all-show').each(function(){
                        if(!$(this).is('.label-select-all-checked')){
                            isAllGroupchecked = false;
                        }
                    });
                    if(isAllGroupchecked){
                        this.events.checkbox({type:'remind-checkbox',data:1});
                    }
                }
            }
            else {
                this.events.checkbox({type:'unshowData',staus:true,data:dataItem});
                temp.addClass('unchecked');
                this.el.find(".select-head").removeClass('label-select-all-checked');
                this.events.checkbox({type:'remind-checkbox',data:-1});
                this.el.find("#checkbox_a3").removeClass('label-select-all-checked');

            }
        },
        /**
         *页面判断隐藏项和父checkbox的状态
         */
        showfirst:function(){
            let IsChecked = true;
            if(this.data.hide_item_table.indexOf(this.data.dataitem.table_id) !== -1){
                this.el.find(".select-head").removeClass("label-select-all-show");
                this.el.find(".select-all").hide();
            }
            let items_Id = this.data.dataitem.items.map((item) =>{
                return item.field_id;
            });
            this.data.items = items_Id;
            for(let i = 0;i< items_Id.length;i++){
                if(this.data.cancel_fields.indexOf(items_Id[i]) !== -1){
                    IsChecked = false;
                    break;
                }
                IsChecked = true;
            }
            if(IsChecked){
                this.el.find(".select-head").addClass("label-select-all-checked");
            }
        },
        /**
         *常用功能查询
         * 参数：日历树ID,searchValue
         */
        goSearch:function(table_id,searchValue){
            let temp;
            for( let d of this.data.rows ){
                if(d.table_id === table_id){
                    temp = d;
                }
            }
            temp.searchValue = searchValue;
            let obj = {};
            for( let d of this.data.rows ){
                if( d.searchValue !== '0' ){
                    let val = d.searchValue;
                    for( let search of d.query_params){
                        if( val === search.id.toString()){
                            obj[d.table_id] = dgcService.translateAdvancedQuery( JSON.parse(search.queryParams));
                        }
                    }
                }
            }
            Mediator.emit('CalendarSelected: Search', obj);
        }
    },
    events:{

    },
    binds:[
        {
            event: 'mouseleave',
            selector: '.float-button-group',
            callback: function(temp = this){
                $(temp).css("display","none");
            }
        },
        {
            event: 'click',
            selector: '.float-button-group-show',
            callback: function(){
                this.el.find(".float-button-group").css({"display":"block","top":this.el.find(".float-button-group-show").offset().top - 85});
            }
        },
        {
            event: 'click',
            selector: '.select-label-show',
            callback: function(){
                this.actions.selectlabelshow($(this));
            }
        },
        {
            event: 'click',
            selector: '.select-label',
            callback: function(temp = this){
                this.actions.selectlabel($(temp),this);
            }
        },
        {
            event: 'click',
            selector: '.select-label-children',
            callback: function(temp = this){
                this.actions.selectlabelchildren($(temp));
            }
        },
        {
            event: 'mouseover',
            selector: '.hide-span-function',
            callback: function(){
                event.stopPropagation();
                this.el.find(".search-function").show();
            }
        },
        {
            event: 'mouseover',
            selector: '.hide-type-group',
            callback: function(){
                this.el.find(".search-function").css("display","none");
            }
        },
        {
            event: 'mouseover',
            selector: '.float-button-group',
            callback: function(){
                event.stopPropagation();
                this.el.find(".float-button-group").show();
            }
        },
        {
            event: 'click',
            selector: '.search-function-children',
            callback: function(temp = this){
                this.actions.goSearch($(temp).parent(".search-function").attr("class").split(" ")[1],$(temp).attr("class").split(" ")[1]);
            }
        },
        {
            event: 'click',
            selector: '.select-label-show',
            callback: function(temp = this){
                this.actions.selectlabelshow($(temp));
            }
        },
    ],

    afterRender: function() {
        let that = this;
        this.actions.showfirst();
        this.actions.loaddatahtml(that,this.data.dataitem);
        $(document).mouseover(function(){
            that.el.find(".float-button-group").hide();
            that.el.find(".search-function").css("display","none");
        });
    }
}

class LeftContentSelect extends Component {
    constructor(data,cancel_fields,hide_item_table,rows,event){
        config.data.dataitem = data;
        config.data.dataitem.searchValue = 0;
        config.data.cancel_fields = cancel_fields;
        config.data.hide_item_table = hide_item_table;
        config.data.rows = rows;
        config.events.checkbox = event;
        super(config);
    }

}
export default LeftContentSelect;