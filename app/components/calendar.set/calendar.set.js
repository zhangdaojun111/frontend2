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
        this.el.css({width: '100%'});
        console.log(window.config.table_id);

        CalendarService.getCalendarTableById({table_id:window.config.table_id, isSelected: 1}).then(res => {
            console.log(res);
            res['rows'].forEach(setItem => {
                this.append(new CalendarSetItem(setItem), this.el.find('.set-items'));
            })
        });
    }
};

class CalendarSet extends Component {
    constructor() {
        super(config);
    }
}

export default CalendarSet;