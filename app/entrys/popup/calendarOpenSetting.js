/**
 * Created by zj on 2017/8/18.
 */
import 'jquery-ui/ui/widgets/button.js';
import 'jquery-ui/ui/widgets/dialog.js';
import CalendarSetting from '../../components/calendar/calendar.setting/calendar.setting';
import {PMAPI, PMENUM} from '../../lib/postmsg';
import {CalendarSetService} from '../../services/calendar/calendar.set.service';
CalendarSetService.getMenu().then(res => {
    let menu = res['menuList'].filter(item => {
        return item['folder_id'] !== 1;
    });
    let calendarOpenSetting = new CalendarSetting(menu);
    calendarOpenSetting.render($('#calendarOpenSetting'));
});



