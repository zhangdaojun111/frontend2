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
import CalendarSetRemindMethod from './calendar.set.remind/calendar.set.remind';

let config = {
    template: template,
    data: {
        rowSetData: {},
        rowTitle: '',
        dropdown: [],
        dropdownForRes: [],
        dropdownForCalendarChange: [],
        replaceDropDown: [],

        isConfigField: false,
        selectedOpts: [],
        initAllRows: [],

        //收信人
        recipients: [],
        recipients_per: [],

        //抄送人
        copypeople: [],

        //发信箱数据
        emailAddressList: [],

        //默认选择的
        emailAddress: '',
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
        this.el.on('click', '.set-show-text-input', () => {
            let setShowText = this.el.find('.set-show-text-input').is(':checked');
            this.data.rowSetData['isSelected'] = setShowText;
            //this.data.allRows[this.data.index]['isSelected'] = setShowText;
        }).on('click', '.set-calendar-page-show-text', () => {
            let isShowHomePage = this.el.find('.set-calendar-page-show-text').is(':checked');
            this.data.rowSetData['is_show_at_home_page'] = isShowHomePage;
            //this.data.allRows[this.data.index]['is_show_at_home_page'] = isShowHomePage;
        }).on('change', '.set-color', () => {
            let setColor = this.el.find('.set-color').val();
            console.log(setColor);
            this.data.rowSetData['color'] = setColor;
            //this.data.allRows[this.data.index]['color'] = setColor;
        }).on('change', '.add-show-text', () => {
            let addShowText = this.el.find('.add-show-text option:selected').val();
            this.data.rowSetData['selectedOpts'] = addShowText;
            //this.data.allRows[this.data.index]['selectedOpts'].push(addShowText);
        }).on('change', '.res-text', () => {
            let valueForRes = this.el.find('.res-text option:selected').val();
            this.data.rowSetData['selectedRepresents'] = valueForRes;
            //this.data.allRows[this.data.index]['selectedRepresents'] = valueForRes;
        }).on('change', '.page-change-text', () => {
            let valueForCalendarChange = this.el.find('.page-change-text option:selected').val();
            this.data.rowSetData['selectedEnums'] = valueForCalendarChange;
            //this.data.allRows[this.data.index]['selectedEnums'] = valueForCalendarChange;
        }).on('click', '.set-remind-method', () => {
            // CalendarSetRemindMethod.emailStatus = this.data.rowSetData.email.email_status;
            // CalendarSetRemindMethod.smsStatus = this.data.rowSetData.sms.sms_status;
            // CalendarSetRemindMethod.data.emailAddressList = this.data.emailAddressList;
            // CalendarSetRemindMethod.data.recipients = this.data.recipients;
            // CalendarSetRemindMethod.data.copypeople = this.data.copypeople;
            // CalendarSetRemindMethod.data.recipients_per = this.data.recipients_per;
            // PMAPI.openDialogByComponent(CalendarSetRemindMethod, {
            //     width: 800,
            //     height: 400,
            //     title: '【'+ this.data.rowTitle.name + '】'+'的提醒'
            // }).then(res => {
            //     console.log(res);
            // })
            let component = new CalendarSetRemindMethod({
                emailStatus: this.data.rowSetData.email.email_status,
                smsStatus: this.data.rowSetData.sms.sms_status,
                recipients: this.data.recipients,
                recipients_per: this.data.recipients_per,
                copypeople: this.data.copypeople,
                emailAddressList: this.data.emailAddressList,
                emailAddress: this.data.emailAddress,
            });
            let el = $('<div>').appendTo(document.body);
            component.render(el);
            el.dialog({
                title: '主框架弹出',
                width: 800,
                height: 500,
                close: function() {
                    $(this).dialog('destroy');
                    component.destroySelf();
                }
            });
        });

        $("#set-color-id").attr("id","set-color-"+this.data.rowSetData.field_id);
        let set_color_id = "#set-color-"+this.data.rowSetData.field_id;
        $(set_color_id).attr("value",this.data.rowSetData.color);
        //this.append(new CalendarSetItemMulitSelect(this.data.dropdown), this.el.find('.multi-select-item'));
    }
};

class CalendarSetItem extends Component {
    constructor(data) {
        config.data.rowSetData = data.rowData;
        config.data.dropdown = data.dropdown;
        config.data.dropdownForRes = data.dropdownForRes;
        config.data.dropdownForCalendarChange = data.dropdownForCalendarChange;
        config.data.rowTitle = data.rowTitle;
        config.data.replaceDropDown = data.replaceDropDown;

        config.data.recipients = data.recipients;
        config.data.recipients_per = data.recipients_per;
        config.data.copypeople = data.copypeople;
        config.data.emailAddressList = data.emailAddressList;
        config.data.emailAddress = data.emailAddress;

        super(config);
    }
}

export default CalendarSetItem;