/**
 * Created by zj on 2017/7/29.
 */
import Component from "../../../../lib/component";
import template from './calendar.week.html';
import './calendar.week.scss';

import TableGrid from '../calendar.subcomponent/calendar.table.grid/calendar.table.grid';
import CalendarTableHeader from '../calendar.subcomponent/calendar.table.header/calendar.table.header';

let config = {
    template: template,
    data: {
        weekListHead: [],
        weekData: [],
    },
    actions: {


    },
    afterRender: function() {
        this.el.css({"height":"100%","width":"100%"});
        //this.append(new CalendarTableHeader({headTitle: this.data.weekListHead, type: 'week'}), this.el.find('.week-head'));
        this.data.weekData.forEach(item => {
            this.append(new TableGrid({bodyData: item, type: 'week'}), this.el.find('.week-body'));
        });
        // for(let i = 0; i<7; i++) {
        //     this.append(new TableGrid({bodyData: this.data.weekData, type: 'week'}), this.el.find('.week-body'));
        // }

    }
};

class CalendarWeek extends Component {
    constructor(data) {
        [config.data.weekListHead, config.data.weekData] = data;
        super(config);
    }
}

export default CalendarWeek;