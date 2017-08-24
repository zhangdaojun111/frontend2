/**
 * Created by lipengfei.
 * 日历树选择
 */
import Component from "../../../../lib/component";
import template from './leftContent.SelectLabel.html';
import './leftContent.SelectLabel.scss';
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
        loaddatahtml:function(that,data){
            data.items.forEach((items) =>{
                let filed_id = "#select-children-"+items.field_id;
                if(this.data.cancel_fields.indexOf(items.field_id) !== -1){
                    that.el.find(filed_id).addClass("unchecked");
                }
                let color = that.actions.colorRgb(items.color,1);
                that.el.find(filed_id).css({backgroundColor:color});
            });
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
            let staus = false;
            if(temp.prev('input').is(".label-select-all-checked"))
            {
                staus = true;
                this.events.checkbox({type:'unshowData',staus:staus,data:this.data.items});
                temp.prev('input').removeClass("label-select-all-checked");
                that.el.find(".select-label-children").addClass('unchecked');
                this.events.checkbox({type:'remind-checkbox',data:-1});
                that.el.find("#checkbox_a3").removeClass('label-select-all-checked');
            } else {
                staus = false;
                this.events.checkbox({type:'unshowData',staus:staus,data:this.data.items});
                temp.prev('input').addClass("label-select-all-checked");
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
        selectlabelchildren:function(temp,that){
            let dataItem=[];
            let staus = false;
            dataItem[0] = temp.attr("id").split("-")[2];
            if(temp.is(".unchecked"))
            {
                staus = false;
                this.events.checkbox({type:'unshowData',staus:staus,data:dataItem});
                temp.removeClass('unchecked');
                let isAllchecked = true;
                that.el.find(".select-label-children").each(function(){
                    if($(this).is('.unchecked')){
                        isAllchecked = false;
                        return false;
                    }
                });
                if(isAllchecked){
                    that.el.find(".select-head").addClass('label-select-all-checked');
                    let isAllGroupchecked = true;
                    that.el.parent().find('.label-select-all-show').each(function(){
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
                staus = true;
                this.events.checkbox({type:'unshowData',staus:staus,data:dataItem});
                temp.addClass('unchecked');
                that.el.find(".select-head").removeClass('label-select-all-checked');
                this.events.checkbox({type:'remind-checkbox',data:-1});
                that.el.find("#checkbox_a3").removeClass('label-select-all-checked');

            }
        },
        showfirst:function(that){
            let IsChecked = true;
            if(that.data.hide_item_table.indexOf(that.data.dataitem.table_id) !== -1){
                this.el.find(".select-head").removeClass("label-select-all-show");
                this.el.find(".select-all").hide();
            }
            let items_Id = that.data.dataitem.items.map((item) =>{
                return item.field_id;
            });
            that.data.items = items_Id;
            console.log(_.includes([1,2,3],1));
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
        goSearch:function(a,id){
            let temp;
            for( let d of this.data.rows ){
                if(d.table_id === a){
                    temp = d;
                }
            }
            temp.searchValue = id;
            let json = {};
            for( let d of this.data.rows ){
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
                this.el.find(".float-button-group").css({"display":"block","top":event.clientY - 90});
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
                this.actions.selectlabelchildren($(temp),this);
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
        this.actions.showfirst(that);
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