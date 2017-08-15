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
        }).on('click', '.next-date', () => {
            Mediator.emit('Calendar: changeDate', 'next');
        });
        this.append(new LeftContent, this.el.find('.left-content'));
        this.append(new CalendarMin, this.el.find('.main-content'));
        Mediator.on('CalendarMain: remindCount', data => {
            console.log(data);
        });
    }
};

class Calendar extends Component {
    constructor() {
        super(config);
    }
}

export default Calendar;