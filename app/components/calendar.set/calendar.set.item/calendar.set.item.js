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
import {AutoSelect} from '../../util/autoSelect/autoSelect';
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

        preViewText: [],
    },
    actions: {
        returnShow: function(param){
            let res = [];
            for(let a of param){
                for(let b in this.data.dropdown){
                    if(a === this.data.dropdown[b]['id']){
                        res.push(this.data.dropdown[b]['name']);
                    }
                }
            }
            return res;
        },

    },
    afterRender: function() {
        // this.el.css({width: '100%'});
        let staus = false;
        let select_item_data = {'list':this.data.dropdownForRes};
        let multi_select_item = new AutoSelect(select_item_data);
        this.append(multi_select_item, this.el.find('.multi-select-item'));
        this.el.find(".popup").css('z-index',100,'background-color',"white");
        this.el.find(".popup").css('background-color',"white");
        this.el.find(".popup").css('height',"auto");
        this.el.find(".popup").css('max-height',"300px");
        this.el.find(".popup").children('li').children('label').css('text-align',"left");
        this.el.find(".popup").children('li').children('label').css('overflow',"hidden");
        Mediator.on('calendar-set:editor',data =>{
            if(data.data ===1){
                this.el.find(".editor-items").attr("disabled",false);
                staus = true;
            }else{
                this.el.find(".editor-items").attr("disabled",true);
                staus = false;
            }
        });
        let temp = this.el.find(".popup").children('li');
        this.el.on("click",temp,function(){
            console.log(multi_select_item.data.choosed);
        }).on('click', '.set-show-text-input', () => {
            let isSetShowText = this.el.find('.set-show-text-input').is(':checked');
            console.log(isSetShowText);
            this.data.rowSetData['isSelected'] = isSetShowText;
        }).on('click', '.set-calendar-page-show-text', () => {
            let isShowHomePage = this.el.find('.set-calendar-page-show-text').is(':checked');
            this.data.rowSetData['is_show_at_home_page'] = isShowHomePage;
        }).on('change', '.set-color', () => {
            let setColor = this.el.find('.set-color').val();
            this.data.rowSetData['color'] = setColor;
        }).on('change', '.add-show-text', () => {
            let addShowTextValue = this.el.find('.add-show-text option:selected').val();
            let addShowText = this.el.find('.add-show-text option:selected').text();
            //this.data.preViewText.push(addShowText);
            this.el.find('.preview-text').text(this.data.preViewText);
            this.data.rowSetData['selectedOpts'].push(addShowTextValue);
        }).on('change', '.res-text', () => {
            let valueForResValue = this.el.find('.res-text option:selected').val();
            for( let a of this.data.preViewText ){
                if( valueForResValue.indexOf( a ) === -1 ){
                    this.data.preViewText.push(valueForResValue);

                }
            }
            this.data.rowSetData['selectedRepresents'] = valueForResValue;
        }).on('change', '.page-change-text', () => {
            let valueForCalendarChangeValue = this.el.find('.page-change-text option:selected').val();
            this.data.rowSetData['selectedEnums'] = valueForCalendarChangeValue;
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
            // });
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

        this.data.preViewText = this.actions.returnShow(this.data.rowSetData['selectedOpts']);
        this.el.find('.preview-text').text(this.data.preViewText);

        $("#set-color-id").attr("id","set-color-"+this.data.rowSetData.field_id);
        let set_color_id = "#set-color-"+this.data.rowSetData.field_id;
        $(set_color_id).attr("value",this.data.rowSetData.color);
    },
    beforeDestory: function () {
        Mediator.removeAll('calendar-set:editor');
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