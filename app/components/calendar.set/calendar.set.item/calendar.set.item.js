/**
 * Created by zj on 2017/8/4.
 */
import Component from "../../../lib/component";
import template from './calendar.set.item.html';
import './calendar.set.item.scss';

import {CalendarService} from '../../../services/calendar/calendar.service';
import {PMAPI} from '../../../lib/postmsg';

let config = {
    template: template,
    data: {
        rowSetData:{},
        //首页可修改字段
        dropdownForCalendarChange: [],
        dropdownForRes: [1,2,3],
    },
    actions: {
    },
    afterRender: function() {
        console.log(this.data.rowSetData);
        console.log(this.data.rowSetData.color);
        $("#set-color-id").attr("id","set-color-"+this.data.rowSetData.field_id);
        let set_color_id = "#set-color-"+this.data.rowSetData.field_id;
        $(set_color_id).attr("value",this.data.rowSetData.color);
        this.data.dropdownForRes.forEach(item => {
            this.el.find('.res-text').append("<option value='"+item+"'>"+item+"</option>");
        });
        console.log($(set_color_id).val());
        let Isshow = false;
        $(".head-select").bind("click",function(){
            event.stopPropagation();
            console.log($(this).next().is(":hidden"));
            if(!$(this).next().is(":hidden")){
                $(this).next().hide();
                Isshow = false;
            }
            else{
                $(".select-multi-content").hide();
                $(this).next().show();
                console.log($(this));
                Isshow = true;
            }
        });
        $(document).click(function(){
            $(".select-multi-content").hide();
                Isshow = false;
        })
        $(".select-multi-content").bind("click",function(){
            event.stopPropagation();
        });
    }
};

class CalendarSetItem extends Component {
    constructor(data) {
        config.data.rowSetData = data;
        super(config);
    }
}

export default CalendarSetItem;