/**
 * Created by zj on 2017/7/29.
 */
import Component from "../../../../lib/component";
import template from './calendar.day.html';
import './calendar.day.scss';

import TableGrid from '../calendar.subcomponent/calendar.table.grid/calendar.table.grid';

let config = {
    template: template,
    data: {
        data: [],
    },
    actions: {


    },
    afterRender: function() {
        this.el.css({"height":"100%","width":"100%"});
        this.append(new TableGrid({bodyData: this.data['data'][0], type: 'day'}), this.el.find('.day-content'));
    }
};

class CalendarDay extends Component {
    constructor(data, newconfig) {
        config.data.data = data;
        super($.extend(true ,{}, config, newconfig));
    }
}

export default CalendarDay;