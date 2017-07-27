/**
 * Created by zj on 2017/7/27.
 */
import '../assets/scss/form.scss';

import 'jquery-ui/ui/widgets/button.js';
import 'jquery-ui/ui/widgets/dialog.js';

import Calendar from '../components/calendar/calendar';

let calendar = new Calendar();
console.log(calendar)

calendar.render($('#calendar'));
