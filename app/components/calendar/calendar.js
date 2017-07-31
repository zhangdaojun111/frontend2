/**
 * Created by zj on 2017/7/27.
 */
import Component from "../../lib/component";
import template from './calendar.html';
import './calendar.scss';
import LeftContent from './left-content/left-content';
import RightContent from './right-content/right-content';
import CalendarMin from './calendar.min/calendar.min'
let config = {
    template: template,
    data: {
        title: 'calendar',
    },
    actions: {
    },
    afterRender: function() {
		 this.append(new LeftContent, this.el.find('.left-content'));
		 this.append(new RightContent, this.el.find('.right-content-workflow'));
    }
};

class Calendar extends Component {
    constructor() {
        super(config);
    }
}

export default Calendar;