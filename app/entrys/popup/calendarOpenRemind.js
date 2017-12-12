/**
 * Created by zj on 2017/10/13.
 */
import 'jquery-ui/ui/widgets/button.js';
import 'jquery-ui/ui/widgets/dialog.js';
import CalendarRemind from '../../components/calendar/calendar.main/calendar.remind/calendar.remind';
import {PMAPI} from '../../lib/postmsg';

PMAPI.getIframeParams(window.config.key).then(params => {
    // let calendarRemind = new CalendarRemind(params['data']);
    let calendarRemind = new CalendarRemind({
        data: {
            remindTable: params['data'].remindTable,
            remindDateProp: params['data'].remindDateProp,
            remindDetail: params['data'].remindDetail,
            remindDateTime: params['data'].remindDateTime,
            remindTableId: params['data'].remindTableId,
            remindDate: params['data'].remindDate,
            remindTime: params['data'].remindTime,
            remindRealId: params['data'].remindRealId,
        }
    });
    calendarRemind.render($('#calendarOpenRemind'));
});

