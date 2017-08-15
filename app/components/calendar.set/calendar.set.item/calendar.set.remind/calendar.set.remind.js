/**
 * Created by zj on 2017/8/10.
 */
import Component from "../../../../lib/component";
import template from './calendar.set.remind.html';
import './calendar.set.remind.scss';
import CalendarSetItemMulitSelect from '../calendar.set.item.multiselect/calendar.set.item.multiselect';
import {CalendarService} from '../../../../services/calendar/calendar.service';
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

    },
    afterRender: function() {

        Mediator.emit('calendar-set:editor',1);
        this.el.on('click', '.sms-remind', () => {
            this.el.find('.sms-remind').addClass("unchecked");
            this.el.find(".email-remind").removeClass("unchecked");
            this.el.find(".sms").show();
            this.el.find(".email").hide();
        }).on('click', '.email-remind', () => {
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