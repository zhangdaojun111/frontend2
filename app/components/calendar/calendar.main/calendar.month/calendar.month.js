/**
 * Created by zj on 2017/7/27.
 */
import Component from "../../../../lib/component";
import template from './calendar.month.html';
import './calendar.month.scss';

import CalendarTableHeader from '../calendar.subcomponent/calendar.table.header/calendar.table.header';
import CalendarTableBody from './calendar.table.body/calendar.table.body';
import TableGrid from '../calendar.subcomponent/calendar.table.grid/calendar.table.grid';

let config = {
    template: template,
    data: {
        HeadList: [
            {itemTitle:'星期日'},
            {itemTitle:'星期一'},
            {itemTitle:'星期二'},
            {itemTitle:'星期三'},
            {itemTitle:'星期四'},
            {itemTitle:'星期五'},
            {itemTitle:'星期六'},
        ],
        monthBodyDataList: [],
    },
    actions: {

    },
    afterRender: function() {
        this.data.fromDate = this.data.monthBodyDataList[0]['weekList'][0]['dataTime'];
        this.el.css({"height":"100%","width":"100%"});
        this.append(new CalendarTableHeader({data:{headData: this.data.HeadList, type:'month'}}), this.el.find('.month-head'));
        this.data.monthBodyDataList.forEach((item,index) => {
            this.append(new CalendarTableBody({item,index}), this.el.find('.month-body'));
        });
    }
};

// class CalendarMonth extends Component {
//     constructor(data, newconfig = {}) {
//         config.data.monthBodyDataList = data;
//         super($.extend(true ,{}, config, newconfig));
//     }
// }
//
// export default CalendarMonth;
let CalendarMonth = Component.extend(config);

export default CalendarMonth;