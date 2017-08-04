/**
 * Created by zj on 2017/8/4.
 */
import Component from "../../../lib/component";
import template from './calendar.set.item.html';
import './calendar.set.item.scss';

import {CalendarService} from '../../../services/calendar/calendar.service';
import {PMAPI} from '../../../lib/postmsg';

let config = {
    template: template,
    data: {
        rowSetData:{},
        //首页可修改字段
        dropdownForCalendarChange: [],
        dropdownForRes: [1,2,3],
    },
    actions: {
    },
    afterRender: function() {
        console.log(this.data.rowSetData);
        //$('.set-color').value = this.data.rowSetData['color'];
        //$('.set-color').val('#fff000');
        this.data.dropdownForRes.forEach(item => {
            this.el.find('.res-text').append("<option value='"+item+"'>"+item+"</option>");
        });
    }
};

class CalendarSetItem extends Component {
    constructor(data) {
        config.data.rowSetData = data;
        super(config);
    }
}

export default CalendarSetItem;