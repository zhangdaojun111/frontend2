/**
 * Created by zj on 2017/7/31.
 */


import { HTTP } from '../../lib/http';

const saveCalendarTableUrl = 'calendar_mgr/save_calendar';

const getcalendarTableUrl = 'calendar_mgr/get_calendar';

const calendarTreeUrl = 'calendar_mgr/get_calendar_tree';

const calendarDataUrl = 'calendar_mgr/get_calendar_data';

const workflowRecordsUrl = 'get_workflow_records';

const missionRecordUrl = 'get_mission_record';

const calendarPreferenceUrl = 'calendar_mgr/calendar_preference';

const keyFieldDictUrl = 'calendar_mgr/key_field_dict';

const dragCalendarTaskUrl = 'calendar_mgr/drag_calendar';

export const CodeEnum = {
        SUCCESS: 200,
};

export const CalendarService = {

    saveCalendarTable: function (table_id, param_list) {
        let params = {
            table_id: table_id,
            param_list: JSON.stringify(param_list),
        };

        let res = HTTP.post(saveCalendarTableUrl, params).then(res => {
            if(res['code'] === CodeEnum.SUCCESS) {
                return res;
            } else {
                alert('获取数据失败');
            }
        });
        HTTP.flush();
        return res;
    },

    getCalendarTableById: function (table_id) {
        let params = {
            table_id: table_id,
            isSelected: 0
        };

        let res = HTTP.post(getcalendarTableUrl, params).then(res => {
            if(res['code'] === CodeEnum.SUCCESS) {
                return res;
            } else {
                alert('获取数据失败');
            }
        });
        HTTP.flush();
        return res;
    },

    getCalendarTreeData: function () {
        let res = HTTP.get(calendarTreeUrl).then(res => {
            if(res['code'] === CodeEnum.SUCCESS) {
                console.log(res);
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
        let res = HTTP.post(calendarDataUrl, data).then(res => {
            if(res['code'] === CodeEnum.SUCCESS) {
                return res;
            } else {
                alert('获取数据失败');
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
            pre_type: 6,
            content: JSON.stringify(data['content']),
        };
        let res = HTTP.post(calendarPreferenceUrl, params).then(res => {
            if(res['code'] === CodeEnum.SUCCESS) {
                return res;
            } else {
                alert('获取数据失败');
            }
        });
        HTTP.flush();
        return res;
    },

    /**
     * data = {content: [隐藏项]}
     * @param data
     */
    getCalendarhidePreference: function (data) {
        let params = {
            type: 6,
            content: JSON.stringify(data['content']),
        };
        console.log(data);
        let res = HTTP.post(calendarPreferenceUrl, params).then(res => {
            if(res['code'] === CodeEnum.SUCCESS) {
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
    
    getCalendarDrag: function (params) {
        let res = HTTP.get(dragCalendarTaskUrl, params).then(res => {
            console.log(res);
            if(res['code'] === CodeEnum.SUCCESS) {
                return res;
            } else {
                //alert('获取数据失败');
            }
        });
        HTTP.flush();
        return res;
    }
};