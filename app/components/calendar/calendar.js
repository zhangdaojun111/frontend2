/**
 * Created by zj on 2017/7/27.
 */
import Component from "../../lib/component";
import template from './calendar.html';
import './calendar.scss';
import LeftContent from './left-content/left-content';
import RightContent from './right-content/right-content';
import CalendarMin from './calendar.main/calendar.main';
import CalendarSetting from './calendar.setting/calendar.setting';
import {CalendarService} from '../../services/calendar/calendar.service';
import {PMAPI} from '../../lib/postmsg';

import Mediator from '../../lib/mediator';

let config = {
    template: template,
    data: {
        title: 'calendar',

    },
    actions: {
    },
    afterRender: function() {
        this.el.on('click', '#monthView', () => {
            Mediator.emit('Calendar: changeMainView', {})
            //this.actions.changeMainView('month');
        }).on('click', '#weekView', () => {
            this.actions.changeMainView('week');
        }).on('click', '#dayView', () => {
            this.actions.changeMainView('day');
        });

        this.append(new LeftContent, this.el.find('.left-content'));
        this.append(new CalendarMin, this.el.find('.main-content'));
    }
};

class Calendar extends Component {
    constructor() {
        super(config);
    }
}

export default Calendar;