/**
 * Created by zj on 2017/8/4.
 */
import Component from "../../../lib/component";
import template from './calendar.set.item.html';
import './calendar.set.item.scss';
import CalendarSetItemMulitSelect from "./calendar.set.item.multiselect/calendar.set.item.multiselect"
import {CalendarService} from '../../../services/calendar/calendar.service';
import {PMAPI} from '../../../lib/postmsg';
import Mediator from '../../../lib/mediator';
let config = {
    template: template,
    data: {
        rowSetData:{},
        //首页可修改字段
        dropdownForCalendarChange: [],
        dropdownForRes: [],
    },
    actions: {
    },
    afterRender: function() {
        Mediator.on('calendar-set:editor',data =>{
            if(data.data ===1){
                this.el.find(".editor-items").attr("disabled",false);
            }else{
                this.el.find(".editor-items").attr("disabled",true);
            }
        });
        $("#set-color-id").attr("id","set-color-"+this.data.rowSetData.field_id);
        let set_color_id = "#set-color-"+this.data.rowSetData.field_id;
        $(set_color_id).attr("value",this.data.rowSetData.color);
        this.data.dropdownForRes.forEach(item => {
            this.el.find('.res-text').append("<option value='"+item+"'>"+item+"</option>");
        });

        this.append(new CalendarSetItemMulitSelect, this.el.find('.multi-select-item'));
        // console.log($(set_color_id).val());
    }
};

class CalendarSetItem extends Component {
    constructor(data) {
        config.data.rowSetData = data;
        super(config);
    }
}

export default CalendarSetItem;