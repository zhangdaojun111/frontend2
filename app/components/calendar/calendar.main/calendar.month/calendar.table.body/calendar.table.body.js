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
        //this.el.css({height:'calc(100%/6)',});
        this.el.addClass('abc');
        this.el.find('#weekNum').attr("id", 'weekNum'+this.data.index);
        this.data.currentData.forEach(item => {
            this.append(new TableGrid({bodyData:item, type: 'month'}), this.el.find('#weekNum'+this.data.index));
        });

    }
};

class CalendarTableBody extends Component {
    constructor(data, newconfig = {}) {
        config.data.currentData = data['item']['weekList'];
        config.data.index = data.index;
        super($.extend(true ,{}, config, newconfig));
    }
}

export default CalendarTableBody;