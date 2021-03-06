/**
 * Created by zj on 2017/8/10.
 */
import Component from "../../../../lib/component";
import template from './calendar.set.remind.html';
import './calendar.set.remind.scss';
import {AutoSelect} from '../../../util/autoSelect/autoSelect';
import {PMAPI, PMENUM} from '../../../../lib/postmsg';
import MSG from '../../../../lib/msgbox';
import '../../../../assets/scss/calendar/icon-calendar.scss';

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
        /**
         * 保存提醒设置
         */
        checkRemindStatus:function () {
            if( ( this.data.smsStatus === 1 && this.data.smsReciver.length === 0 ) || ( this.data.emailStatus === 1 && this.data.emailReciver.length === 0 ) ){
                MSG.alert( "已开启提醒的收件人不能为空" );
                return;
            }
            if( ( this.data.smsStatus === 1 && this.data.smsRemindTime.length === 0 ) || ( this.data.emailStatus === 1 && this.data.emailRemindTime.length === 0 ) ){
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
        },
        /**
         * 下拉多选数据
         * @param dataSelected
         * @param dataList
         * @returns {Array}
         */
        checkSelectedReciver: function (dataSelected, dataList) {
            let res = [];
            for(let d of dataList) {
                for(let s of dataSelected) {
                    if(s === d['id']) {
                        res.push(d);
                    }
                }
            }
            return res;
        }
    },
    binds:[
        {
            event:'click',
            selector:'.sms-remind',
            callback:function(){
                this.el.find('.sms-remind').addClass("unchecked");
                this.el.find(".email-remind").removeClass("unchecked");
                this.el.find(".sms").show();
                this.el.find(".email").hide();
            }
        },
        {
            event:'click',
            selector:'.email-remind',
            callback:function(){
                this.el.find('.email-remind').addClass("unchecked");
                this.el.find(".sms-remind").removeClass("unchecked");
                this.el.find(".email").show();
                this.el.find(".sms").hide();
            }
        },
        {
            event:'click',
            selector:'.open-sms-remind',
            callback:function(){
                this.el.find('.open-sms-remind').addClass("checked");
                this.el.find(".close-sms-remind").removeClass("checked");
                this.data.smsStatus = 1;
            }
        },
        {
            event:'click',
            selector:'.close-sms-remind',
            callback:function(){
                this.el.find('.close-sms-remind').addClass("checked");
                this.el.find(".open-sms-remind").removeClass("checked");
                this.data.smsStatus = 0;
            }
        },
        {
            event:'click',
            selector:'.open-email-remind',
            callback:function(){
                this.el.find('.open-email-remind').addClass("checked");
                this.el.find(".close-email-remind").removeClass("checked");
                this.data.emailStatus = 1;
            }
        },
        {
            event:'click',
            selector:'.close-email-remind',
            callback:function(){
                this.el.find('.close-email-remind').addClass("checked");
                this.el.find(".open-email-remind").removeClass("checked");
                this.data.emailStatus = 0;
            }
        },
        {
            event:'change',
            selector:'#send-email-address',
            callback:function(){
                this.data.emailAddressList = [];
                let sendEmailAddressValue = this.el.find('#send-email-address option:selected').text();
                this.data.sendEmailAddressId = this.el.find('#send-email-address option:selected').val();
                this.data.emailAddressList.push({id: this.data.sendEmailAddressId, name: sendEmailAddressValue});
            }
        },
        {
            event:'click',
            selector:'.set-ok',
            callback:function(){
                this.data.smsRemindTime = this.el.find('.remind-time-sms').val();
                this.data.emailRemindTime = this.el.find('.remind-time-email').val();
                this.data.smsReciver = [];
                this.data.smsCopyPeople = [];
                this.data.emailReciver = [];
                this.data.emailCopyPeople = [];
                this.data.smsReceiverAutoSelect.data.choosed.forEach(item => {
                    this.data.smsReciver.push(item['id']);
                });
                this.data.smsCopyPeopleAutoSelect.data.choosed.forEach(item => {
                    this.data.smsCopyPeople.push(item['id']);
                });
                this.data.emailReceiverAutoSelect.data.choosed.forEach(item => {
                    this.data.emailReciver.push(item['id']);
                });
                this.data.emailCopyPeopleAutoSelect.data.choosed.forEach(item => {
                    this.data.emailCopyPeople.push(item['id']);
                });
               this.actions.checkRemindStatus();
            }
        },
        {
            event:'change',
            selector:'.remind-time-sms',
            callback:function(){
                this.data.smsRemindTime = this.el.find('.remind-time-sms').val();
                if(this.data.smsRemindTime.length ==5){
                    this.el.find('.remind-time-sms-icon').removeClass('icon-calendar-require').addClass('icon-calendar-require_yes');
                }else{
                    this.el.find('.remind-time-sms-icon').removeClass('icon-calendar-require_yes').addClass('icon-calendar-require');
                }
            }
        },
        {
            event:'change',
            selector:'.remind-time-email',
            callback:function(){
                this.data.emailRemindTime = this.el.find('.remind-time-email').val();
                if(this.data.emailRemindTime.length ==5){
                    this.el.find('.remind-time-email-icon').removeClass('icon-calendar-require').addClass('icon-calendar-require_yes');
                }else{
                    this.el.find('.remind-time-email-icon').removeClass('icon-calendar-require_yes').addClass('icon-calendar-require');
                }
            }
        },
        {
            event:'click',
            selector:'.remind-receiver-sms li, .remind-receiver-sms .select-all',
            callback:function(){
                setTimeout(()=>{
                    if(this.data.smsReceiverAutoSelect.data.choosed.length>0){
                        this.el.find('.remind-receiver-sms-icon').removeClass('icon-calendar-require').addClass('icon-calendar-require_yes');
                    }else{
                        this.el.find('.remind-receiver-sms-icon').removeClass('icon-calendar-require_yes').addClass('icon-calendar-require');
                    }
                },500)

            }
        },
        {
            event:'click',
            selector:' .remind-receiver-email li, .remind-receiver-email .select-all',
            callback:function(){
                setTimeout(()=>{
                    if(this.data.emailReceiverAutoSelect.data.choosed.length>0){
                        this.el.find('.remind-receiver-email-icon').removeClass('icon-calendar-require').addClass('icon-calendar-require_yes');
                    }else{
                        this.el.find('.remind-receiver-email-icon').removeClass('icon-calendar-require_yes').addClass('icon-calendar-require');
                    }
                },500)
            }
        },
    ],
    afterRender: function() {
        PMAPI.getIframeParams(window.config.key).then(params => {
            this.data.emailStatus = params.data.emailStatus;
            this.data.smsStatus = params.data.smsStatus;
            this.data.emailAddressList = params.data.emailAddressList;
            this.data.recipients = params.data.recipients;
            this.data.copypeople = params.data.copypeople;
            this.data.recipients_per = params.data.recipients_per;
            this.data.sms = params.data.sms;
            this.data.email = params.data.email;
            if (this.data.smsStatus === 1) {
                this.el.find('.open-sms-remind').addClass('checked');
            } else {
                this.el.find('.close-sms-remind').addClass('checked');
            }
            if (this.data.emailStatus === 1) {
                this.el.find('.open-email-remind').addClass('checked');
            } else {
                this.el.find('.close-email-remind').addClass('checked');
            }

            // 短信收件人
            this.data.smsReceiverAutoSelect = new AutoSelect({data:{
                list: this.data.recipients_per,
                choosed: this.actions.checkSelectedReciver(this.data.sms.receiver, this.data.recipients_per),
            }});
            this.append(this.data.smsReceiverAutoSelect, this.el.find('.remind-receiver-sms'));

            // 短信抄送人
            this.data.smsCopyPeopleAutoSelect = new AutoSelect({data:{
                list: this.data.copypeople,
                //choosed: this.data.sms.cc_receiver,
                choosed: this.actions.checkSelectedReciver(this.data.sms.cc_receiver, this.data.copypeople),
            }});
            this.append(this.data.smsCopyPeopleAutoSelect, this.el.find('.remind-copy-for-sms'));

            // 发件箱
            this.data.emailAddressList.forEach(item => {
                this.el.find('#send-email-address').append('<option value="'+ item.id +'">'+ item.name +'</option>');
            });

            // 邮件收件人
            this.data.emailReceiverAutoSelect = new AutoSelect({data:{
                list: this.data.recipients,
                //choosed: this.data.email.receiver,
                choosed: this.actions.checkSelectedReciver(this.data.email.receiver, this.data.recipients),
            }});
            this.append(this.data.emailReceiverAutoSelect, this.el.find('.remind-receiver-email'));

            // 邮件抄送人
            this.data.emailCopyPeopleAutoSelect = new AutoSelect({data:{
                list: this.data.copypeople,
                //choosed: this.data.email.cc_receiver,
                choosed: this.actions.checkSelectedReciver(this.data.email.cc_receiver, this.data.copypeople),
            }});
            this.append(this.data.emailCopyPeopleAutoSelect, this.el.find('.remind-copy-for-email'));

            this.el.find('.remind-time-sms').val(this.data.sms.remind_time);
            this.el.find('.remind-time-email').val(this.data.email.remind_time);
        });
    },

};

// class CalendarSetRemindMethod extends Component {
//     constructor(newConfig) {
//         super($.extend(true,{},config,newConfig));
//     }
// }
//
// export default CalendarSetRemindMethod;
let CalendarSetRemindMethod = Component.extend(config);

export default CalendarSetRemindMethod;