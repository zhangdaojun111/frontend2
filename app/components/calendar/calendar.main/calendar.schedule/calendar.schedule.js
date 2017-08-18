/**
 * Created by zj on 2017/8/7.
 */
import Component from "../../../../lib/component";
import template from './calendar.schedule.html';
import './calendar.schedule.scss';

import CalendarScheduleItem from './calendar.schedule.item/calendar.schedule.item';
import Mediator from '../../../../lib/mediator';

import {PMAPI} from '../../../../lib/postmsg';


let config = {
    template: template,
    data: {
        scheduleStart: '',
        scheduleEnd: '',
        scheduleDataList: [],
    },
    actions: {
        //获得日程数据
        getSchedule: function(startDate, endDate) {
            if( startDate === '' || endDate === '' ){
                alert( '时间不能为空。' );
                return;
            }
            if( startDate > endDate ){
                alert( '起始时间不能大于结束时间。' );
                return
            }
            Mediator.emit('calendarSchedule: date', {from_date: startDate, to_date: endDate});
        }

    },
    afterRender: function() {
        $('.start-date').val(this.data.scheduleStart);
        $('.end-date').val(this.data.scheduleEnd);
        this.el.css({"height":"100%","width":"100%"});

        this.data.scheduleDataList.forEach(item => {
            console.log(item);
            this.append(new CalendarScheduleItem({dayDate: item['dataTime'], dayScheduleList: item['data']}), this.el.find('.schedule-content'));
        });
        let that = this;
        this.el.on('input propertychange', '.start-date', function () {

        }).on('input propertychange', '.end-date', function () {

        }).on('click', '.ok-btn', function () {
            let start = $('.start-date').val(),
                end = $('.end-date').val();
            that.actions.getSchedule(start, end);
            //PMAPI.sendToParent({startDate: start, endDate: end});
        });

    },
};

class CalendarSchedule extends Component {
    constructor(data) {
        config.data.scheduleStart = data.startDate;
        config.data.scheduleEnd = data.endDate;
        config.data.scheduleDataList = data.scheduleDataList;
        super(config);
    }
}

export default CalendarSchedule;