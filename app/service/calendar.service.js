/**
 * Created by zj on 2017/7/31.
 */

import { HTTP } from '../lib/http';

const server = 'http://127.0.0.1:8088';

const saveCalendarTableUrl = '/calendar_mgr/save_calendar/';

const calendarListUrl = '/calendar_mgr/get_calendar_tree/';

const calendarDataUrl = server + '/calendar_mgr/get_calendar_data/';


export const CalendarService = {

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
        })
    },

    getCalendarData: function () {
        HTTP.get(calendarDataUrl,'').then(res => {
            console.log('res',res);
        })
    }

};