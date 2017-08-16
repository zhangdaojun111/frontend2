import Component from "../../../lib/component";
import template from './left-content.html';
import './left-content.scss';
import LeftContentHide from './leftContent.hideContent/leftContent.hideContent';
import {CalendarService} from '../../../services/calendar/calendar.service';
import Mediator from '../../../lib/mediator';
import CalendarSetting from '../calendar.setting/calendar.setting';
import {PMAPI} from '../../../lib/postmsg';
import LeftcontentCalendarset from'./leftContent.calendarSet/leftContent.calendarSet';
import leftContentFinished from './leftContent.finished/leftContent.finished';
import RightContentWorkFlow from '../right-content/right.content.workflowcontent/right.content.workflowcontent';
import {CalendarSetService} from "../../../services/calendar/calendar.set.service"
import {CalendarWorkflowData} from '../calendar.main/calendar.workflow/calendar.workflow';
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
        contentHide:function(that,temp){
            if(temp.is(".display-all-content")){
                temp.removeClass("display-all-content");
                that.el.find(".item-content").css("height","27%");
                that.el.find(".item-content").show();
            }else{
                that.el.find(".item-title").removeClass("display-all-content");
                that.el.find(".item-title-2").removeClass("display-all-content");
                temp.addClass("display-all-content");
                that.el.find(".item-content").hide();
                that.el.find(".item-content-2").hide();
                temp.next(".item-content").show();
                temp.next().animate({height:"83%"},"fast");
            }
        },
        hideclass:function(that,temp){
            if(temp.is(".display-all-content")){
                temp.removeClass("display-all-content");
                that.el.find(".item-content").css("height","27%");
                that.el.find(".item-content-2").hide();
                that.el.find(".item-content-1").show();
                that.el.find(".item-content-3").show();
                that.el.find(".item-content-4").show();
            }else{
                that.el.find(".item-title").removeClass("display-all-content");
                temp.addClass("display-all-content");
                that.el.find(".item-content").hide();
                that.el.find(".item-content-2").show();
                that.el.find(".item-content-2").animate({height:"82%"},"fast");
            }
        },
        showRemindType:function(that){
            that.el.find(".item-title-2").removeClass("display-all-content");
            that.el.find(".item-title-1").addClass("display-all-content");
            that.el.find(".item-content").hide();
            that.el.find(".item-content-2").hide();
            that.el.find(".item-content-1").show();
            that.el.find(".item-content-1").css({height:"80%"});
        },
    },
    afterRender: function() {
        this.el.css({"height":"100%","width":"100%"});
        this.append(new LeftcontentCalendarset, this.el.find('.left-calendar-set'));
        this.append(new leftContentFinished(),this.el.find('.item-content-4'));
        Mediator.on('CalendarWorkflowData: workflowData', data => {
            this.el.find('.item-content-3').empty();
            console.log(data);
            data.forEach((row) =>{
                this.append(new RightContentWorkFlow(row), this.el.find('.item-content-3'));
            });
        });
        let that = this;
        Mediator.on('calendar-left:hideRemindType',data =>{
                that.append(new LeftContentHide(data.data), this.el.find('.left-calendar-hide'));
        });
        Mediator.on('calendar-left:calendar-class-hide',data =>{
            data.data.forEach((row) =>{
                that.append(new LeftContentHide(row), that.el.find('.left-calendar-hide'));
            });
        });
        Mediator.on('calendar-left:showRemindType',()=>{
            that.actions.showRemindType(that);
        });
        // CalendarService.getWorkflowRecords(data).then(res => {
        //     res.rows.forEach((row) =>{
        //         this.append(new RightContentWorkFlow(row), this.el.find('.item-content-3'));
        //     });
        // });
        that.el.on('click', '.hide-con',function(){
            let temp = $(this).parents('.item-title');
            that.actions.contentHide(that,temp);
        }).on("click",".hide-con-2",function(){
            that.actions.hideclass(that,$(this).parents('.item-title-2'));
        }).on('click','.set-calendar',() =>{
            CalendarSetService.getMenu().then(res => {
                let component = new CalendarSetting(res['menuList']);
                let el = $('<div>').appendTo(document.body);
                component.render(el);
                el.dialog({
                    title: '日历设置',
                    width: '90%',
                    height: '750',
                    background: '#ddd',
                    close: function() {
                        $(this).dialog('destroy');
                        component.destroySelf();
                    }
                });
            });
        }).on('click', '.create-calendar', () => {
            PMAPI.openDialogByIframe(
                '/calendar_mgr/create/?table_id=1639_8QvxFmFvVpK33bVPXdk8hD',
                {
                    width: "1000",
                    height: '550',
                    title: '日历表',
                });
        });
    },
    beforeDestory: function () {
        Mediator.removeAll('calendar-left');
    }
};
class Leftcontent extends Component {
    constructor() {
        super(config);
    }
}
export default Leftcontent;