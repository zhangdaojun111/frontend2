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
import CalendarSetItemremindtype from "./calendar.set.item.remindtype/calendar.set.item.remindtype"
let config = {
    template: template,
    data: {
        rowSetData: {},
        rowTitle: '',
        dropdown: [],
        dropdownForRes: [],
        dropdownForCalendarChange: [],

        isConfigField: false,
        selectedOpts: [],
        allRows: [],
        initAllRows: [],
    },
    actions: {
    },
    afterRender: function() {
        // this.el.css({width: '100%'});
        let staus = false;
        Mediator.on('calendar-set:editor',data =>{
            if(data.data ===1){
                this.el.find(".editor-items").attr("disabled",false);
                staus = true;
            }else{
                this.el.find(".editor-items").attr("disabled",true);
                staus = false;
            }
        });
        this.el.on("click",".remind-type-editor",function(){
            if(staus){
                let component = new CalendarSetItemremindtype();
                let el = $('<div>').appendTo(document.body);
                component.render(el);
                el.dialog({
                    title: '编辑提醒方式',
                    width: '80%',
                    height: '600',
                    background: '#ddd',
                    close: function() {
                        $(this).dialog('destroy');
                        component.destroySelf();
                    }
                });
                }
        }).on('change', '.res-text', () => {
            let valueForRes = $('.res-text option:selected').text();

        }).on('change', '.page-change-text', () => {
            let valueForCalendarChange = $('.page-change-text option:selected').text();
        });
        $("#set-color-id").attr("id","set-color-"+this.data.rowSetData.field_id);
        let set_color_id = "#set-color-"+this.data.rowSetData.field_id;
        $(set_color_id).attr("value",this.data.rowSetData.color);

        console.log(config.data.dropdownForRes);
        //this.append(new CalendarSetItemMulitSelect(this.data.dropdown), this.el.find('.multi-select-item'));

    }
};

class CalendarSetItem extends Component {
    constructor(data) {
        // rowData: row;
        // dropdown: this.data.dropdown;
        // dropdownForRes: this.data.dropdownForRes;
        // dropdownForCalendarChange: this.data.dropdownForCalendarChange;
        // replaceDropDown: this.data.replaceDropDown;
        // isConfigField: this.data.isConfigField,
        // rowTitle: this.data.rowTitle,
        config.data.rowSetData = data.rowData;
        config.data.dropdown = data.dropdown;
        config.data.dropdownForRes = data.dropdownForRes;
        config.data.dropdownForCalendarChange = data.dropdownForCalendarChange;
        config.data.rowTitle = data.rowTitle;
        super(config);
    }
}

export default CalendarSetItem;