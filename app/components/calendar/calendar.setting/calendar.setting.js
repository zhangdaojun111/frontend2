/**
 * Created by zj on 2017/8/2.
 */
import Component from "../../../lib/component";
import template from './calendar.setting.html';
import './calendar.setting.scss';

import CalendarSettingItem from './calendar.setting.item/calendar.setting.item';

import {CalendarService} from '../../../services/calendar/calendar.service';

let config = {
    template: template,
    data: {
        menu: []
    },
    actions: {

    },
    afterRender: function() {
        CalendarService.getMenu().then(res => {
            console.log(res);
            res['menuList'].forEach(item => {
                this.append(new CalendarSettingItem(item), this.el.find('.setting-content'));
            });
        });
    }
};

class CalendarSetting extends Component {
    constructor() {
        super(config);
    }
}

export default CalendarSetting;