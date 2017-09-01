/**
 * @author  lipengfei.
 * @description 日历树组
 */
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
    data: {
        cancel_fields: [],                                    //取消选中的filed_id数组
        hide_table: {'table_Id': '', 'tableName': ''},           //隐藏对象
        hide_tables: [],                                      //隐藏列表table_id数组
        rows: [],                                             //所有隐藏数据
        hide_item_table: [],                                  //隐藏对象数组
        calendarTreeData: {},                                //日历树数据
    },
    events: {
        /**
         *日历树组件回掉函数  参数data格式：{type：，data：}
         */
        checkboxcheck: function (data) {
            if (data.type === "remind-checkbox") {
                if (data.data === 1) {
                    this.el.find(".checkbox_a3").addClass('label-select-all-checked');
                } else {
                    this.el.find(".checkbox_a3").removeClass('label-select-all-checked');
                }
            }
            if (data.type === "unshowData") {
                if (data.staus) {
                    data.data.forEach((item) => {
                        if (this.data.cancel_fields.indexOf(item) === -1) {
                            this.data.cancel_fields.push(item);
                        }
                    })
                } else {
                    this.data.cancel_fields = _.difference(this.data.cancel_fields, data.data);
                }
                Mediator.emit('calendar-left:unshowData', {data: this.data.cancel_fields});
                let preference = {"content": this.data.cancel_fields};
                CalendarService.getCalendarPreference(preference);
            }
        }
    },
    actions: {
        /**
         *提醒checkbox发生选择
         */
        checkbox_a3: function (temp) {
            this.data.cancel_fields = this.el.find(".checkbox_a2").is(".workflow_checked") ? [] : ['approve'];
            if (temp.is(".label-select-all-checked")) {
                temp.removeClass("label-select-all-checked");
                this.el.find(".label-select-all-show").removeClass("label-select-all-checked");
                this.el.find(".select-label-children").addClass("unchecked");
                for (let i = 0; i < this.data.rows.length; i++) {
                    for (let j = 0; j < this.data.rows[i].items.length; j++) {
                        if (this.data.cancel_fields.indexOf(this.data.rows[i].items[j].field_id) === -1) {
                            this.data.cancel_fields.push(this.data.rows[i].items[j].field_id);
                        }
                    }
                }
            } else {
                temp.addClass("label-select-all-checked");
                this.el.find(".label-select-all-show").addClass("label-select-all-checked");
                this.el.find(".select-label-children").removeClass("unchecked");
                for (let i = 0; i < this.data.rows.length; i++) {
                    if (this.data.hide_item_table.indexOf(this.data.rows[i].table_id) !== -1) {
                        for (let j = 0; j < this.data.rows[i].items.length; j++) {
                            if (this.data.cancel_fields.indexOf(this.data.rows[i].items[j].field_id) === -1) {
                                this.data.cancel_fields.push(this.data.rows[i].items[j].field_id);
                            }
                        }
                    }
                }
            }
            Mediator.emit('calendar-left:unshowData', {data: this.data.cancel_fields});
            let preference = {"content": this.data.cancel_fields};
            CalendarService.getCalendarPreference(preference);
        },

        /**
         *审批checkbox发生选择
         */
        approve_label: function (checkbox_a2) {
            if (checkbox_a2.is(".workflow_checked")) {
                checkbox_a2.removeClass("workflow_checked");
                this.el.find(".checkbox_a2").attr("checked", false);
                this.data.cancel_fields.unshift('approve');
                Mediator.emit('calendar-left:approveData', {data: false});
            }
            else {
                checkbox_a2.addClass("workflow_checked");
                this.el.find(".checkbox_a2").attr("checked", true);
                this.data.cancel_fields.splice($.inArray('approve', this.data.cancel_fields), 1);
                Mediator.emit('calendar-left:approveData', {data: true});
            }
            Mediator.emit('calendar-left:unshowData', {data: this.data.cancel_fields});
            let preference = {"content": this.data.cancel_fields};
            CalendarService.getCalendarPreference(preference);
        },

        /**
         *隐藏日历树
         */
        hide_group: function (temp, that) {
            let hide_type_id = temp.attr("id").split('-');
            let hide_table_name = "";
            let hide_table_id = hide_type_id[2];
            hide_type_id = "#select-all-block-" + hide_type_id[2];
            that.el.find(hide_type_id + " .select-head").removeClass("label-select-all-show");
            temp.parent(".float-button-group").next(".checkbox-group").find(".select-label-children").each(function () {
                let filedId = $(this).attr("id").split("-")[2];
                if (that.data.cancel_fields.indexOf(filedId) === -1) {
                    that.data.cancel_fields.push(filedId);
                }
            });
            that.el.find(hide_type_id).hide();
            this.actions.remindShow();
            for (let j = 0; j < that.data.rows.length; j++) {
                if (hide_table_id === that.data.rows[j].table_id) {
                    hide_table_name = that.data.rows[j].table_name;
                }
            }
            that.data.hide_table = {'tableName': hide_table_name, 'table_Id': hide_table_id};
            that.data.hide_item_table.push(hide_table_id);
            that.data.hide_tables.push(that.data.hide_table);
            let preference = {"content": that.data.cancel_fields};
            CalendarService.getCalendarPreference(preference);
            preference = {"content": that.data.hide_item_table};
            CalendarService.getCalendarHidePreference(preference);
            Mediator.emit('calendar-left:hideRemindType', {data: that.data.hide_table});
            Mediator.emit('calendar-left:unshowData', {data: that.data.cancel_fields});
            that.data.hide_table = {'tableName': "", 'table_Id': ''}
        },

        /**
         *隐藏日历树后，提醒选择状态
         */
        remindShow: function () {
            let isAllGroupChecked = true;
            this.el.find('.label-select-all-show').each(function () {
                if (!$(this).is('.label-select-all-checked')) {
                    isAllGroupChecked = false;
                }
            });
            if (isAllGroupChecked && this.el.find('.label-select-all-show').length > 0) {
                this.el.find(".checkbox_a3").addClass('label-select-all-checked');
            }
            if (this.el.find('.label-select-all-show').length === 0) {
                this.el.find(".checkbox_a3").removeClass('label-select-all-checked');
            }
        },

        /**
         *处理日历树数据
         */
        getCalendarTreeData: function () {
            this.data.cancel_fields = this.data.calendarTreeData.cancel_fields;
            this.data.hide_item_table = this.data.calendarTreeData.hide_tables;
            this.data.rows = this.data.calendarTreeData.rows;
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
                this.data.hide_table = {'tableName': "", 'table_Id': ''};
            }
            this.data.calendarTreeData.rows.forEach((data) => {
                this.append(new LeftContentSelect(data, this.data.calendarTreeData.cancel_fields, this.data.hide_item_table, this.data.rows,
                    this.events.checkboxcheck), this.el.find('.remind-group'));
            });
            this.actions.approveRemindShow();
        },

        /**
         *审批、提醒checkbox状态
         */
        approveRemindShow: function () {
            if (this.data.cancel_fields.indexOf('approve') === -1) {
                this.el.find(".checkbox_a2").addClass("workflow_checked");
            }
            else {
                this.el.find(".checkbox_a2").removeClass("workflow_checked");
            }
            let isAllGroupChecked = true;
            this.el.find('.label-select-all-show').each(function () {
                if (!$(this).is('.label-select-all-checked')) {
                    isAllGroupChecked = false;
                }
            });
            if (isAllGroupChecked) {
                this.el.find(".checkbox_a3").addClass('label-select-all-checked');
            } else {
                this.el.find(".checkbox_a3").removeClass('label-select-all-checked');
            }
        },

        /**
         *从隐藏栏中显示日历树
         */
        showRemindType: function (that, data) {
            that.el.find("#select-all-block-" + data.data).show();
            that.el.find("#select-all-block-" + data.data).find(".select-head").addClass('label-select-all-show label-select-all-checked');
            that.el.find("#select-all-block-" + data.data).find(".select-label-children").removeClass("unchecked");
            for (let i = 0; i < that.data.hide_tables.length; i++) {
                if (that.data.hide_tables[i].table_Id === data.data) {
                    that.data.hide_tables.splice(i, 1);
                    that.data.hide_item_table.splice(i, 1);
                    break;
                }
            }
            for (let i = 0; i < that.data.rows.length; i++) {
                if (that.data.rows[i].table_id === data.data) {
                    for (let j = 0; j < that.data.rows[i].items.length; j++) {
                        if (that.data.cancel_fields.indexOf(that.data.rows[i].items[j].field_id) !== -1) {
                            that.data.cancel_fields.splice(that.data.cancel_fields.indexOf(that.data.rows[i].items[j].field_id), 1);
                        }
                    }
                    break;
                }
            }
            let preference = {"content": that.data.cancel_fields};
            CalendarService.getCalendarPreference(preference);
            preference = {"content": that.data.hide_item_table};
            CalendarService.getCalendarHidePreference(preference);
            Mediator.emit('calendar-left:unshowData', {data: that.data.cancel_fields});
        }
    },

    binds: [
        {
            event: 'click',
            selector: '.checkbox_a3',
            callback: function (temp = this) {
                this.actions.checkbox_a3($(temp));
            }
        },
        {
            event: 'click',
            selector: '.checkbox_a2',
            callback: function () {
                let checkbox_a2 = this.el.find(".checkbox_a2");
                this.actions.approve_label(checkbox_a2);
            }
        },
        {
            event: 'click',
            selector: '.hide-type-group',
            callback: function (temp = this) {
                this.actions.hide_group($(temp), this);
            }
        }
    ],

    afterRender: function () {
        this.el.css({"height": "100%", "width": "100%"});
        this.actions.getCalendarTreeData();
        Mediator.on('calendar-left:showRemindType', data => {
            this.actions.showRemindType(this, data)
        });
    },

    beforeDestory: function () {
        Mediator.removeAll('calendar-left:unshowData');
    }
};

class LeftcontentCalendarset extends Component {
    constructor(data) {
        config.data.calendarTreeData = data;
        super(config);
    }
}

export default LeftcontentCalendarset;