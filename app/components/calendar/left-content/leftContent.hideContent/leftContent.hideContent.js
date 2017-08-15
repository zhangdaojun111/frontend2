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
    afterRender: function() {
        this.el.css("padding","2px 10px 5px 10px");
        this.el.find("#show-type").attr("id","show-type-"+config.data.table_Id);
        this.el.find(".show-type-button").on('click',function () {
            $(this).parent().parent("div").remove();
            config.data.show_type_ID = $(this).attr("id").split('-')[2];
            Mediator.emit('calendar-left:showRemindType',{data:config.data.show_type_ID});
            config.data.show_type_ID = "";
        });
    },
}
class RightContentWorkFlow extends Component {
    constructor(data){
        config.data = data;
        super(config);
    }
}
export default RightContentWorkFlow;