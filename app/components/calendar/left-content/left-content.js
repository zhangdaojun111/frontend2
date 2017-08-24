/**
 * Created by lipengfei.
 * 日历左侧显示
 */

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
        cancel_fields:[],                              //取消选中数组
        hide_table:{'table_Id':'','tableName':''},     //隐藏对象
        hide_tables:[],                                //隐藏对象数组
        rows:[],                                       //日历树data_table数据
        hide_item_table:[],                            //隐藏table_id数组
        calendarTreeData: {},                          //日历树数据
    },
    actions: {
        //与我相关审批和已完成显示隐藏
        contentHide:function(that,temp){
            if(temp.is(".display-all-content")){
                temp.removeClass("display-all-content");
                that.el.find(".item-content-1").show();
                that.el.find(".item-content").css("height","27%");
                that.el.find(".item-content-1").css("height","27%");
                that.el.find(".item-content").show();
            }else{
                that.el.find(".item-title").removeClass("display-all-content");
                that.el.find(".item-title-2").removeClass("display-all-content");
                temp.addClass("display-all-content");
                that.el.find(".item-content-1").hide();
                that.el.find(".item-content").hide();
                that.el.find(".item-content-2").hide();
                temp.next(".item-content").show();
                temp.next().css({height:'calc(100% - 130px)'});
            }
        },
        //日历隐藏栏显示和隐藏
        hideclass:function(that,temp){
            if(temp.is(".display-all-content")){
                temp.removeClass("display-all-content");
                that.el.find(".item-content").css("height","27%");
                that.el.find(".item-content-1").css("height","27%");
                that.el.find(".item-content-2").hide();
                that.el.find(".item-content-1").show();
                that.el.find(".item-content-3").show();
                that.el.find(".item-content-4").show();
            }else{
                that.el.find(".item-title").removeClass("display-all-content");
                temp.addClass("display-all-content");
                that.el.find(".item-content-1").show();
                that.el.find(".item-content-1").css("height","27%");
                that.el.find(".item-content").hide();
                that.el.find(".item-content-2").show();
                that.el.find(".item-content-2").css({height:'calc(73% - 133px)'});
            }
        },
        //日历操作显示和隐藏
        hide_item:function(that,temp){
            if(temp.is(".display-all-content")){
                temp.removeClass("display-all-content");
                that.el.find(".item-content-1").show();
                that.el.find(".item-content-1").css("height","27%");
                that.el.find(".item-content").css("height","27%");
                that.el.find(".item-content-2").hide();
                that.el.find(".item-content-3").show();
                that.el.find(".item-content-4").show();
            }else{
                that.el.find(".item-title").removeClass("display-all-content");
                that.el.find(".item-content-1").show();
                temp.addClass("display-all-content");
                that.el.find(".item-content").hide();
                that.el.find(".item-content-2").hide();
                that.el.find(".item-content-1").css({height:'calc(100% - 130px)'});
                // that.el.find(".item-content-1").animate({height:'calc(100% - 120px)'},"fast");
            }
        },
        //展开日历操作栏
        showRemindType:function(that){
            that.el.find(".item-title-2").removeClass("display-all-content");
            that.el.find(".item-title-1").addClass("display-all-content");
            that.el.find(".item-content").hide();
            that.el.find(".item-content-2").hide();
            that.el.find(".item-content-1").show();
            that.el.find(".item-content-1").css({height:'calc(100% - 130px)'});
        },
        //处理日历树数据
        getCalendarTreeData:function(that){
            for(let i = 0;i<this.data.calendarTreeData.hide_tables.length;i++){
                let hide_table_name = "";
                let hide_table_id = this.data.calendarTreeData.hide_tables[i];
                for(let j = 0;j < this.data.calendarTreeData.rows.length;j++){
                    if(hide_table_id === this.data.calendarTreeData.rows[j].table_id){
                        hide_table_name = this.data.calendarTreeData.rows[j]['table_name'];
                    }
                }
                this.data.hide_table.tableName = hide_table_name;
                this.data.hide_table.table_Id = hide_table_id;
                this.data.hide_tables[i] = this.data.hide_table;
                this.data.hide_table = {'tableName':"",'table_Id':''}
            }
            this.data.hide_tables.forEach((row) =>{
                that.append(new LeftContentHide(row), that.el.find('.left-calendar-hide'));
            })
        },

        /**
         * @author zj
         * 获取可进行日历设置的表
         */
        getSettingMenu: function () {
            // PMAPI.openDialogByIframe(
            //     '/iframe/calendarOpenSetting/',
            //     {
            //         title: '日历设置',
            //         width: '1700',
            //         height: '800',
            //     },
            // );
            CalendarSetService.getMenu().then(res => {
                let menu = res['menuList'].filter(item => {
                    return item['folder_id'] !== 1;
                });
                let component = new CalendarSetting(menu);
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
        },

        /**
         * @author zj
         * 打开创建日历表
         */
        openCalendarForm: function () {
            PMAPI.openDialogByIframe(
                '/calendar_mgr/create/?table_id=1639_8QvxFmFvVpK33bVPXdk8hD',
                {
                    width: "1000",
                    height: '550',
                    title: '日历表',
                }).then(res => {
                // 创建日历表后的回调，接收form回传的参数
            });
        }
    },
    binds:[
        {
            event: 'click',
            selector: '.hide-con',
            callback: function(temp = this){
                 temp = $(temp).parents('.item-title');
                 this.actions.contentHide(this,temp);
            }
        },
        {
            event: 'click',
            selector: '.hide-con-1',
            callback: function(temp = this){
                this.actions.hide_item(this,$(temp).parents('.item-title-1'));
            }
        },
        {
            event: 'click',
            selector: '.hide-con-2',
            callback: function(temp = this){
                this.actions.hideclass(this,$(temp).parents('.item-title-2'));
            }
        },
        {
            event: 'click',
            selector: '.set-calendar',
            callback: function () {
                this.actions.getSettingMenu()
            },
        },
        {
            event: 'click',
            selector: '.create-calendar',
            callback: function () {
                this.actions.openCalendarForm()
            },
        }
    ],
    afterRender: function() {
        this.el.css({"height":"100%","width":"100%"});
        let that = this;
        this.actions.getCalendarTreeData(that);
        this.append(new LeftcontentCalendarset(this.data.calendarTreeData), this.el.find('.left-calendar-set'));
        // let myChild = new leftContentFinished({},{onChange:function(data){console.log(data.type)}});
        // this.append(myChild,this.el.find('.item-content-4'));
        Mediator.on('CalendarWorkflowData: workflowData', data => {
            this.el.find('.item-content-3').empty();
            console.log(data);
            data.forEach((row) =>{
                this.append(new RightContentWorkFlow(row), this.el.find('.item-content-3'));
            });
        });
        Mediator.on('calendar-left:hideRemindType',data =>{
                that.append(new LeftContentHide(data.data), this.el.find('.left-calendar-hide'));
        });
        Mediator.on('calendar-left:showRemindType',()=>{
            that.actions.showRemindType(that);
        });
    },
    beforeDestory: function () {
        Mediator.removeAll('calendar-left');
    }
};
class Leftcontent extends Component {
    constructor(data) {
        config.data.calendarTreeData = data;
        super(config);
    }
}
export default Leftcontent;