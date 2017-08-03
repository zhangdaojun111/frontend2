/**
 * Created by zj on 2017/8/3.
 */
import Component from "../../../../lib/component";
import template from './calendar.setting.item.html';
import './calendar.setting.item/scss';

let config = {
    template: template,
    data: {
        testData: [1, 2, 3, 4, 5],
    },
    actions: {

    },
    afterRender: function() {

    }
};

class CalendarSettingItem extends Component {
    constructor() {
        super(config);
    }
}

export default CalendarSettingItem;