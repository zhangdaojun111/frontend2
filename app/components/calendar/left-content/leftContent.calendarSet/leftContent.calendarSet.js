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

let config = {
    template: template,
    data: {
        cancel_fields: [],                                    //取消选中的filed_id数组
        hide_table: {'table_Id': '', 'tableName': ''},        //隐藏对象
        hide_tables: [],                                      //隐藏列表table_id数组
        rows: [],                                             //所有隐藏数据
        hide_item_table: [],                                  //隐藏对象数组
        calendarTreeData: {},                                 //日历树数据
    },
    events: {
        /**
         *日历树组件回掉函数
         * 参数data格式：{type:,data:}
         * type:'remind-checkbox' 提醒checkbox发生选择。
         * type:'unshowData' 提醒子树发生选择，unshowData发生改变。
         * type:'hideData' 隐藏日历树。
         */
        checkBoxCheck: function (data) {
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
            if (data.type === "hideData") {
                let hide_table_id = data.data.table_id;
                let hide_table_name = data.data.table_name;
                this.actions.remindShow();
                this.data.hide_table = {'tableName': hide_table_name, 'table_Id': hide_table_id};
                this.data.hide_item_table.push(hide_table_id);
                this.data.hide_tables.push(this.data.hide_table);
                let preferenceHide = {"content": this.data.hide_item_table};
                let preference = {"content": this.data.cancel_fields, contentHide: preferenceHide};
                CalendarService.getCalendarPreference(preference);
                Mediator.emit('calendar-left:hideRemindType', {data: this.data.hide_table});
                this.data.hide_table = {'tableName': "", 'table_Id': ''}
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
                _.pull(this.data.cancel_fields, 'approve');
                Mediator.emit('calendar-left:approveData', {data: true});
            }
            Mediator.emit('calendar-left:unshowData', {data: this.data.cancel_fields});
            let preference = {"content": this.data.cancel_fields};
            CalendarService.getCalendarPreference(preference);
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
            } else if (this.el.find('.label-select-all-show').length === 0) {
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
                if (!this.data.hide_item_table.includes(data.table_id)) {
                    // this.append(new LeftContentSelect(data, this.data.calendarTreeData.cancel_fields, this.data.hide_item_table, this.data.rows,
                    //     this.events.checkBoxCheck), this.el.find('.remind-group'));
                    this.append(new LeftContentSelect({
                        data: {
                            dataitem: data,
                            cancel_fields: this.data.calendarTreeData.cancel_fields,
                            rows: this.data.rows,
                        },
                        events: {
                            checkbox: this.events.checkBoxCheck,
                        }
                    }), this.el.find('.remind-group'));
                }
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
        showRemindType: function (data) {
            if (this.el.find(".label-select-all-show").length === 0) {
                this.el.find(".checkbox_a3").addClass('label-select-all-checked');
            }
            for (let i = 0; i < this.data.hide_tables.length; i++) {
                if (this.data.hide_tables[i].table_Id === data.data) {
                    this.data.hide_tables.splice(i, 1);
                    this.data.hide_item_table.splice(i, 1);
                    break;
                }
            }
            let row = {};
            for (let i = 0; i < this.data.rows.length; i++) {
                if (this.data.rows[i].table_id === data.data) {
                    row = this.data.rows[i];
                    for (let j = 0; j < this.data.rows[i].items.length; j++) {
                        if (this.data.cancel_fields.indexOf(this.data.rows[i].items[j].field_id) !== -1) {
                            this.data.cancel_fields.splice(this.data.cancel_fields.indexOf(this.data.rows[i].items[j].field_id), 1);
                        }
                    }
                    break;
                }
            }
            this.append(new LeftContentSelect({
                data: {
                    dataitem: row,
                    cancel_fields: this.data.cancel_fields,
                    rows: this.data.rows,
                },
                events: {
                    checkbox: this.events.checkBoxCheck,
                }
            }), this.el.find('.remind-group'));
            let preferenceHide = {"content": this.data.hide_item_table};
            let preference = {"content": this.data.cancel_fields, contentHide: preferenceHide};
            CalendarService.getCalendarPreference(preference);
            Mediator.emit('calendar-left:unshowData', {data: this.data.cancel_fields});
        }
    },

    binds: [
        {
            event: 'click',
            selector: '.checkbox_a3',
            callback: function (context) {
                this.actions.checkbox_a3($(context));
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
    ],

    afterRender: function () {
        this.el.css({"height": "100%", "width": "100%"});
        this.actions.getCalendarTreeData();
        Mediator.on('calendar-left:showRemindType', data => {
            this.actions.showRemindType(data);
        });
    },

    beforeDestory: function () {
        Mediator.removeAll('calendar-left:showRemindType');
    }
};

// class LeftcontentCalendarset extends Component {
//     constructor(data,newConfig) {
//         config.data.calendarTreeData = data;
//         super(config,$.extend(true,{},config,newConfig));
//     }
// }
//
// export default LeftcontentCalendarset;
let LeftcontentCalendarset = Component.extend(config);

export default LeftcontentCalendarset;