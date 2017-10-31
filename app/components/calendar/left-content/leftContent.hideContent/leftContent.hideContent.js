/**
 * Created by lipengfei.
 * 日历隐藏提醒
 */
import Component from "../../../../lib/component";
import template from './leftContent.hideContent.html';
import './leftContent.hideContent.scss';
import {CalendarService} from '../../../../services/calendar/calendar.service';
import Mediator from '../../../../lib/mediator';

let config = {
    template: template,
    data: {},
    actions: {},
    binds: [
        /**
         * 显示提醒
         */
        {
            event: 'click',
            selector: '.show-type-button',
            callback: function () {
                Mediator.emit('calendar-left:showRemindType', {data: this.data.table_Id});
                this.destroySelf();
            }
        },
    ],
    afterRender: function () {
    },
}

class RightContentWorkFlow extends Component {
    constructor(data,newConfig) {
        config.data = data;
        super(config,$.extend(true,{},config,newConfig));
    }
}

export default RightContentWorkFlow;