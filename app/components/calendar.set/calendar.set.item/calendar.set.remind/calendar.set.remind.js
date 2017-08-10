/**
 * Created by zj on 2017/8/10.
 */
import Component from "../../../../lib/component";
import template from './calendar.set.remind.html';
import './calendar.set.remind.scss';

import {CalendarService} from '../../../../services/calendar/calendar.service';

let config = {
    template: template,
    data: {
        menu: []
    },
    actions: {

    },
    afterRender: function() {

    }
};

class CalendarSetRemind extends Component {
    constructor() {
        super(config);
    }
}

export default CalendarSetRemind;