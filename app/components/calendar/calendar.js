/**
 * Created by zj on 2017/7/27.
 */
import Component from "../../lib/component";
import template from './calendar.html';
import './calendar.scss';
import '../../assets/scss/calendar/icon-calendar.scss';
import LeftContent from './left-content/left-content';
import RightContent from './right-content/right-content';
import CalendarMain from './calendar.main/calendar.main';
import CalendarExport from './calendar.main/calendar.export/calendar.export';

import {CalendarService} from '../../services/calendar/calendar.service';
import {PMAPI} from '../../lib/postmsg';
import {CalendarTimeService} from '../../services/calendar/calendar.tool.service';

import Mediator from '../../lib/mediator';

let config = {
    template: template,
    data: {
        title: 'calendar',
        calendarMainComponent: {},
        keyValue: '',
    },
    actions: {
        getCalendarTreeData: function () {
            CalendarService.getCalendarTreeData().then(res => {
                this.el.find('.left-content').empty();
                this.append(new LeftContent(res), this.el.find('.left-content'));
                Mediator.emit('Calendar: tool', {toolMethod: 'refresh', data: res['cancel_fields']});
            });
        }
    },
    firstAfterRender: function () {
        let year = CalendarTimeService.getYear(),
            month = CalendarTimeService.getMonth(),
            week = CalendarTimeService.getWeek(),
            day = CalendarTimeService.getDay();
        this.data.today = Object.assign({}, {'y': year, 'm':month, 'd':day, 'w':week});

        this.data.selectedDateShow = year+'年'+(month+1) +'月';
        this.el.find('.nowDate').html(this.data.selectedDateShow);

        this.data.selectData = this.data.today;
        this.data.todayStr = CalendarTimeService.formatDate(year, month, day);
        this.data.chooseDate = CalendarTimeService.formatDate(year, month, day);
    },
    afterRender: function() {
        if(window === window.parent) {
            this.el.find('#open-new-window').hide();
        }
        CalendarService.getCalendarTreeData().then(res => {
            this.append(new LeftContent(res), this.el.find('.left-content'));
            this.append(new CalendarMain(res['cancel_fields']), this.el.find('.main-content'));
        });

        this.el.on('click', '#monthView', () => {
            Mediator.emit('Calendar: changeMainView', {calendarContent: 'month',});
            this.el.find('#monthView').addClass('btn-checked');
            this.el.find('#weekView, #dayView').removeClass('btn-checked');
            this.el.find('#todayView, #schedule').removeClass('today-btn-checked');
        }).on('click', '#weekView', () => {
            Mediator.emit('Calendar: changeMainView', {calendarContent: 'week',});
            this.el.find('#weekView').addClass('btn-checked');
            this.el.find('#monthView, #dayView').removeClass('btn-checked');
            this.el.find('#todayView, #schedule').removeClass('today-btn-checked');
        }).on('click', '#dayView', () => {
            this.el.find('#dayView').addClass('btn-checked');
            this.el.find('#monthView, #weekView').removeClass('btn-checked');
            this.el.find('#todayView, #schedule').removeClass('today-btn-checked');
            Mediator.emit('Calendar: changeMainView', {calendarContent: 'day',});
        }).on('click', '#todayView', () => {
            this.el.find('#todayView').addClass('today-btn-checked');
            this.el.find('#schedule').removeClass('today-btn-checked');
            this.el.find('#monthView, #weekView, #dayView').removeClass('btn-checked');
            Mediator.emit('Calendar: changeMainView', {calendarContent: 'today',});
        }).on('click', '#schedule', () => {
            this.el.find('#schedule').addClass('today-btn-checked');
            this.el.find('#todayView').removeClass('today-btn-checked');
            $('#monthView, #weekView, #dayView').removeClass('btn-checked');
            Mediator.emit('Calendar: changeMainView', {calendarContent: 'schedule',});
        }).on('click', '#refresh', () => {
            this.actions.getCalendarTreeData();
            //Mediator.emit('Calendar: tool', {toolMethod: 'refresh'});
        }).on('click', '#export', () => {
            Mediator.emit('Calendar: tool', {toolMethod: 'export'});
            // PMAPI.openDialogByIframe(
            //     '/iframe/calendarExport/',
            //     {
            //         title: '导出',
            //         width: '400',
            //         height: '460',
            //         modal: true,
            //     },
            // );
        }).on('click', '.pre-date', () => {
            Mediator.emit('Calendar: changeDate', 'pre');
        }).on('click', '.next-date', () => {
            Mediator.emit('Calendar: changeDate', 'next');
        }).on('click', '.header-icon', () => {
            Mediator.emit('Calendar: globalSearch', this.data.keyValue);
        }).on('keydown', '.search-box', (event) => {
            if(event.keyCode === 13) {
                Mediator.emit('Calendar: globalSearch', this.data.keyValue);
            }
        }).on('input propertychange', '.search-box', () => {
            this.data.keyValue = this.el.find('.search-box').val();
            if(this.data.keyValue === '') {
                Mediator.emit('Calendar: globalSearch', this.data.keyValue);
            }
        }).on('click', '#open-new-window', () => {
            window.open('/calendar_mgr/index/');
        });
        Mediator.on('CalendarMain: remindCount', data => {
            console.log(data);
        });
    },
    beforeDestory: function () {
        Mediator.removeAll('CalendarMain: remindCount');
    }
};

class Calendar extends Component {
    constructor() {
        super(config);
    }
}

export default Calendar;