/**
 * Created by zj on 2017/8/8.
 */
import Component from "../../../../lib/component";
import template from './calendar.export.html';
import './calendar.export.scss';
import DateControl from '../../../form/date-control/date-control';
import {PMAPI, PMENUM} from '../../../../lib/postmsg';
import {CalendarService} from '../../../../services/calendar/calendar.service';
import msgbox from "../../../../lib/msgbox";

let config = {
    template: template,
    data: {
        fromDate: '',
        toDate: '',
        cancelFields: [],
    },
    actions: {

        getExportDate: function() {
            if( this.data.fromDate === '' || this.data.toDate === '' ){
                return;
            }
            if( this.data.fromDate > this.data.toDate ){
                alert( '起始时间不能大于结束时间。' );
                this.el.find('.export-btn').attr("disabled", true);
            }
           else {
                this.el.find('.export-btn').attr('disabled', false);
           }
        },
    },
    afterRender: function() {
        PMAPI.getIframeParams(window.config.key).then(params => {
            let _this = this;
            _this.data.cancelFields = JSON.stringify(params.data.cancelFields);
            _this.el.on('click', '.export-btn', function () {
                if( _this.data.fromDate === '' || _this.data.toDate === '' ){
                    msgbox.alert('请先选择时间！');
                }else{
                    window.open(`/calendar_mgr/export_calendar_data/?from_date=${_this.data.fromDate}&to_date=${_this.data.toDate}&cancel_fields=${_this.data.cancelFields}`);
                }
            });
        });
        // this.el.find('.export-btn').attr("disabled", true);
        // this.el.find('.export-btn').attr('disabled', true);
        let _this = this;

        let changeStartValue = (res) => {
            this.data.fromDate = res['value'];
            _this.actions.getExportDate();
        };
        let changeEndValue = (res) => {
            this.data.toDate = res['value'];
            _this.actions.getExportDate();
        };

        this.append(new DateControl({data:{value: '',isCalendar: true, timeType: 'all'},events:{changeValue: changeStartValue}}), this.el.find('.start-date'));
        this.append(new DateControl({data:{value: '',isCalendar: true, timeType: 'all'},events:{changeValue: changeEndValue}}), this.el.find('.end-date'));
    },
};
// class CalendarExport extends Component {
//     constructor(newconfig = {}) {
//         super($.extend(true ,{}, config, newconfig));
//     }
// }
// export default CalendarExport;

let CalendarExport = Component.extend(config);

export default CalendarExport;