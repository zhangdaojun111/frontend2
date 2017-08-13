/**
 * Created by zj on 2017/8/10.
 */
import Component from "../../../../lib/component";
import template from './calendar.set.remind.html';
import './calendar.set.remind.scss';

import {CalendarService} from '../../../../services/calendar/calendar.service';

let CalendarSetRemindMethod = {
    template: template,
    data: {
        emailStatus: 0,
        smsStatus: 0
    },
    actions: {

    },
    afterRender: function() {
        console.log(this.data);
    }
};

// class CalendarSetRemindMethod extends Component {
//     constructor() {
//         super(config);
//     }
// }

export default CalendarSetRemindMethod;