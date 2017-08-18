/**
 * Created by zj on 2017/8/15.
 */
import 'jquery-ui/ui/widgets/button.js';
import 'jquery-ui/ui/widgets/dialog.js';

import CalendarSetRemindMethod from '../../components/calendar.set/calendar.set.item/calendar.set.remind/calendar.set.remind';

let calendarSetRemind = new CalendarSetRemindMethod();

calendarSetRemind.render($('#calendarSetRemind'));
