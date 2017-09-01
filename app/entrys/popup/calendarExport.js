/**
 * Created by zj on 2017/8/31.
 */
import 'jquery-ui/ui/widgets/button.js';
import 'jquery-ui/ui/widgets/dialog.js';

import CalendarExport from '../../components/calendar/calendar.main/calendar.export/calendar.export';


let calendarExport = new CalendarExport();

calendarExport.render($('#calendarExport'));