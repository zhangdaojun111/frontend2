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
        monthDataList: [],
    },
    actions: {

    },
    afterRender: function() {
        this.el.css({"height":"100%","width":"100%"});
        // this.data.HeadList.forEach(item => {
        //     this.append(new TableGrid({headTitle: item.itemTitle, type:'head'}), this.el.find('.month-head'));
        // });

        this.append(new CalendarTableHeader({headTitle: this.data.HeadList, type:'month'}), this.el.find('.month-head'));

        this.data.monthDataList.forEach((item,index) => {
            this.append(new CalendarTableBody({item,index}), this.el.find('.month-body'));
        });
        // $('#task-item').bind('click', function () {
        //     console.log($(this).html());
        // })
    }
};

class CalendarMonth extends Component {
    constructor(data) {
        config.data.monthDataList = data;
        super(config);
    }
}

export default CalendarMonth;