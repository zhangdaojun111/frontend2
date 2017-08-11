/**
 * Created by zj on 2017/7/31.
 */

import { HTTP } from '../../lib/http';
import Mediator from '../../lib/mediator';

const saveCalendarTableUrl = 'calendar_mgr/save_calendar';

const getcalendarTableUrl = 'calendar_mgr/get_calendar';

const calendarTreeUrl = 'calendar_mgr/get_calendar_tree';

const calendarDataUrl = 'calendar_mgr/get_calendar_data';

const workflowRecordsUrl = 'get_workflow_records';

const missionRecordUrl = 'get_mission_record';

const calendarPreferenceUrl = 'calendar_mgr/calendar_preference';

const menuUrl = 'get_menu';

const columnListUrl = 'get_column_list';

const keyFieldDictUrl = 'calendar_mgr/key_field_dict';

export const CodeEnum = {
        SUCCESS: 200,
};


export const CalendarService = {

    saveCalendarTable: function (table_id, param_list) {
        HTTP.post(saveCalendarTableUrl, {table_id: table_id, param_list:param_list}).then(res => {
            console.log(res);
            //return data;
        })
    },

    getCalendarTableById: function (data) {
        let params = {
            table_id: data['table_id'],
            isSelected: data['isSelected']
        };

        let res = HTTP.post(getcalendarTableUrl, params).then(res => {
            if(res['code'] === CodeEnum.SUCCESS) {
                return res;
            } else {
                //alert('获取数据失败');
            }
        });
        HTTP.flush();
        return res;
    },

    getCalendarTreeData: function () {
        let res = HTTP.get(calendarTreeUrl).then(res => {
            if(res['code'] === CodeEnum.SUCCESS) {
                return res;
            } else {
                //alert('获取数据失败');
            }
        });
        HTTP.flush();
        return res;
    },

    /**
     * 需要传入的参数data = {from_date: String; to_date: String, cancel_fields: [取消勾选的项目]}
     * @param data
     */
    getCalendarData: function (data) {
        let params = {
            from_date: data['from_date'],
            to_date: data['to_date'],
            cancel_fields: JSON.stringify(data['cancel_fields']),
        };
        let res = HTTP.post(calendarDataUrl, params).then(res => {
            if(res['code'] === CodeEnum.SUCCESS) {
                return res;
            } else {
                //alert('获取数据失败');
            }
        });
        HTTP.flush();
        return res;
    },

    /**
     * 需要传入的参数data = {from_date: String; to_date: String}
     * @param data
     */
    getWorkflowRecords: function (data) {
        let params = {
            type: data['type'],
            rows: 9999,
            page: 1,
            rate_data: 1,
            from_date: data['from_date'],
            to_date: data['to_date']
        };
        let res = HTTP.post(workflowRecordsUrl, params).then(res => {
            if(res['code'] === CodeEnum.SUCCESS) {
                return res;
            } else {
                //alert('获取数据失败');
            }
        });
        HTTP.flush();
        return res;
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

        let res = HTTP.post(missionRecordUrl, params).then(res => {
            if(res['code'] === CodeEnum.SUCCESS) {
                return res;
            } else {
                //alert('获取数据失败');
            }
        });
        HTTP.flush();
        return res;

    },

    /**
     * data = {content: [取消勾选的项目]}
     * @param data
     */
    getCalendarPreference: function (data) {
        let params = {
            type: 6,
            content: JSON.stringify(data['content']),
        };

        let res = HTTP.post(calendarPreferenceUrl, params).then(res => {
            if(res['code'] === CodeEnum.SUCCESS) {
                return res;
            } else {
                //alert('获取数据失败');
            }
        });
        HTTP.flush();
        return res;
    },

    getMenu: function () {
        let res = HTTP.get(menuUrl).then(res => {
            if(res['success'] === 1) {
                return res;
            } else {
                alert('获取数据失败');
            }
        });
        HTTP.flush();
        return res;
    },

    getReplace: function (tableId) {
        let params = {
            table_id: tableId,
        };

        let res = HTTP.get(keyFieldDictUrl, params).then(res => {
            if(res['code'] === CodeEnum.SUCCESS) {
                return res;
            } else {
                alert('获取数据失败');
            }
        });
        HTTP.flush();
        return res;
    },

    getColumnList: function (tableId) {
        let params = {
            table_id: tableId,
        };

        let res = HTTP.get(columnListUrl, params).then(res => {
            if(res['code'] === CodeEnum.SUCCESS) {
                return res;
            } else {
                alert('获取数据失败');
            }
        });
        HTTP.flush();
        return res;
    }

};