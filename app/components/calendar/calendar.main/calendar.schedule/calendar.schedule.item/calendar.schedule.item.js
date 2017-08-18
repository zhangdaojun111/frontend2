/**
 * Created by zj on 2017/8/8.
 */
import Component from "../../../../../lib/component";
import template from './calendar.schedule.item.html';
import './calendar.schedule.item.scss';

import CalendarRemind from '../../calendar.remind/calendar.remind';
import {PMAPI} from '../../../../../lib/postmsg';

let config = {
    template: template,
    data: {
        dayDate: '',
        dayScheduleList: [],
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
            PMAPI.sendToParent({from_date: startDate, to_date: endDate});
        }

    },
    afterRender: function() {
        this.data.dayScheduleList.forEach(item => {
            if(item.isShow) {
                let taskItemHtml = document.createElement('div');
                taskItemHtml.id = 'schedule-item';
                taskItemHtml.style.backgroundColor = item['color'];
                if(item['data3show']) {
                    taskItemHtml.innerHTML = item['data3show'][0][0]['fieldName'] + ':' + item['data3show'][0][0]['fieldValue'];
                    this.el.find('.day-schedule-list').append(taskItemHtml);
                    taskItemHtml.onclick = function () {
                        CalendarRemind.data.remindTable = item.tableName;
                        CalendarRemind.data.remindDateProp = item.fieldName;
                        CalendarRemind.data.remindDetail = item.data2show;
                        CalendarRemind.data.remindDateTime = item.time;
                        CalendarRemind.data.remindTableId = item.tableId;
                        CalendarRemind.data.remindDate = item.time.substr(0,10);
                        CalendarRemind.data.remindTime = item.time.substr(11,5);
                        PMAPI.openDialogByComponent(CalendarRemind, {
                            width: '1000',
                            height: '600',
                            title: '查看',
                        }).then(data => {
                            console.log(data);
                        });
                    };
                }
            }
        })

    },
};

class CalendarScheduleItem extends Component {
    constructor(data) {
        config.data.dayDate = data['dayDate'];
        config.data.dayScheduleList = data['dayScheduleList'];
        super(config);
    }
}

export default CalendarScheduleItem;