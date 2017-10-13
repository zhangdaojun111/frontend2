/**
 * Created by zj on 2017/10/13.
 */
import 'jquery-ui/ui/widgets/button.js';
import 'jquery-ui/ui/widgets/dialog.js';
import CalendarRemind from '../../components/calendar/calendar.main/calendar.remind/calendar.remind';
import {PMAPI} from '../../lib/postmsg';

PMAPI.getIframeParams(window.config.key).then(params => {
    console.log('fffffff',params);
    let calendarRemind = new CalendarRemind(params['data']);
    calendarRemind.render($('#calendarOpenRemind'));
});

