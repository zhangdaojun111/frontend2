/**
 * Created by zj on 2017/7/28.
 */
import Component from "../../../../../lib/component";
import template from './calendar.table.body.html';
import './calendar.table.body.scss';

let config = {
    template: template,
    data: {
    },
    actions: {

    },
    afterRender: function() {
        //$('#weekNum').attr("id", 'weekNum'+this.data.index);
        console.log(this.data);
        this.data.forEach(item => {
            if(item['isPartOfMonth']) {
                $('#weekNum').append('<td class="item-td">'+item.dayNum+'</td>');
            }
            else {
                $('#weekNum').append('<td class="item-td">0</td>')
            }
        })
    }
};

class CalendarTableBody extends Component {
    constructor(data) {
        config.data = data.weekList;
        super(config);
    }
}

export default CalendarTableBody;