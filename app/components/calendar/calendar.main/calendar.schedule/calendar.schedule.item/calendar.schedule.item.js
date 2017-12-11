/**
 * Created by zj on 2017/8/8.
 */
import Component from "../../../../../lib/component";
import template from './calendar.schedule.item.html';
import './calendar.schedule.item.scss';

import {PMAPI} from '../../../../../lib/postmsg';
import CalendarRemindTaskItem from '../../calendar.subcomponent/calendar.table.grid/calendar.remind.task.item/calendar.remind.task.item';


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
            this.append(new CalendarRemindTaskItem({data: item, type: 'schedule'}), this.el.find('.day-schedule-list'));

        })

    },
};
//
// class CalendarScheduleItem extends Component {
//     constructor(data, newconfig = {}) {
//         config.data.dayDate = data['dayDate'];
//         config.data.dayScheduleList = data['dayScheduleList'];
//         super($.extend(true ,{}, config, newconfig));
//     }
// }
//
// export default CalendarScheduleItem;
let CalendarScheduleItem = Component.extend(config);

export default CalendarScheduleItem;