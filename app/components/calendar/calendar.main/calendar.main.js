/**
 * Created by zj on 2017/7/27.
 */
import Component from "../../../lib/component";
import template from './calendar.main.html';
import './calendar.main.scss';

import CalendarMonth from './calendar.month/calendar.month';

let config = {
    template: template,
    data: {
        title: 'calendar',
    },
    actions: {
    },
    afterRender: function() {
        this.el.css({"height":"100%","width":"100%"});
        this.append(new CalendarMonth(), this.el.find(".month"))
    }
};

class CalendarMain extends Component {
    constructor() {
        super(config);
    }
}

export default CalendarMain;