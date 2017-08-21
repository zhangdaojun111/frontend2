/**
 * Created by zj on 2017/8/18.
 */
import 'jquery-ui/ui/widgets/button.js';
import 'jquery-ui/ui/widgets/dialog.js';
import CalendarSetting from '../../components/calendar/calendar.setting/calendar.setting';
import {PMAPI, PMENUM} from '../../lib/postmsg';

PMAPI.subscribe(PMENUM.open_iframe_params, params => {
    let calendarOpenSetting = new CalendarSetting(params.data.menu);
    calendarOpenSetting.render($('#calendarOpenSetting'));
});


