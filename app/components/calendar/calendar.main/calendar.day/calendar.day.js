/**
 * Created by zj on 2017/7/29.
 */
import Component from "../../../../lib/component";
import template from './calendar.day.html';
import './calendar.day.scss';

import TableGrid from '../calendar.subcomponent/calendar.table.grid/calendar.table.grid';

let config = {
    template: template,
    data: {

    },
    actions: {


    },
    afterRender: function() {
        this.el.css({"height":"100%","width":"100%"});
        this.append(new TableGrid({type: 'day'}), this.el.find('.day-content'));
    }
};

class CalendarDay extends Component {
    constructor(data) {
        super(config);
    }
}

export default CalendarDay;