/**
 * Created by zj on 2017/8/4.
 */
import '../assets/scss/form.scss';

import 'jquery-ui/ui/widgets/button.js';
import 'jquery-ui/ui/widgets/dialog.js';

import CalendarSet from '../components/calendar.set/calendar.set';

let calendarSet = new CalendarSet();

calendarSet.render($('#calendarSet'));
