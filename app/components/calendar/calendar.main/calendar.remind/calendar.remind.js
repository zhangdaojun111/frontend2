/**
 * Created by zj on 2017/8/7.
 */
import Component from "../../../../lib/component";
import template from './calendar.remind.html';
import './calendar.remind.scss';

import {PMAPI, PMENUM} from '../../../../lib/postmsg';

let CalendarRemind = {
    template: template,
    data: {
        remindTable: '',
        remindDateProp: '',
        remindDetail: [],
        remindDateTime: '',
        remindTableId: '',
        remindDate: '',
        remindTime: '',
    },
    actions: {

    },
    afterRender: function() {

        this.el.on('click', '.open-form', () => {
            // PMAPI.sendToParent({
            //     type: PMENUM.close_dialog,
            //     data: {
            //         table_id: this.data.remindTableId,
            //     }
            // });
            PMAPI.openDialogByIframe(
                '/calendar_mgr/create/?table_id='+ this.data.remindTableId,
                {
                    width: "1700",
                    height: '800',
                    title: '表单'
                });
        })
    }
};

export default CalendarRemind;