/**
 * Created by zj on 2017/8/2.
 */
import Component from "../../../lib/component";
import template from './calendar.setting.html';
import './calendar.setting.scss';

import CalendarSettingItem from './calendar.setting.item/calendar.setting.item';
import CalendarSet from '../../calendar.set/calendar.set';

//import {MenuData} from '../testData/get_menu_data';
import {CalendarService} from '../../../services/calendar/calendar.service';
import {PMAPI} from '../../../lib/postmsg';

let config = {
    template: template,
    data: {
        menu: []
    },
    actions: {

    },
    afterRender: function() {
        this.data.menu = CalendarService.getMenu();
        this.data.menu.forEach(item => {
            this.append(new CalendarSettingItem(item), this.el.find('.setting-content'));
        });
        $('.item-child').bind('click', function () {
            console.log($(this).attr("id"),$(this).html());

            let component = new CalendarSet();
            let el = $('<div>').appendTo(document.body);
            component.render(el);
            el.dialog({
                title: '日历设置',
                width: '99%',
                height: '950',
                background: '#ddd',
                close: function() {
                    $(this).dialog('destroy');
                    component.destroySelf();
                }
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