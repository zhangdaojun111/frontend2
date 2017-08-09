/**
 * Created by zj on 2017/8/3.
 */
import Component from "../../lib/component";
import template from './calendar.set.html';
import './calendar.set.scss';

import CalendarSetItem from './calendar.set.item/calendar.set.item';
import Mediator from '../../lib/mediator';
import {CalendarService} from '../../services/calendar/calendar.service';
import {PMAPI} from '../../lib/postmsg';

let config = {
    template: template,
    data: {

    },
    actions: {
    },
    afterRender: function() {
        this.el.css({width: '100%'});
        console.log(window.config.table_id);
        this.el.find('iframe').css("width","100%");
        let that = this;
        this.el.on("click",".editor-btn",function(){
            if(!$(this).is("disabled")){
                that.el.find(".hide-btns").css("visibility","visible");
                $(this).addClass("disabled");
                $(this).next('span').addClass("disabled");
                Mediator.emit('calendar-set:editor',{data:1});
            }
        }).on("click",".cancel-btn",function(){
            that.el.find(".hide-btns").css("visibility","hidden");
            that.el.find(".set-btn").removeClass("disabled");
            Mediator.emit('calendar-set:editor',{data:-1});
        });
        CalendarService.getCalendarTableById({table_id:window.config.table_id, isSelected: 1}).then(res => {
            console.log(res);
            res['rows'].forEach(setItem => {
                this.append(new CalendarSetItem(setItem), this.el.find('.set-items'));
            })
        });
    }
};

class CalendarSet extends Component {
    constructor() {
        super(config);
    }
}

export default CalendarSet;