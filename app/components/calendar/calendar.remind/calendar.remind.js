/**
 * Created by zj on 2017/8/7.
 */
import Component from "../../../lib/component";
import template from './calendar.remind.html';
import './calendar.remind.scss';

let config = {
    template: template,
    data: {
        remindTable: '',
        remindDateProp: '',
        remindDetail: [],
        remindDateTime: '',
        remindTableId: '',
        remindDate: '',
        remindTime: ''
    },
    actions: {

    },
    afterRender: function() {
        console.log(this.data.remindDetail);
        this.data.remindDetail.forEach(items => {
            items.forEach(item => {
                console.log(item);
                $('.detail').prepend('<tr><td class="detail-title">'+ item['fieldName'] +'</td><td class="detail-content">'+ item['fieldValue'] +'</td></tr>')
            });
            $('.open-form').on('click', function () {

            });
        });
    }
};

class CalendarRemind extends Component {
    constructor(data) {
        config.data.remindTable = data.tableName;
        config.data.remindDateProp = data.fieldName;
        config.data.remindDetail = data.data2show;
        config.data.remindDateTime = data.time;
        config.data.remindTableId = data.tableId;
        config.data.remindDate = data.time.substr(0,10);
        config.data.remindTime = data.time.substr(11,5);
        super(config);
    }
}

export default CalendarRemind;