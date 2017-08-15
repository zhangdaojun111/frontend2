/**
 * Created by zj on 2017/8/10.
 */
import Component from "../../../../lib/component";
import template from './calendar.set.remind.html';
import './calendar.set.remind.scss';
import CalendarSetItemMulitSelect from '../calendar.set.item.multiselect/calendar.set.item.multiselect';
import {CalendarService} from '../../../../services/calendar/calendar.service';
import {AutoSelect} from '../../../util/autoSelect/autoSelect';
import Mediator from '../../../../lib/mediator';
let config = {
    template: template,
    data: {
        emailStatus: 0,
        smsStatus: 0,
        // 发信箱数据
        emailAddressList: [],
        // 收件人
        recipients: [],
        // 收信人
        recipients_per: [],
        // 抄送人
        copypeople: [],

    },

    actions: {
        getselectContect:function () {

        }
    },

    afterRender: function() {
        this.data.emailAddressList[0].id = "1";
        let listdata = {'list':this.data.emailAddressList};
        let email_address_content = new AutoSelect(listdata);
        console.log(this.data.emailAddressList);
        this.append(email_address_content, this.el.find('.remind-send-email-address'));
        listdata = {'list':this.data.recipients_per};
        let receiver_sms_content = new AutoSelect(listdata);
        this.append(receiver_sms_content, this.el.find('.remind-receiver-sms'));
        listdata = {'list':this.data.copypeople};
        let copy_for_sms_content = new AutoSelect(listdata);
        this.append(copy_for_sms_content, this.el.find('.remind-copy-for-sms'));
        listdata = {'list':this.data.recipients};
        let receiver_email = new AutoSelect(listdata);
        this.append(receiver_email, this.el.find('.remind-receiver-email'));
        listdata = {'list':this.data.copypeople};
        let copy_for_email = new AutoSelect(listdata);
        this.append(copy_for_email, this.el.find('.remind-copy-for-email'));
        this.el.find(".popup").css('z-index',100,'background-color',"white");
        this.el.find(".popup").css('background-color',"white");
        this.el.find(".popup").css('height',"auto");
        this.el.find(".popup").css('max-height',"300px");
        Mediator.emit('calendar-set:editor',1);
        this.el.on('click', '.sms-remind', () => {
            this.el.find('.sms-remind').addClass("unchecked");
            this.el.find(".email-remind").removeClass("unchecked");
            this.el.find(".sms").show();
            this.el.find(".email").hide();
        }).on('click', '.email-remind', () => {
            console.log(receiver_sms_content.data.choosed);
            this.el.find('.email-remind').addClass("unchecked");
            this.el.find(".sms-remind").removeClass("unchecked");
            this.el.find(".email").show();
            this.el.find(".sms").hide();
        }).on('click', '.open-sms-remind', () => {
            this.el.find('.open-sms-remind').addClass("checked");
            this.el.find(".close-sms-remind").removeClass("checked");
        }).on('click', '.close-sms-remind', () => {
            this.el.find('.close-sms-remind').addClass("checked");
            this.el.find(".open-sms-remind").removeClass("checked");
        }).on('click', '.open-email-remind', () => {

        }).on('click', '.close-email-remind', () => {

        }).on('click', '.set-ok', () => {
            console.log("receiver_sms_content:",receiver_sms_content.data.choosed,"email_address_content",email_address_content.data.choosed,
               "copy_for_sms_content",copy_for_sms_content.data.choosed,"receiver_email",receiver_email.data.choosed,"copy_for_email",copy_for_email.data.choosed);
        })
    }
};

class CalendarSetRemindMethod extends Component {
    constructor(data) {
        config.data.emailStatus = data.emailStatus;
        config.data.smsStatus = data.smsStatus;
        config.data.emailAddressList = data.emailAddressList;
        config.data.recipients = data.recipients;
        config.data.copypeople = data.copypeople;
        config.data.recipients_per = data.recipients_per;
        super(config);
    }
}

export default CalendarSetRemindMethod;