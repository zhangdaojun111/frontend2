/**
 * Created by lipengfei.
 * 日历左侧显示
 */

import Component from "../../../lib/component";
import template from './left-content.html';
import './left-content.scss';
import 'jquery-ui/ui/widgets/tooltip';
import LeftContentHide from './leftContent.hideContent/leftContent.hideContent';
import Mediator from '../../../lib/mediator';
import {PMAPI} from '../../../lib/postmsg';
import LeftContentCalendarSet from './leftContent.calendarSet/leftContent.calendarSet';
import leftContentFinished from './leftContent.finished/leftContent.finished';
import RightContentWorkFlow from '../right-content/right.content.workflowcontent/right.content.workflowcontent';
import {CalendarService} from "../../../services/calendar/calendar.service"
import {CalendarWorkflowData} from '../calendar.main/calendar.workflow/calendar.workflow';

let config = {
    template: template,
    data: {
        cancel_fields: [],                              //取消选中数组
        hide_table: {'table_Id': '', 'tableName': ''},  //隐藏对象
        hide_tables: [],                                //隐藏对象数组
        rows: [],                                       //日历树data_table数据
        hide_item_table: [],                            //隐藏table_id数组
        calendarTreeData: {},                           //日历树数据
    },
    actions: {
        /**
         * 与我相关审批和已完成显示隐藏
         */
        contentHide: function (temp) {
            if (temp.is(".display-all-content")) {
                temp.removeClass("display-all-content");
                this.el.find(".item-content").show().css("height", "calc(33.3% - 45px)");
            } else {
                this.el.find(".item-title,.item-title-2").removeClass("display-all-content");
                this.el.find(".item-content,.item-content-2").hide();
                temp.addClass("display-all-content").next(".item-content").show().css({height: 'calc(100% - 135px)'});
            }
        },
        /**
         * 日历隐藏栏显示和隐藏
         */
        hideClass: function (temp) {
            if (temp.is(".display-all-content")) {
                temp.removeClass("display-all-content");
                this.el.find(".item-content-2").hide();
                this.el.find(".item-content").css("height", "calc(33.3% - 45px)").show();
            } else {
                this.el.find(".item-title").removeClass("display-all-content");
                temp.addClass("display-all-content");
                this.el.find(".item-content").hide();
                this.el.find(".item-content-2").show().css({height: 'calc(66.6% - 90px)'});
                this.el.find(".item-content-1").show().css("height", "calc(33.3% - 45px)");
            }
        },
        /**
         * 展开日历操作栏
         */
        showRemindType: function () {
            this.el.find(".item-title-2").removeClass("display-all-content");
            this.el.find(".item-title-1").addClass("display-all-content");
            this.el.find(".item-content").hide();
            this.el.find(".item-content-2").hide();
            this.el.find(".item-content-1").show().css({height: 'calc(100% - 135px)'});
        },
        /**
         * 将日历树隐藏table数据格式处理成：[{'tableName': "", 'table_Id': ''},...]
         */
        getCalendarTreeData: function () {
            for (let i = 0; i < this.data.calendarTreeData.hide_tables.length; i++) {
                let hide_table_name = "";
                let hide_table_id = this.data.calendarTreeData.hide_tables[i];
                for (let j = 0; j < this.data.calendarTreeData.rows.length; j++) {
                    if (hide_table_id === this.data.calendarTreeData.rows[j].table_id) {
                        hide_table_name = this.data.calendarTreeData.rows[j]['table_name'];
                    }
                }
                this.data.hide_table.tableName = hide_table_name;
                this.data.hide_table.table_Id = hide_table_id;
                this.data.hide_tables[i] = this.data.hide_table;
                this.data.hide_table = {'tableName': "", 'table_Id': ''}
            }
            this.data.hide_tables.forEach((row) => {
                if (row.tableName !== "") {
                    this.append(new LeftContentHide(row), this.el.find('.left-calendar-hide'));
                }
            })
        },

        /**
         * @author zj
         * 打开日历设置
         */
        getSettingMenu: function () {
            PMAPI.openDialogByIframe(
                '/iframe/calendarOpenSetting/',
                {
                    title: '日历设置',
                    width: '1200',
                    height: '760',
                    modal: true,
                    customSize: true,
                },
            ).then(data => {
                console.log(data);
                CalendarService.getCalendarTreeData().then(res => {
                    console.log(res);
                    Mediator.emit('Calendar: tool', {toolMethod: 'refresh', type: 'closeSetting', data:res['cancel_fields']});
                    this.data.cancelFields = res['cancel_fields'];
                    this.el.find('.left-calendar-set').empty();
                    this.append(new LeftContentCalendarSet(res), this.el.find('.left-calendar-set'));
                });
            });
        },

        /**
         * @author zj
         * 打开创建日历表
         */
        openCalendarForm: function () {
            PMAPI.openDialogByIframe(
                '/iframe/addWf/?table_id=1639_8QvxFmFvVpK33bVPXdk8hD',
                {
                    width: "900",
                    height: '540',
                    title: '日历表',
                    modal: true,
                    //customSize: true,
                }).then(res => {
                // 创建日历表后的回调，接收form回传的参数
            });
        }
    },
    events:{
        refresh:null,
    },

    binds: [
        {
            event: 'click',
            selector: '.hide-con',
            callback: function (context) {
                context = $(context).closest('.item-title');
                this.actions.contentHide(context);
            }
        },
        {
            event: 'click',
            selector: '.hide-con-2',
            callback: function (context) {
                this.actions.hideClass($(context).closest('.item-title-2'));
            }
        },
        {
            event: 'click',
            selector: '.set-calendar',
            callback: function () {
                this.actions.getSettingMenu();
            }
        },
        {
            event: 'click',
            selector: '.create-calendar',
            callback: function () {
                this.actions.openCalendarForm();
            }
        },
    ],
    afterRender: function () {
        this.el.tooltip();
        this.el.css({"height": "100%", "width": "100%"});
        this.actions.getCalendarTreeData();
        this.append(new LeftContentCalendarSet(this.data.calendarTreeData), this.el.find('.left-calendar-set'));
        Mediator.on('CalendarWorkflowData: workflowData', data => {
            this.el.find('.item-content-3').empty();
            data.forEach((row) => {
                this.append(new RightContentWorkFlow(row), this.el.find('.item-content-3'));
            });
        });
        Mediator.on('CalendarFinishedWorkflowData: workflowData', data => {
            this.el.find('.item-content-4').empty();
            data.forEach((row) => {
                this.append(new leftContentFinished(row), this.el.find('.item-content-4'));
            });
        });
        Mediator.on('calendar-left:hideRemindType', data => {
            this.append(new LeftContentHide(data.data), this.el.find('.left-calendar-hide'));
        });
        Mediator.on('calendar-left:showRemindType', () => {
            this.actions.showRemindType();
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