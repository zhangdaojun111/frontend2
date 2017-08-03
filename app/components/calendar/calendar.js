/**
 * Created by zj on 2017/7/27.
 */
import Component from "../../lib/component";
import template from './calendar.html';
import './calendar.scss';
import LeftContent from './left-content/left-content';
import RightContent from './right-content/right-content';
import CalendarMin from './calendar.main/calendar.main';
import CalendarSetting from './calendar.setting/calendar.setting';
import {CalendarService} from '../../services/calendar/calendar.service';
import {PMAPI} from '../../lib/postmsg';

let config = {
    template: template,
    data: {
        title: 'calendar',
    },
    actions: {
    },
    afterRender: function() {
        this.append(new LeftContent, this.el.find('.left-content'));
        this.append(new RightContent, this.el.find('.right-content'));
        this.append(new CalendarMin, this.el.find('.main-content'));
        $('.setting').click(function () {
            //PMAPI.openDialogByComponent()
            let component = new CalendarSetting();
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
        })
    }
};

class Calendar extends Component {
    constructor() {
        super(config);
    }
}

export default Calendar;