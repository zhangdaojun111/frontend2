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

        forResPreviewText: '',

        newSelectedOpts: [],

        multiSelectMenu: {},
        editable:false,

    },
    actions: {
        returnShow: function (param) {
            let res = [];
            let text = [];
            for(let a of param){
                for(let b in this.data.dropdown){
                    if(a === this.data.dropdown[b]['id']){
                        res.push(this.data.dropdown[b]);
                        text.push(this.data.dropdown[b]['name']);
                    }
                }
            }
            return {res: res, text: text};
        },

        getSelectedValue: function () {
            //return this.data.multiSelectMenu.data.choosed;
        },

        checkForResSelected: function (forResText, forResId) {
            let selectedOpts = this.data.multiSelectMenu.data.choosed;
            let isInSelectedOpts = false;
            for(let item of selectedOpts) {
                if(forResId === item['id']) {
                    isInSelectedOpts = true;
                }
            }
            if(!isInSelectedOpts) {
                selectedOpts.push({id: forResId, name: forResText});
                this.data.multiSelectMenu.actions.setChoosed(selectedOpts);
                this.actions.checkSelectedOpts(selectedOpts);
            }

        },

        checkSelectedOpts: function (newSelectedOpts) {
            let selectedOptsId = [];
            let selectedOptsText  = [];
            for(let newItem of newSelectedOpts) {
                selectedOptsText.push(newItem['name']);
                selectedOptsId.push(newItem['id']);
            }
            this.data.preViewText = selectedOptsText;
            this.el.find('.preview-text').html(this.data.preViewText);
        },

        openSetRemind: function () {
            PMAPI.openDialogByIframe(
                '/iframe/calendarSetRemind/',
                {
                    width: "800",
                    height: '800',
                    title: '【'+ this.data.rowTitle.name + '】'+'的提醒'
                },{
                    emailStatus: this.data.rowSetData.email.email_status,
                    smsStatus: this.data.rowSetData.sms.sms_status,
                    sms: this.data.rowSetData.sms,
                    email: this.data.rowSetData.email,
                    recipients: this.data.recipients,
                    recipients_per: this.data.recipients_per,
                    copypeople: this.data.copypeople,
                    emailAddressList: this.data.emailAddressList,
                    emailAddress: this.data.emailAddress,
                }).then(data => {
                if(!data.onlyclose) {
                    console.log(data);
                    this.data.rowSetData.email = data['email'];
                    this.data.rowSetData.sms = data['sms'];
                    let showMethod = '';
                    if(data['sms']['sms_status'] === '1') {
                        showMethod = '短信';
                        this.el.find('.set-remind-method').html(showMethod);
                    }
                    if (data['email']['email_status'] === '1') {
                        showMethod = showMethod + ' ' + '邮件';
                        this.el.find('.set-remind-method').html(showMethod);
                    }
                    if(data['sms']['sms_status'] === 0 && data['email']['email_status'] === 0) {
                        showMethod = '设置提醒方式';
                        this.el.find('.set-remind-method').html(showMethod);
                    }
                }

            });
        },
    },
    afterRender: function () {
        // this.el.css({width: '100%'});
        let staus = false;
        let _this = this;
        let select_item_data = {
            'list': this.data.dropdown,
            editable:this.data.editable,
            choosed: this.actions.returnShow(this.data.rowSetData['selectedOpts']).res,
            onSelect: function (choosed) {
                let choosedList = [];
                for(let choosedItem of choosed) {
                    choosedList.push(choosedItem['id']);
                }
                _this.data.rowSetData['selectedOpts'] = choosedList;
                _this.actions.checkSelectedOpts(choosed);
            },
        };
        this.data.multiSelectMenu = new AutoSelect(select_item_data);
        this.append(this.data.multiSelectMenu, this.el.find('.multi-select-item'));
        Mediator.on('calendar-set:editor', data => {
            if (data.data === 1) {
                this.el.find(".editor-items").attr("disabled", false);
                _this.data.multiSelectMenu.destroySelf();
                select_item_data.editable = true;
                _this.data.multiSelectMenu = new AutoSelect(select_item_data);
                _this.append(_this.data.multiSelectMenu, _this.el.find('.multi-select-item'));
                _this.el.find('td').removeClass('unclick');
                staus = true;
            } else {
                this.el.find(".editor-items").attr("disabled", true);
                _this.data.multiSelectMenu.destroySelf();
                select_item_data.editable = false;
                _this.data.multiSelectMenu = new AutoSelect(select_item_data);
                _this.append(_this.data.multiSelectMenu, _this.el.find('.multi-select-item'));
                _this.el.find("td").addClass('unclick');
                staus = false;
            }
        });
        this.el.find('.res-text option').each((item) => {
            let a = $('.res-text option')[item].value;
            if(a === this.data.rowSetData['selectedRepresents']) {
                this.el.find('.res-text option')[item].selected  = 'selected';
            }
        });
        if(!this.data.rowSetData['email']['email_status'] && !this.data.rowSetData['sms']['sms_status']) {
            this.el.find('.set-remind-method').html('设置提醒方式');
        }

        if(staus){
            _this.el.find(".set-remind-method").removeClass('unclick');
            _this.el.find('input').removeClass('unclick');
        }
        else{
            _this.el.find(".set-remind-method").addClass('unclick');
            _this.el.find('input').addClass('unclick');
        }
        this.el.on('click', '.set-show-text-input', () => {

            let isSetShowText = this.el.find('.set-show-text-input').is(':checked');
            this.data.rowSetData['isSelected'] = isSetShowText;

        }).on('click', '.set-calendar-page-show-text', () => {

            let isShowHomePage = this.el.find('.set-calendar-page-show-text').is(':checked');
            this.data.rowSetData['is_show_at_home_page'] = isShowHomePage;

        }).on('change', '.set-color', () => {

            let setColor = this.el.find('.set-color').val();
            this.data.rowSetData['color'] = setColor;

        }).on('change', '.res-text', () => {
            let textForResValue = this.el.find('.res-text option:selected').val();
            let textForResText = this.el.find('.res-text option:selected').text();
            this.actions.checkForResSelected(textForResText, textForResValue);
            this.data.rowSetData['selectedRepresents'] = textForResValue;
        }).on('change', '.page-change-text', () => {
            let valueForCalendarChangeValue = this.el.find('.page-change-text option:selected').val();
            let textForCalendarChangeValue = this.el.find('.page-change-text option:selected').text();

            this.data.rowSetData['selectedEnums'] = valueForCalendarChangeValue;
        }).on('click', '.set-remind-method', () => {
            if(staus){
                this.actions.openSetRemind();
            }
        }).on('change', '.config-text', () => {
            let valueConfigTextValue = this.el.find('.config-text option:selected').val();
            let textConfigTextValue = this.el.find('.config-text option:selected').text();

        });
        if(this.data.rowTitle['dtype'] === 8) {
            console.log(this.data.rowSetData, this.data.replaceDropDown, this.data.rowTitle);
        }

        this.data.preViewText = this.actions.returnShow(this.data.rowSetData['selectedOpts']).text;
        this.el.find('.preview-text').text(this.data.preViewText);

        $("#set-color-id").attr("id", "set-color-" + this.data.rowSetData.field_id);
        let set_color_id = "#set-color-" + this.data.rowSetData.field_id;
        $(set_color_id).attr("value", this.data.rowSetData.color);
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