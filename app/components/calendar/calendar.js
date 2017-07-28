/**
 * Created by zj on 2017/7/27.
 */
import Component from "../../lib/component";
import template from './calendar.html';
import './calendar.scss';
import CalendarMain from './calendar.main/calendar.main';

let config = {
    template: template,
    data: {
        title: 'calendar',
    },
    actions: {
    },
    afterRender: function() {
        this.append(new CalendarMain(), this.el.find('.main-content'));
    }
};

class Calendar extends Component {
    constructor() {
        super(config);
    }
}

export default Calendar;