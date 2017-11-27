/**
 * Created by zj on 2017/8/7.
 */
import Component from "../../../../lib/component";
import template from './calendar.schedule.html';
import './calendar.schedule.scss';

import CalendarScheduleItem from './calendar.schedule.item/calendar.schedule.item';
import Mediator from '../../../../lib/mediator';
import DateControl from '../../../form/date-control/date-control';

import {PMAPI} from '../../../../lib/postmsg';


let config = {
    template: template,
    data: {
        scheduleStart: '',
        scheduleEnd: '',
        scheduleDataList: [],
        startDate: '',
        endDate: '',
    },
    actions: {
        /**
         * 获取日程数据
         * @param startDate
         * @param endDate
         */
        getSchedule: function(startDate, endDate) {
            // startDate = startDate || this.data.scheduleStart;
            // endDate = endDate || this.data.scheduleEnd;
            startDate = startDate? startDate:this.data.scheduleStart;
            endDate = endDate? endDate:this.data.scheduleEnd;
            if( startDate === '' || endDate === '' ){
                alert( '时间不能为空。' );
                return;
            }
            if( startDate > endDate ){
                alert( '起始时间不能大于结束时间。' );
                return
            }
            Mediator.emit('calendarSchedule: date', {from_date: startDate, to_date: endDate});
        },

    },
    binds:[
        {
            event:'click',
            selector:'.ok-btn',
            callback:function(){
                this.actions.getSchedule(this.data.startDate, this.data.endDate);
            }
        }
    ],
    afterRender: function() {
        this.el.css({"height":"100%","width":"100%"});

        this.data.scheduleDataList.forEach(item => {
            this.append(new CalendarScheduleItem({dayDate: item['dataTime'], dayScheduleList: item['data']}), this.el.find('.schedule-content'));
        });
        // let _this = this;
        // this.el.on('click', '.ok-btn', function () {
        //     _this.actions.getSchedule(_this.data.startDate, _this.data.endDate);
        //     //PMAPI.sendToParent({startDate: start, endDate: end});
        // });
        let changeStartValue = (res) => {
            this.data.startDate = res.value;
            this.data.scheduleStart = this.data.startDate;
        };
        let changeEndValue = (res) => {
            this.data.endDate = res.value;
            this.data.scheduleEnd = this.data.endDate;
        };
        this.append(new DateControl({value: this.data.scheduleStart,isCalendar: true},{changeValue: changeStartValue}), this.el.find('.start-date'));
        this.append(new DateControl({value: this.data.scheduleEnd, isCalendar: true},{changeValue: changeEndValue}), this.el.find('.end-date'));
    },
};

class CalendarSchedule extends Component {
    constructor(data, newconfig = {}) {
        config.data.scheduleStart = data.startDate;
        config.data.scheduleEnd = data.endDate;
        config.data.scheduleDataList = data.scheduleDataList;
        super($.extend(true ,{}, config, newconfig));
    }
}

export default CalendarSchedule;