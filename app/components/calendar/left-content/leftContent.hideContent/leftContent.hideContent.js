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
    template:template,
    data:{},
    actions:{
    },
    binds:[
        {
            event: 'click',
            selector: '.show-type-button',
            callback: function(temp = this){
                Mediator.emit('calendar-left:showRemindType',{data:this.data.table_Id});
                this.destroySelf();
            }
        },
    ],
    afterRender: function() {
        this.el.css("padding","2px 10px 5px 10px");
    },
}
class RightContentWorkFlow extends Component {
    constructor(data){
        config.data = data;
        super(config);
    }
}
export default RightContentWorkFlow;