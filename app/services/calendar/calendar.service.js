/**
 * Created by zj on 2017/7/31.
 */


import { HTTP } from '../../lib/http';
import MSG from '../../lib/msgbox';

const saveCalendarTableUrl = 'calendar_mgr/save_calendar';

const getcalendarTableUrl = 'calendar_mgr/get_calendar';

const calendarTreeUrl = 'calendar_mgr/get_calendar_tree';

const calendarDataUrl = 'calendar_mgr/get_calendar_data';

const workflowRecordsUrl = 'get_workflow_records';

const calendarPreferenceUrl = 'calendar_mgr/calendar_preference';

const keyFieldDictUrl = 'calendar_mgr/key_field_dict';

const dragCalendarTaskUrl = 'calendar_mgr/drag_calendar';

export const CodeEnum = {
        SUCCESS: 200,
};

export const CalendarService = {

    /**
     * 保存日历设置
     * @param table_id
     * @param param_list
     * @returns {undefined|void|Promise.<TResult>}
     */
    saveCalendarTable: function (table_id, param_list) {
        let params = {
            table_id: table_id,
            param_list: JSON.stringify(param_list),
        };

        let res = HTTP.post(saveCalendarTableUrl, params).then(res => {
            if(res['code'] === CodeEnum.SUCCESS) {
                return res;
            } else {
                MSG.showTips('获取数据失败');
            }
        });
        HTTP.flush();
        return res;
    },

    /**
     * 获取日历设置中对应表设置
     * @param table_id
     * @returns {undefined|void|Promise.<TResult>}
     */
    getCalendarTableById: function (table_id) {
        let params = {
            table_id: table_id,
            isSelected: 0
        };

        let res = HTTP.post(getcalendarTableUrl, params).then(res => {
            if(res['code'] === CodeEnum.SUCCESS) {
                return res;
            } else {
                MSG.showTips('获取数据失败');
            }
        });
        HTTP.flush();
        return res;
    },

    /**
     * 获取日历树数据
     * @returns {undefined|void|Promise.<TResult>}
     */
    getCalendarTreeData: function () {
        let res = HTTP.get(calendarTreeUrl).then(res => {
            if(res['code'] === CodeEnum.SUCCESS) {
                return res;
            } else {
                MSG.showTips('获取数据失败');
            }
        });
        HTTP.flush();
        return res;
    },

    /**
     * 获取对应与日历树中勾选项的数据
     * 需要传入的参数data = {from_date: String; to_date: String, cancel_fields: [取消勾选的项目]}
     * @param data
     */
    getCalendarData: function (data) {
        let res = HTTP.post(calendarDataUrl, data).then(res => {
            if(res['code'] === CodeEnum.SUCCESS) {
                return res;
            } else {
                MSG.showTips('获取数据失败');
            }
        });
        HTTP.flush();
        return res;
    },

    /**
     * 获取工作流数据
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
                MSG.showTips('获取数据失败');
            }
        });
        HTTP.flush();
        return res;
    },

    /**
     * 保存个人偏好设置
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
                MSG.showTips('获取数据失败');
            }
        });
        HTTP.flush();
        return res;
    },

    /**
     * data = {content: [隐藏项]}
     * @param data
     */
    getCalendarHidePreference: function (data) {
        let params = {
            type: 6,
            content: JSON.stringify(data['content']),
        };
        console.log(data);
        let res = HTTP.post(calendarPreferenceUrl, params).then(res => {
            if(res['code'] === CodeEnum.SUCCESS) {
                return res;
            } else {
                MSG.showTips('获取数据失败');
            }
        });
        HTTP.flush();
        return res;
    },

    /**
     * 获取可配置参数
     * @param tableId
     * @returns {undefined|void|Promise.<TResult>}
     */
    getReplace: function (tableId) {
        let params = {
            table_id: tableId,
        };

        let res = HTTP.get(keyFieldDictUrl, params).then(res => {
            if(res['code'] === CodeEnum.SUCCESS) {
                return res;
            } else {
                MSG.showTips('获取数据失败');
            }
        });
        HTTP.flush();
        return res;
    },

    /**
     * 日历提醒
     * @param params
     * @returns {undefined|void|Promise.<TResult>}
     */
    getCalendarDrag: function (params) {
        let res = HTTP.get(dragCalendarTaskUrl, params).then(res => {
            console.log(res);
            if(res['code'] === CodeEnum.SUCCESS) {
                return res;
            } else {
                MSG.alert('获取数据失败');
            }
        });
        HTTP.flush();
        return res;
    }
};