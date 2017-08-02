/**
 * Created by zj on 2017/7/31.
 */

import { HTTP } from '../lib/http';
import Mediator from 'mediator-js';

const saveCalendarTableUrl = '/calendar_mgr/save_calendar/';

const calendarListUrl = '/calendar_mgr/get_calendar_tree/';

const calendarDataUrl = '/calendar_mgr/get_calendar_data/';

const workflowRecordsUrl = '/get_workflow_records/';

const missionRecordUrl = '/get_mission_record/';

const calendarPreferenceUrl = '/calendar_mgr/calendar_preference/';

export const CalendarService = {

    CalendarMsgMediator: new Mediator(),

    saveCalendarTable: function (table_id, param_list) {
        return HTTP.post(saveCalendarTableUrl, {table_id: table_id, param_list:param_list}).then(res => {
            console.log(res);
            //let data = res.json();
            //return data;
        })
    },

    getCalendarTreeData: function () {
        HTTP.get(calendarListUrl,'').then(res => {
            console.log('res',res);
        });
        HTTP.flush();
    },

    /**
     * 需要传入的参数data = {from_date: String; to_date: String, cancel_fields: [取消勾选的项目]}
     * @param data
     */
    getCalendarData: function (data) {
        let params = {
            from_date: data['from_date'],
            to_date: data['to_date'],
            cancel_fields: [],
        };
        HTTP.get(calendarDataUrl,'').then(res => {
            console.log('res',res);
        });
        HTTP.flush();
    },

    /**
     * 需要传入的参数data = {from_date: String; to_date: String}
     * @param data
     */
    getWorkflowRecords: function (data) {
        let params = {
            type: 5,
            rows: 9999,
            page: 1,
            rate_data: 1,
            from_date: data['from_date'],
            to_date: data['to_date']
        };
        HTTP.get(workflowRecordsUrl,data).then(res => {
            console.log('res',res);
        });
        HTTP.flush();
    },

    /**
     * 需要传入的参数data = {from_date: String; to_date: String}
     * @param data
     */
    getMissionRecords: function (data) {
        let params = {
            type: 5,
            first: 0,
            rows: 9999,
            rate_data: 1,
            from_date: data['from_date'],
            to_date: data['to_date']
        };
        HTTP.get(workflowRecordsUrl,data).then(res => {
            console.log('res',res);
        });
        HTTP.flush();
    },

    /**
     * data = {content: [取消勾选的项目]}
     * @param data
     */
    getCalendarPreference: function (data) {
        let params = {
            type: 6,
            content: data['content'],
        };
        HTTP.get(workflowRecordsUrl,data).then(res => {
            console.log('res',res);
        });
        HTTP.flush();
    },

};