import Component from "../../../../lib/component";
import template from './leftContent.hideContent.html';
import './leftContent.hideContent.scss';
import {CalendarService} from '../../../../services/calendar/calendar.service';
let config = {
    template:template,
    data:{
        show_type_ID :"",
    },
    actions:{

    },
    afterRender: function() {
        this.el.css("padding","2px 10px 5px 10px");
        $("#show-type").attr("id","show-type-"+config.data.table_Id);
        $(".show-type-button").bind('click',function () {
            $(this).parent().parent("div").remove();
            config.data.show_type_ID = $(this).attr("id").split('-')[2];
            CalendarService.CalendarMsgMediator.publish('showRemindType',{data:config.data.show_type_ID});
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