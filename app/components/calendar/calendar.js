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
        let oDate = new Date(),
            year = oDate.getFullYear(),
            month = oDate.getMonth();
        this.data.selectedDateShow = year+'年'+(month+1) +'月';
        this.el.find('.nowDate').html(this.data.selectedDateShow);
        this.el.on('click', '#monthView', () => {
            Mediator.emit('Calendar: changeMainView', {calendarContent: 'month',});
            $('#monthView').addClass('btn-checked');
            $('#weekView, #dayView').removeClass('btn-checked');
        }).on('click', '#weekView', () => {
            Mediator.emit('Calendar: changeMainView', {calendarContent: 'week',});
            $('#weekView').addClass('btn-checked');
            $('#monthView, #dayView').removeClass('btn-checked');
        }).on('click', '#dayView', () => {
            $('#dayView').addClass('btn-checked');
            $('#monthView, #weekView').removeClass('btn-checked');
            Mediator.emit('Calendar: changeMainView', {calendarContent: 'day',});
        }).on('click', '#todayView', () => {
            $('#todayView').addClass('today-btn-checked');
            $('#schedule').removeClass('today-btn-checked');
            $('#monthView, #weekView, #dayView').removeClass('btn-checked');
            Mediator.emit('Calendar: changeMainView', {calendarContent: 'today',});
        }).on('click', '#schedule', () => {
            $('#schedule').addClass('today-btn-checked');
            $('#todayView').removeClass('today-btn-checked');
            $('#monthView, #weekView, #dayView').removeClass('btn-checked');
            Mediator.emit('Calendar: changeMainView', {calendarContent: 'schedule',});
        }).on('click', '#refresh', () => {
            Mediator.emit('Calendar: tool', {toolMethod: 'refresh'});
        }).on('click', '#export', () => {
            Mediator.emit('Calendar: tool', {toolMethod: 'export'});
        }).on('click', '.pre-date', () => {
            Mediator.emit('Calendar: changeDate', 'pre');
            // if(this.data.calendarContent === 'month') {
            //     this.actions.changeMonth('l');
            //     this.actions.changeMainView('month');
            // } else if (this.data.calendarContent === 'week') {
            //     this.actions.changeWeek('l');
            //     this.actions.changeMainView('week');
            // } else if (this.data.calendarContent === 'day') {
            //     this.actions.changeDay('l');
            //     this.actions.changeMainView('day');
            // }
        }).on('click', '.next-date', () => {
            Mediator.emit('Calendar: changeDate', 'next');
            // if(this.data.calendarContent === 'month') {
            //     this.actions.changeMonth('r');
            //     this.actions.changeMainView('month');
            // } else if (this.data.calendarContent === 'week') {
            //     this.actions.changeWeek('r');
            //     this.actions.changeMainView('week');
            // } else if (this.data.calendarContent === 'day') {
            //     this.actions.changeDay('r');
            //     this.actions.changeMainView('day');
            // }
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