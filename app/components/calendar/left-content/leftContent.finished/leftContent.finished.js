/**
 * Created by lipengfei.
 * 已完成内容
 */
import Component from "../../../../lib/component";
import template from './leftContent.finished.html';
import './leftContent.finished.scss'
import {CalendarService} from '../../../../services/calendar/calendar.service';
import Mediator from '../../../../lib/mediator';
let config = {
    template:template,
    data:{
    },
    actions:{
    },
    events:{
        // onChange:function(){},
    },
    binds:[
        {
            event: 'click',
            selector: '.has-finished',
            callback: function () {
                // this.callback();
                console.log(11);
                this.trigger('onChange', {type: 'clearAll', value: [1,1,1]});
            }
        }
    ],
    afterRender: function() {
        this.el.css("padding","2px 10px 5px 10px");
    },
}
class leftContentFinished extends Component {
    constructor(data, events){
        super(config, data, events);
    }
}
export default leftContentFinished;