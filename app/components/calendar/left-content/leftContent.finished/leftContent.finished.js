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
            }
        }
    ],
    afterRender: function() {
        console.log(this.data);
    },
}
class leftContentFinished extends Component {
    constructor(data){
        config.data= data;
        super(config);
    }
}
export default leftContentFinished;