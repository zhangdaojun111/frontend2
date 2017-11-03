/**
 * Created by zj on 2017/8/3.
 */

/**
 * @author zj
 * @description 对日历表进行设置
 */

import Component from "../../lib/component";
import template from './calendar.set.html';
import './calendar.set.scss';

import CalendarSetItem from './calendar.set.item/calendar.set.item';
import Mediator from '../../lib/mediator';
import {CalendarService} from "../../services/calendar/calendar.service"
import {CalendarSetService} from "../../services/calendar/calendar.set.service"
import {UserInfoService} from '../../services/main/userInfoService';
import MSG from '../../lib/msgbox';
import {AutoSelect} from '../util/autoSelect/autoSelect';

import {PMAPI} from '../../lib/postmsg';

let config = {
    template: template,
    data: {
        tableId: '',
        colorInfoFields: {},
        filedHead: {},
        allRows: [],
        rowTitle: [],
        initAllRows: [],
        dropdown: [],
        dropdownForRes: [],
        replaceDropDown: [],
        dropdownForCalendarChange: [],
        isConfigField: false,
        isEdit: false,

        //收信人
        recipients: [],
        recipients_per: [],

        //抄送人
        copypeople: [],

        //发信箱数据
        emailAddressList: [],

        //默认选择的
        emailAddress: '',

        childComponents: [],
    },
    actions: {

        /**
         * @author zj
         * 组装设置中下拉选项数据
         */
        getMultiSelectDropdown: function () {
            let res = this.data.filedHead;
            console.log(res);
            this.data.dropdown = [];
            this.data.dropdownForRes = [];
            for (let columenListIndex in res) {
                let item = res[columenListIndex];
                // console.log(item);
                if (item['dinput_type'] === "3" || item['dinput_type'] === "5" || item["real_type"] === "3" || item["real_type"] === "5") {
                    this.data.rowTitle.push(item);
                }

                if (res[columenListIndex]["field"] !== "_id") {
                    this.data.dropdown.push({
                        name: res[columenListIndex]['name'],
                        id: res[columenListIndex]['id']
                    });
                    if(item['dinput_type'] !== '27') {
                        this.data.dropdownForRes.push({
                            name: res[columenListIndex]['name'],
                            id: res[columenListIndex]['id']
                        })
                    }
                }
            }
            console.log(this.data.dropdownForRes);
            this.actions.getSetting(this.data.tableId);
        },


        getSetting: function (tableid) {
            let res = this.data.colorInfoFields;
            this.data.initAllRows = [];
            this.data.initAllRows = res;
            this.actions.makeRows(this.data.initAllRows);
        },

        /**
         * @author zj
         * 组装设置的行数据
         * @param param
         */
        makeRows: function (param) {
            this.data.allRows = [];

            // 获取可配置字段数据
            CalendarService.getReplace(this.data.tableId).then(res => {
                if (res.error !== '') {
                    throw res.error;
                }
                for (let key in res.data) {
                    let obj = {
                        name: res.data[key]['dname'],
                        id: res.data[key]['field_id'],
                    };
                    this.data.replaceDropDown.push(obj);
                }
                if (param['rows'].length === 0) {
                    for (let i = 0; i < this.data.rowTitle.length; i++) {
                        this.data.allRows.push({
                            isSelected: false,
                            is_show_at_home_page: false,
                            name: this.data.rowTitle[i].name,
                            field_id: this.data.rowTitle[i].id,
                            color: "#000000",
                            selectedOpts: [],
                            selectedRepresents: '',
                            selectedEnums: '',
                            email: this.data.rowTitle[i]['email'],
                            sms: this.data.rowTitle[i]['sms'],
                        })
                    }
                } else {
                    // 组装行数据
                    for (let singleSetting of param['rows']) {

                        this.data.allRows.push({
                            isSelected: singleSetting['isSelected'] || false,
                            is_show_at_home_page: singleSetting['is_show_at_home_page'] === 1 ? true : false,
                            color: singleSetting['color'],
                            field_id: singleSetting['field_id'],
                            name: singleSetting['field_id'],
                            id: singleSetting['id'] || "",
                            selectedOpts: singleSetting['selectedOpts'],
                            selectedRepresents: singleSetting['selectedRepresents'][0],
                            selectedEnums: singleSetting['selectedEnums'][0],
                            email: singleSetting['email'],
                            sms: singleSetting['sms'],
                            key_field_id: singleSetting['key_field_id'],
                        })
                    }
                }
                this.actions.createSettingRow();

            }).catch(err => {
                console.log('error', err);
            });
        },

        /**
         * @author zj
         * 创建行组件
         */
        createSettingRow: function () {
            this.data.childComponents = [];
            this.data.allRows.forEach((row, index) => {
                let isConfig = false;
                if (this.data.rowTitle[index]['id'] && this.data.rowTitle[index]['dtype'] === '8' && this.data.replaceDropDown.length !== 0) {
                    isConfig = true;
                }
                let rowTitleItem = {};
                for (let a of this.data.rowTitle) {
                    if (a['id'] === row['field_id']) {
                        rowTitleItem['id'] = a['id'];
                        rowTitleItem['name'] = a['name'];
                    }
                }
                let calendarSetItem = new CalendarSetItem({
                    rowData: row,
                    dropdown: this.data.dropdown,
                    dropdownForRes: this.data.dropdownForRes,
                    dropdownForCalendarChange: this.data.dropdownForCalendarChange,
                    replaceDropDown: this.data.replaceDropDown,
                    isConfigField: isConfig,
                    rowTitle: rowTitleItem,

                    recipients: this.data.recipients,
                    recipients_per: this.data.recipients_per,
                    copypeople: this.data.copypeople,
                    emailAddressList: this.data.emailAddressList,
                    emailAddress: this.data.emailAddress,
                });
                this.data.childComponents.push(calendarSetItem);
                this.append(calendarSetItem, this.el.find('.set-items'));
            });

            this.el.find('.set-btn').attr('disabled',false)
            // this.hideLoading();
        },

        /**
         * @author zj
         * @param tableId
         * 是否确定重置
         */
        despReset: function (tableId) {
            this.data.tableId = tableId;
            MSG.alert("确定要重置吗？重置后会清空所有设置").then(res => {
                if (res['confirm']) {

                    this.actions.reset(tableId);
                }
            });
        },

        /**
         * 重置所有设置
         * @param tableId
         */
        reset: function (tableId) {
            let field_ids = [];
            // 重置每行数据
            for (let a of this.data.allRows) {
                field_ids.push(a['field_id']);
                a['isSelected'] = false;
                a['is_show_at_home_page'] = false;
                a['color'] = "#000000";
                a['selectedOpts'] = [];
                a['selectedRepresents'] = [];
                a['selectedEnums'] = [];
                a['email'] = {
                    receiver: [],
                    cc_receiver: [],
                    email_id: this.data.emailAddress,
                    remind_time: '',
                    email_status: 0
                };
                a['sms'] = {
                    receiver: [],
                    cc_receiver: [],
                    remind_time: '',
                    sms_status: 0
                };
            }

            for (let eachRow of this.data.allRows) {
                if (eachRow['isSelected'] === false) {
                    eachRow['isSelected'] = 0;
                } else if (eachRow['isSelected'] === true) {
                    eachRow['isSelected'] = 1;
                }
            }
            CalendarSetService.resetCalendar(tableId, this.data.allRows).then(res => {
                if (res['success'] === 1) {
                    Mediator.emit('Calendar:calendarReset', field_ids);
                    MSG.alert('重置成功');
                    setTimeout(() => {
                        this.el.find('.set-items').empty();
                        this.actions.getColumnListData(this.data.tableId);
                    }, 200)
                }
            });
        },

        /**
         * @author zj
         * @param tableId
         * @param param
         * 保存修改
         */
        saveSetting(tableId, param) {
            // 判断提醒开启时收件人不为空
            for (let data of param) {
                if (data.is_show_at_home_page && !data.selectedRepresents) {
                    MSG.alert("如果首页显示勾选需要选择代表字段。");
                    return;
                }
            }
            for (let eachRow of param) {
                if (eachRow['isSelected'] === false) {
                    eachRow['isSelected'] = 0;
                } else if (eachRow['isSelected'] === true) {
                    eachRow['isSelected'] = 1;
                }
                if (eachRow['is_show_at_home_page'] === false) {
                    eachRow['is_show_at_home_page'] = 0;
                } else if (eachRow['is_show_at_home_page'] === true) {
                    eachRow['is_show_at_home_page'] = 1;
                }
                eachRow['selectedRepresents'] = [eachRow['selectedRepresents']];
                eachRow['selectedEnums'] = [eachRow['selectedEnums']];
            }
            for (let data of param) {
                for (let i = 0; i < data['selectedRepresents'].length; i++) {
                    if (data['selectedRepresents'][i] === undefined) {
                        data['selectedRepresents'].splice(i, 1);
                    }
                }
            }
            for (let data of param) {
                for (let i = 0; i < data['selectedEnums'].length; i++) {
                    if (data['selectedEnums'][i] === undefined) {
                        data['selectedEnums'].splice(i, 1);
                    }
                }
            }
            CalendarService.saveCalendarTable(tableId, param).then(res => {
                if (res['succ'] === 1) {
                    MSG.alert("保存成功");
                    setTimeout(() => {
                        //CalendarSetService.getColumnList(this.data.tableId)
                        this.el.find('.set-items').empty();
                        this.actions.getColumnListData(this.data.tableId);
                    }, 500);

                } else if (res['succ'] === 0) {
                    MSG.alert(res['error']);
                }
            });
            this.el.find(".hide-btns").css("visibility", "hidden");
            this.el.find(".set-btn").removeClass("disabled");
            Mediator.emit('calendar-set:editor', {data: -1});
        },

        /**
         * @author zj
         * @param tableId
         * 获取设置的表头及首页可修改字段
         */
        getColumnListData: function (tableId) {
            CalendarSetService.getColumnList(tableId).then(res => {
                this.data.filedHead = res['rows'];

                CalendarService.getCalendarTableById(tableId).then(res => {
                    this.data.colorInfoFields = res;
                    this.data.dropdownForCalendarChange = [{id: '', name: ''}];
                    for (let d of this.data.filedHead) {
                        if (d.dtype === '4' && ( d.dinput_type === '6' || d.dinput_type === '7' )) {
                            this.data.dropdownForCalendarChange.push({
                                name: d['name'],
                                id: d['id']
                            })
                        }
                    }
                    this.actions.getMultiSelectDropdown();
                });
                CalendarSetService.getCalendarPeople(tableId).then(res => {
                    this.data.recipients = [];
                    for (let data of res['rows']) {
                        if (data['type'] && data['type'] === 'email') {
                            this.data.recipients.push({name: data.dname, id: data.id})
                        } else {
                            this.data.recipients.push({name: data.dname, id: data.id})
                            this.data.recipients_per.push({name: data.dname, id: data.id})
                        }
                    }
                });

            });
        }
    },
    binds: [
        {
            event: 'click',
            selector: '.editor-btn',
            callback: function (temp = this) {
                this.el.find(".hide-btns").css("visibility", "visible");
                $(temp).addClass("disabled");
                $('.reset-btn').addClass("disabled").attr('disable','false');
                for (let obj of this.data.childComponents) {
                    obj.actions.editable();
                }
            }
        },
        {
            event: 'click',
            selector: '.cancel-btn',
            callback: function () {
                this.el.find(".hide-btns").css("visibility", "hidden");
                this.el.find(".set-btn").removeClass("disabled");
                this.el.find('.set-items').empty();
                this.actions.getSetting(this.data.tableId);
            }
        },
        {
            event: "click",
            selector: '.reset-btn',
            callback: function () {
                this.actions.despReset(this.data.tableId);
            }
        },
        {
            event:'click',
            selector:'.save-btn',
            callback:function(){
                let newAllRowsData = [];
                for (let obj of this.data.childComponents) {
                    newAllRowsData.push(obj.data.rowSetData);
                }
                this.actions.saveSetting(this.data.tableId, newAllRowsData);
            }
        }
    ],
    afterRender: function () {
        this.el.css({width: '100%', height: "100%"});
        // this.el.find('iframe').css("width", "100%");

        // 用于在系统的其他地方打开日历设置
        // if (window.config.table_id) {
        //     this.data.tableId = window.config.table_id;
        //     this.actions.getColumnListData(this.data.tableId);
        // }

        // 获取设置提醒方式中的可用的人员信息
        UserInfoService.getAllUsersInfo().then(user => {
            this.data.copypeople = [];
            for (let data of user.rows) {
                console.log(data.name,data.name.indexOf('离职'));
                if(data.name.indexOf('离职') === -1){
                    this.data.copypeople.push({name: data.name, id: data.id});
                }
            }
        });

        // 获取邮件发送地址
        CalendarSetService.getEmailSetting().then(res => {
            this.data.emailAddressList = [];
            for (let x in res['data']) {
                this.data.emailAddressList.push({
                    name: res['data'][x]['host'] + '(' + res['data'][x]['user'] + ')',
                    id: res['data'][x]['id'] ? res['data'][x]['id'] : ''
                });
                if (res['data'][x]['is_default'] === 1) {
                    this.data.emailAddress = res['data'][x]['id'];
                }
            }
        });
        this.actions.getColumnListData(this.data.tableId);
    },
};

class CalendarSet extends Component {
    constructor(data,newConfig) {
        config.data.tableId = data;
        super($.extend(true,{},config,newConfig));
    }
}

export default CalendarSet;