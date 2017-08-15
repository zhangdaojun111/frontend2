/**
 * Created by zj on 2017/8/8.
 */
import Component from "../../../../../lib/component";
import template from './calendar.schedule.item.html';
import './calendar.schedule.item.scss';

import CalendarRemind from '../../calendar.remind/calendar.remind';

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
            let taskItemHtml = document.createElement('div');
            taskItemHtml.id = 'schedule-item';
            taskItemHtml.style.backgroundColor = item['color'];
            if(taskItemHtml['data3show']) {
                taskItemHtml.innerHTML = item['data3show'][0][0]['fieldName'] + ':' + item['data3show'][0][0]['fieldValue'];
                this.el.find('.day-schedule-list').append(taskItemHtml);
                taskItemHtml.onclick = function () {
                    console.log(item);
                    let component = new CalendarRemind(item);
                    let el = $('<div>').appendTo(document.body);
                    component.render(el);
                    el.dialog({
                        title: '查看',
                        width: '80%',
                        height: '800',
                        background: '#ddd',
                        close: function() {
                            $(this).dialog('destroy');
                            component.destroySelf();
                        }
                    });
                };
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