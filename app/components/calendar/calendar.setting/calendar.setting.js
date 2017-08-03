/**
 * Created by zj on 2017/8/2.
 */
import Component from "../../../lib/component";
import template from './calendar.setting.html';
import './calendar.setting.scss';

import CalendarSettingItem from './calendar.setting.item/calendar.setting.item';

//import {MenuData} from '../testData/get_menu_data';
import {CalendarService} from '../../../services/calendar/calendar.service';

let config = {
    template: template,
    data: {
        menu: []
    },
    actions: {
        dosomething: function (data) {
            console.log(data);
        }
    },
    afterRender: function() {
        this.data.menu = CalendarService.getMenu();
        this.data.menu.forEach(item => {
            this.append(new CalendarSettingItem(item), this.el.find('.setting-content'));
        });
        $('.item-child').bind('click', function () {
            console.log($(this).attr("id"),$(this).html());
        });

    }
};

class CalendarSetting extends Component {
    constructor() {
        super(config);
    }
}

export default CalendarSetting;