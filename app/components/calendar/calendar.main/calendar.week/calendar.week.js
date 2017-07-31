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
        //this.append(new TableGrid({data:this.data.weekListHead, type: 'week'}), this.el.find('.week-head'));
        // this.data.weekListHead.forEach(item => {
        //     console.log(item.time);
        //     this.append(new TableGrid({headTitle: item.time, type: 'head'}), this.el.find('.week-head'));
        //
        // });
        this.append(new CalendarTableHeader({headTitle: this.data.weekListHead, type: 'week'}), this.el.find('.week-head'));

        for(let i = 0; i<7; i++) {
            this.append(new TableGrid({type: 'week'}), this.el.find('.week-body'));
        }

    }
};

class CalendarWeek extends Component {
    constructor(data) {
        [config.data.weekListHead, config.data.weekData] = data;
        super(config);
    }
}

export default CalendarWeek;