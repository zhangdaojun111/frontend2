/**
 * Created by zj on 2017/8/3.
 */
import Component from "../../lib/component";
import template from './calendar.set.html';
import './calendar.set.scss';

import CalendarSetItem from './calendar.set.item/calendar.set.item';

import {CalendarService} from '../../services/calendar/calendar.service';
import {PMAPI} from '../../lib/postmsg';

let config = {
    template: template,
    data: {

    },
    actions: {
    },
    afterRender: function() {
        console.log(window.config.table_id);

        // let tableSettingData = CalendarService.getCalendarTableById({table_id:'1', isSelected: 1});
        // tableSettingData['rows'].forEach(setItem => {
        //     this.append(new CalendarSetItem(setItem), this.el.find('.set-items'));
        // });
    }
};

class CalendarSet extends Component {
    constructor() {
        super(config);
    }
}

export default CalendarSet;