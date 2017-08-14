/**
 * Created by zj on 2017/8/10.
 */
import Component from "../../../../lib/component";
import template from './calendar.set.remind.html';
import './calendar.set.remind.scss';
import CalendarSetItemMulitSelect from '../calendar.set.item.multiselect/calendar.set.item.multiselect';
import {CalendarService} from '../../../../services/calendar/calendar.service';

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
        console.log(this.data.recipients_per);
        this.append(new CalendarSetItemMulitSelect(this.data.recipients_per), this.el.find('.remind-receiver-sms'));
        this.append(new CalendarSetItemMulitSelect(this.data.copypeople), this.el.find('.remind-copy-for-sms'));
        this.append(new CalendarSetItemMulitSelect(this.data.emailAddressList), this.el.find('.remind-send-email-address'));
        this.append(new CalendarSetItemMulitSelect(this.data.recipients), this.el.find('.remind-receiver-email'));
        this.append(new CalendarSetItemMulitSelect(this.data.copypeople), this.el.find('.remind-copy-for-email'));

        this.el.on('click', '.sms-remind', () => {

        }).on('click', '.email-remind', () => {

        }).on('click', '.open-sms-remind', () => {

        }).on('click', '.close-sms-remind', () => {

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