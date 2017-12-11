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
        this.data.weekData.forEach(item => {
            this.append(new TableGrid({bodyData: item, type: 'week'}), this.el.find('.week-body'));
        });
    }
};

// class CalendarWeek extends Component {
//     constructor(data, newconfig = {}) {
//         [config.data.weekListHead, config.data.weekData] = data;
//         // super(config);
//         super($.extend(true ,{}, config, newconfig));
//     }
// }
//
// export default CalendarWeek;
let CalendarWeek = Component.extend(config);

export default CalendarWeek;