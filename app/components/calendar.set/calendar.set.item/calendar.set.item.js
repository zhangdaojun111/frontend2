/**
 * Created by zj on 2017/8/4.
 */
import Component from "../../../lib/component";
import template from './calendar.set.item.html';
import './calendar.set.item.scss';
import CalendarSetItemMulitSelect from "./calendar.set.item.multiselect/calendar.set.item.multiselect"
import CalendarSetRemind from './calendar.set.remind/calendar.set.remind';

import {CalendarService} from '../../../services/calendar/calendar.service';
import {PMAPI} from '../../../lib/postmsg';
import Mediator from '../../../lib/mediator';
let config = {
    template: template,
    data: {
        isSelected: false,
        rowSetData:{},
        dropdown: [],
        dropdownForRes: [],
        replaceDropDown: [],
        dropdownForCalendarChange: [],
        isConfigField: false,
        msgEmail: false,
        msgPhone: false,
        rowTitle: [],
    },
    actions: {
        returnTitle(param){
            console.log(param,this.data.rowTitle);
            for(let a in this.data.rowTitle){
                if(param === this.data.rowTitle[a]['id']){
                    return this.data.rowTitle[a]['name'];
                }
            }
        },
        returnShow(param){
            let res = [];
            for(let a of param){
                for(let b in this.data.dropdown){
                    if(a === this.data.dropdown[b]['id']){
                        res.push(this.data.dropdown[b]['name']);
                    }
                }
            }
            return res;
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

        this.el.find('.promoting-msg').html(this.actions.returnTitle(this.data.rowSetData['field_id']));
        this.el.find('.preview').html(this.actions.returnShow(this.data.rowSetData['selectedOpts']));
        this.el.find('.isShowText').attr('checked',this.data.rowSetData['isSelected']);
        this.el.find('.isShowFirst').attr('checked',this.data.rowSetData['is_show_at_home_page']);
        this.append(new CalendarSetItemMulitSelect(this.data.dropdown), this.el.find('.multi-select-item'));
        this.append(new CalendarSetItemMulitSelect(this.data.dropdownForRes), this.el.find('.res-text'));
        this.append(new CalendarSetItemMulitSelect(this.data.dropdownForCalendarChange), this.el.find('.change-text'));
        this.el.on('click', '.editor-method', () => {
            let component = new CalendarSetRemind();
            let el = $('<div>').appendTo(document.body);
            component.render(el);
            el.dialog({
                title: '【更新时间】的提醒',
                width: '1000',
                height: '750',
                background: '#ddd',
                close: function() {
                    $(this).dialog('destroy');
                    component.destroySelf();
                }
            });
        })
    }
};

class CalendarSetItem extends Component {
    constructor(data) {
        config.data.rowSetData = data.rowData;
        config.data.dropdown = data.dropdown;
        config.data.dropdownForRes = data.dropdownForRes;
        config.data.replaceDropDown = data.replaceDropDown;
        config.data.dropdownForCalendarChange = data.dropdownForCalendarChange;
        config.data.rowTitle = data.rowTitle;
        config.data.isConfigField = data.isConfigField;
        config.data.msgEmail = data.rowData['email']['email_status'] === 1? true : false;
        config.data.msgPhone = data.rowData['sms']['sms_status'] === 1? true : false;
        super(config);
    }
}

export default CalendarSetItem;