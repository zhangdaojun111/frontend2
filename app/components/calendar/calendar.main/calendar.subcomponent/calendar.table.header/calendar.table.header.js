/**
 * Created by zj on 2017/7/28.
 */
import Component from "../../../../../lib/component";
import template from './calendar.table.header.html';
import './calendar.table.header.scss';

let config = {
    template: template,
    data: {

    },
    actions: {

    },
    afterRender: function() {
        this.data.forEach(item => {
            $('.items-th').append('<th class="item-th">'+item.itemTitle+'</th>');
        })
    }
};

class CalendarTableHeader extends Component {
    constructor(data) {
        config.data = data;
        super(config);
    }
}

export default CalendarTableHeader;