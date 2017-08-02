/**
 * Created by zj on 2017/8/2.
 */
import Component from "../../lib/component";
import template from './calendar.setting.html';
import './calendar.setting.scss';

import {CalendarService} from '../../../services/calendar/calendar.service';

let config = {
    template: template,
    data: {
    },
    actions: {
    },
    afterRender: function() {
    }
};

class CalendarSetting extends Component {
    constructor() {
        super(config);
    }
}

export default CalendarSetting;