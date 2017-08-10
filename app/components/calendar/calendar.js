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
        this.append(new RightContent, this.el.find('.right-content-workflow'));
        this.append(new CalendarMin, this.el.find('.main-content'));
        $(".hide-right-content").bind('click',function(){
            if($('.hide-icon').is('.ui-icon-triangle-1-e')){
                $(".right-content").css("width","20px");
                $(this).attr("title","展开");
                $(".right-content-workflow").css("visibility","hidden");
                $(".main-content").css("width", 'calc(100% - 220px)');
                $('.hide-icon').removeClass("ui-icon-triangle-1-e");
                $('.hide-icon').addClass("ui-icon-triangle-1-w");
            }
            else{
                $(".right-content").css("width","200px");
                $(this).attr("title","收起");
                $(".main-content").css("width", 'calc(100% - 400px)');
                $(".right-content-workflow").css("visibility","visible");
                $('.hide-icon').addClass("ui-icon-triangle-1-e");
                $('.hide-icon').removeClass("ui-icon-triangle-1-w");
            }
        });
    }
};

class Calendar extends Component {
    constructor() {
        super(config);
    }
}

export default Calendar;