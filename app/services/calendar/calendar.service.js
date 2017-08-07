/**
 * Created by zj on 2017/7/31.
 */

import { HTTP } from '../../lib/http';
import Mediator from 'mediator-js';
import {MenuData, table1190DataSet, calendarData} from '../../components/calendar/testData/get_menu_data';

const saveCalendarTableUrl = 'calendar_mgr/save_calendar';

const getcalendarTableUrl = 'calendar_mgr/get_calendar';

const calendarTreeUrl = 'calendar_mgr/get_calendar_tree';

const calendarDataUrl = 'calendar_mgr/get_calendar_data';

const workflowRecordsUrl = 'get_workflow_records';

const missionRecordUrl = 'get_mission_record';

const calendarPreferenceUrl = 'calendar_mgr/calendar_preference';

export const CodeEnum = {
        SUCCESS: 200,
};


export const CalendarService = {

    CalendarMsgMediator: new Mediator(),

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
        // HTTP.post(getcalendarTableUrl,params).then(res => {
        //     if(res['code'] === CodeEnum.SUCCESS) {
        //         return res;
        //     } else {
        //         alert('获取数据失败');
        //     }
        // });
        return table1190DataSet;
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
        // let params = {
        //     from_date: data['from_date'],
        //     to_date: data['to_date'],
        //     cancel_fields: JSON.stringify([]),
        // };
        // let res = HTTP.post(calendarDataUrl, params).then(res => {
        //     if(res['code'] === CodeEnum.SUCCESS) {
        //         return res;
        //     } else {
        //         //alert('获取数据失败');
        //     }
        // });
        // HTTP.flush();
        // return res;
        return calendarData;
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

    menu: [],
    getMenu: function () {
        let ls_menu = MenuData;
        if(ls_menu){
            this.menu = ls_menu['menuList'];
            //this.MenuData.next(ls_menu.menuList);
            return this.menu;
        }
        // else {
        //     let url = '/data/get_menu/';
        //     this.http.get(url)
        //         .map(this.extractNormalData)
        //         .catch(this.handleObservableError)
        //         .subscribe(
        //             res => {
        //                 if(res.success == 1){
        //                     this.lsSet('v_menu',JSON.stringify(res));
        //                     this.menu = res.menuList;
        //                     this.MenuData.next(res.menuList);
        //                 }
        //             }
        //         )
        // }
    }

};