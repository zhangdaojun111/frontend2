/**
 * Created by zj on 2017/8/10.
 */
import Component from "../../../../lib/component";
import template from './calendar.set.remind.html';
import './calendar.set.remind.scss';
import CalendarSetItemMulitSelect from '../calendar.set.item.multiselect/calendar.set.item.multiselect';
import {CalendarService} from '../../../../services/calendar/calendar.service';
import {AutoSelect} from '../../../util/autoSelect/autoSelect';
import {PMAPI, PMENUM} from '../../../../lib/postmsg';
import MSG from '../../../../lib/msgbox';

let config = {
    template: template,
    data: {
        emailStatus: 0,
        smsStatus: 0,
        emailAddressList: [],
        recipients: [],
        recipients_per: [],
        copypeople: [],

        smsReciver: [],
        emailReciver: [],

        smsCopyPeople: [],
        emailCopyPeople: [],

        smsRemindTime: '',
        emailRemindTime: '',

        sms:{},
        email: {},

        smsReceiverAutoSelect: {},
        smsCopyPeopleAutoSelect: {},

        emailAutoSelect: {},
        emailReceiverAutoSelect: {},
        emailCopyPeopleAutoSelect: {},

        sendEmailAddressId: ''
    },

    actions: {
        checkRemindStatus:function () {
            console.log(this.data.smsStatus, this.data.emailStatus);
            if( ( this.data.smsStatus === '1' && this.data.smsReciver.length === 0 ) || ( this.data.emailStatus === '1' && this.data.emailReciver.length === 0 ) ){
                console.log('error');
                MSG.alert( "已开启提醒的收件人不能为空" );
                return;
            }
            if( ( this.data.smsStatus === '1' && this.data.smsRemindTime.length === 0 ) || ( this.data.emailStatus === '1' && this.data.emailRemindTime.length === 0 ) ){
                MSG.alert( "已开启提醒的提醒时间不能为空" );
                return;
            }
            if(this.data.smsStatus === 0) {
                this.data.sms = {
                    cc_receiver: [],
                    receiver: [],
                    remind_time: [],
                    sms_status: this.data.smsStatus,
                };
            } else {
                this.data.sms = {
                    cc_receiver: this.data.smsCopyPeople,
                    receiver: this.data.smsReciver,
                    remind_time: this.data.smsRemindTime,
                    sms_status: this.data.smsStatus,
                };
            }
            if(this.data.emailStatus === 0) {
                this.data.email = {
                    email_id: '',
                    cc_receiver: [],
                    receiver: [],
                    email_status: this.data.emailStatus,
                    remind_time: '',
                };
            } else {
                this.data.email = {
                    email_id: this.data.sendEmailAddressId,
                    cc_receiver: this.data.emailCopyPeople,
                    receiver: this.data.emailReciver,
                    email_status: this.data.emailStatus,
                    remind_time: this.data.emailRemindTime,
                };
            }
            PMAPI.sendToParent({
                type: PMENUM.close_dialog,
                key: window.config.key,
                data: {sms: this.data.sms, email: this.data.email},
            });
        }
    },

    afterRender: function() {

        PMAPI.subscribe(PMENUM.open_iframe_params, params => {
            this.data.emailStatus = params.data.emailStatus;
            this.data.smsStatus = params.data.smsStatus;
            this.data.emailAddressList = params.data.emailAddressList;
            this.data.recipients = params.data.recipients;
            this.data.copypeople = params.data.copypeople;
            this.data.recipients_per = params.data.recipients_per;
            this.data.sms = params.data.sms;
            this.data.email = params.data.email;

            if (this.data.smsStatus === '1') {
                this.el.find('.open-sms-remind').addClass('checked');
            } else {
                this.el.find('.close-sms-remind').addClass('checked');
            }
            if (this.data.emailStatus === '1') {
                this.el.find('.open-email-remind').addClass('checked');
            } else {
                this.el.find('.close-email-remind').addClass('checked');
            }

            // 短信收件人
            this.data.smsReceiverAutoSelect = new AutoSelect({
                list: this.data.recipients_per,
                choosed: this.data.sms.receiver,
            });
            this.append(this.data.smsReceiverAutoSelect, this.el.find('.remind-receiver-sms'));

            // 短信抄送人
            this.data.smsCopyPeopleAutoSelect = new AutoSelect({
                list: this.data.copypeople,
                choosed: this.data.sms.cc_receiver,
            });
            this.append(this.data.smsCopyPeopleAutoSelect, this.el.find('.remind-copy-for-sms'));

            // 发件箱
            this.data.emailAddressList.forEach(item => {
                this.el.find('#send-email-address').append('<option value="'+ item.id +'">'+ item.name +'</option>');
            });

            // 邮件收件人
            this.data.emailReceiverAutoSelect = new AutoSelect({
                list: this.data.recipients,
                choosed: this.data.email.receiver,
            });
            this.append(this.data.emailReceiverAutoSelect, this.el.find('.remind-receiver-email'));

            // 邮件抄送人
            this.data.emailCopyPeopleAutoSelect = new AutoSelect({
                list: this.data.copypeople,
                choosed: this.data.email.cc_receiver,
            });
            this.append(this.data.emailCopyPeopleAutoSelect, this.el.find('.remind-copy-for-email'));

            this.el.find('.remind-time-sms').val(this.data.sms.remind_time);
            this.el.find('.remind-time-email').val(this.data.email.remind_time);
        });

        let _this = this;
        // Mediator.emit('calendar-set:editor',1);
        this.el.on('click', '.sms-remind', () => {
            _this.el.find('.sms-remind').addClass("unchecked");
            _this.el.find(".email-remind").removeClass("unchecked");
            _this.el.find(".sms").show();
            _this.el.find(".email").hide();
        }).on('click', '.email-remind', () => {
            _this.el.find('.email-remind').addClass("unchecked");
            _this.el.find(".sms-remind").removeClass("unchecked");
            _this.el.find(".email").show();
            _this.el.find(".sms").hide();
        }).on('click', '.open-sms-remind', () => {
            _this.el.find('.open-sms-remind').addClass("checked");
            _this.el.find(".close-sms-remind").removeClass("checked");
            _this.data.smsStatus = '1';
        }).on('click', '.close-sms-remind', () => {
            _this.el.find('.close-sms-remind').addClass("checked");
            _this.el.find(".open-sms-remind").removeClass("checked");
            _this.data.smsStatus = 0;
        }).on('click', '.open-email-remind', () => {
            _this.el.find('.open-email-remind').addClass("checked");
            _this.el.find(".close-email-remind").removeClass("checked");
            _this.data.emailStatus = '1';
        }).on('click', '.close-email-remind', () => {
            _this.el.find('.close-email-remind').addClass("checked");
            _this.el.find(".open-email-remind").removeClass("checked");
            _this.data.emailStatus = 0;
        }).on('change', '#send-email-address', () => {
            _this.data.emailAddressList = [];
            let sendEmailAddressValue = this.el.find('#send-email-address option:selected').text();
            _this.data.sendEmailAddressId = this.el.find('#send-email-address option:selected').val();
            _this.data.emailAddressList.push({id: this.data.sendEmailAddressId, name: sendEmailAddressValue});
        }).on('click', '.set-ok', () => {
            _this.data.smsRemindTime = this.el.find('.remind-time-sms').val();
            _this.data.emailRemindTime = this.el.find('.remind-time-email').val();

            _this.data.smsReciver = this.data.smsReceiverAutoSelect.data.choosed;
            _this.data.smsCopyPeople = this.data.smsCopyPeopleAutoSelect.data.choosed;

            _this.data.emailReciver = this.data.emailReceiverAutoSelect.data.choosed;
            _this.data.emailCopyPeople = this.data.emailCopyPeopleAutoSelect.data.choosed;
            _this.actions.checkRemindStatus();
        })
    }
};

class CalendarSetRemindMethod extends Component {
    constructor() {
        super(config);
    }
}

export default CalendarSetRemindMethod;