/**
 * Created by zj on 2017/8/3.
 */
import Component from "../../lib/component";
import template from './calendar.set.html';
import './calendar.set.scss';

import CalendarSetItem from './calendar.set.item/calendar.set.item';
import Mediator from '../../lib/mediator';
import {CalendarService} from '../../services/calendar/calendar.service';
import {dataTableService} from '../../services/dataGrid/data-table.service';

import {PMAPI} from '../../lib/postmsg';

let config = {
    template: template,
    data: {
        colorInfoFields: {},
        filedHead: {},
        dropdownForCalendarChange: [],
    },
    actions: {
    },
    afterRender: function() {

    }
};

class CalendarSet extends Component {
    constructor() {
        super(config);
    }
}

export default CalendarSet;