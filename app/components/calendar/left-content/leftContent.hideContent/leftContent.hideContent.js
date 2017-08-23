/**
 * Created by lipengfei.
 * 日历隐藏表
 */
import Component from "../../../../lib/component";
import template from './leftContent.hideContent.html';
import './leftContent.hideContent.scss';
import {CalendarService} from '../../../../services/calendar/calendar.service';
import Mediator from '../../../../lib/mediator';
let config = {
    template:template,
    data:{
        show_type_ID :"",
    },
    actions:{

    },
    binds:[
        {
            event: 'click',
            selector: '.show-type-button',
            callback: function(temp = this){
                this.data.show_type_ID = $(temp).attr("id").split('-')[2];
                Mediator.emit('calendar-left:showRemindType',{data:this.data.show_type_ID});
                this.data.show_type_ID = "";
                this.destroySelf();
            }
        },
    ],
    afterRender: function() {
        this.el.css("padding","2px 10px 5px 10px");
        this.el.find("#show-type").attr("id","show-type-"+config.data.table_Id);
    },
}
class RightContentWorkFlow extends Component {
    constructor(data){
        config.data = data;
        super(config);
    }
}
export default RightContentWorkFlow;