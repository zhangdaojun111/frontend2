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
        dropdown: [],
        dropdownForRes: [],
        replaceDropDown: [],
        dropdownForCalendarChange: [],
        rowTitle: [],
    },
    actions: {
        returnTitle(param){
            for(let a in this.data.rowTitle){
                if(param === this.data.rowTitle[a]['id']){
                    return this.data.rowTitle[a]['name'];
                }
            }
        }

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

        $('.promoting-msg').html(this.actions.returnTitle(this.data.rowSetData['field_id']));

        this.append(new CalendarSetItemMulitSelect(this.data.dropdown), this.el.find('.multi-select-item'));
        this.append(new CalendarSetItemMulitSelect(this.data.dropdownForRes), this.el.find('.res-text'));
        this.append(new CalendarSetItemMulitSelect(this.data.dropdownForCalendarChange), this.el.find('.change-text'));
        console.log(this.data.rowTitle,this.data.rowSetData);

    }
};

class CalendarSetItem extends Component {
    constructor(data) {
        config.data.rowSetData = data.rowData;
        config.data.dropdown = data.dropdown;
        config.data.dropdownForRes = data.dropdownForRes;
        config.data.replaceDropDown = data.replaceDropDown;
        config.data.dropdownForCalendarChange = data.dropdownForCalendarChange;
        //config.data.rowTitle = data.rowTitle;
        super(config);
    }
}

export default CalendarSetItem;