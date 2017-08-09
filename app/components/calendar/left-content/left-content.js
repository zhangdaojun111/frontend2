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
            }
            else{
                checkbox_a2.addClass("workflow_checked");
                config.data.cancel_fields.splice($.inArray('approve',config.data.cancel_fields),1);
                Mediator.emit('calendar-left:unshowData',{data:config.data.cancel_fields});
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
    },
    afterRender: function() {
        this.el.css({"height":"100%","width":"100%"});
        this.append(new LeftCalendar, this.el.find('.left-calendar-box'));
        let objects = {};
        let that = this;
        let isAllGroupchecked = true;
        this.el.find('.label-select-all-show').each(function(){
            if(!$(this).is('.label-select-all-checked')){
                isAllGroupchecked = false;
            }
        });
        if(isAllGroupchecked){
            $("#checkbox_a3").addClass('label-select-all-checked');
        }
        Mediator.on('calendar-left:hideRemindType',data =>{
            config.data.Add_hideTable[0] = data.data;
            config.data.Add_hideTable.forEach((row) =>{
                that.append(new LeftContentHide(row), this.el.find('.item-content'));
            });
            config.data.Add_hideTable = [];
        });
        Mediator.on('calendar-left:remind-checkbox',data =>{
            if(data === 1){
                that.el.find("#checkbox_a3").addClass('label-select-all-checked');
            }
            else{
                that.el.find("#checkbox_a3").removeClass('label-select-all-checked');
            }
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
            // that.actions.logincalendarTreeData(objs);
            objs.rows.forEach((data) =>{
                that.append(new LeftContentSelect(data,objs.cancel_fields,config.data.hide_item_table,config.data.hide_tables,config.data.rows), that.el.find('.remind-group'));
            });
            objects = objs;
        });
        that.el.on('click',"#checkbox_a3",function(){
            let label_select_all_show = that.el.find(".label-select-all-show");
            let select_label_children = that.el.find(".select-label-children");
            config.actions.checkbox_a3($(this),label_select_all_show,select_label_children,that);
        }).on('click',".approve-label",function(){
            let checkbox_a2 = that.el.find("#checkbox_a2");
            config.actions.approve_label(checkbox_a2);
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
        }).on('click', '.create-calendar', () => {
            PMAPI.openDialogByIframe('/calendar_mgr/create/', {width: "1000", height: '550', title: '日历表'});
        });
    }
};
class Leftcontent extends Component {
    constructor() {
        super(config);
    }
}
export default Leftcontent;