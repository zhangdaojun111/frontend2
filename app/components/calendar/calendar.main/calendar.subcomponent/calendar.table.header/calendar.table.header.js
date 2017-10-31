/**
 * Created by zj on 2017/7/28.
 */
import Component from "../../../../../lib/component";
import template from './calendar.table.header.html';
import './calendar.table.header.scss';

let config = {
    template: template,
    data: {
        headData: [],
        type: '',
    },
    actions: {

    },
    afterRender: function() {
        this.el.find('.header-title').empty();
        if(this.data.type === 'month') {
            this.data.headData.forEach(item => {
                $('.header-title').append('<td class="head-grid"><span class="date-head">'+item.itemTitle+'</span></td>');
            })
        }
    }
};

class CalendarTableHeader extends Component {
    constructor(data, newconfig = {}) {
        config.data.headData = data['headTitle'];
        config.data.type = data['type'];
        super($.extend(true ,{}, config, newconfig));
    }
}

export default CalendarTableHeader;