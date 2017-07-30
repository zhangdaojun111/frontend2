/**
 * Created by zj on 2017/7/28.
 */
import Component from "../../../../../lib/component";
import template from './calendar.table.body.html';
import './calendar.table.body.scss';
import TableGrid from '../../calendar.subcomponent/calendar.table.grid/calendar.table.grid';

let config = {
    template: template,
    data: {
        currentData: [],
        index: Number,
    },
    actions: {

    },
    afterRender: function() {
        this.el.css({height:'calc(100%/6)',});
        $('#weekNum').attr("id", 'weekNum'+this.data.index);
        this.data.currentData.forEach(item => {
            this.append(new TableGrid({bodyData:item, type: 'month'}), this.el.find('#weekNum'+this.data.index));
            // if(item['isPartOfMonth']) {
            //     this.append(new TableGrid({bodyData:item, type: 'body'}), this.el.find('#weekNum'+this.data.index));
            // }
            // else {
            //     item['dayNum'] = 0;
            //     this.append(new TableGrid({bodyData:item, type: 'body'}), this.el.find('#weekNum'+this.data.index));
            // }
        });
    }
};

class CalendarTableBody extends Component {
    constructor(data) {
        config.data.currentData = data.item.weekList;
        config.data.index = data.index;
        super(config);
    }
}

export default CalendarTableBody;