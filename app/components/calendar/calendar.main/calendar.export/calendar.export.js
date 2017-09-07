/**
 * Created by zj on 2017/8/8.
 */
import Component from "../../../../lib/component";
import template from './calendar.export.html';
import './calendar.export.scss';
import DateControl from '../../../form/date-control/date-control';
import {PMAPI, PMENUM} from '../../../../lib/postmsg';

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
                return;
            }
            else {
                this.el.find('.export-btn').attr('disabled', false);
            }
        },
    },
    afterRender: function() {
        PMAPI.subscribe(PMENUM.open_iframe_params, params => {
            let _this = this
            this.data.cancelFields = params.data.cancelFields;
            this.el.on('click', '.export-btn', function () {
                console.log(_this.data.cancelFields);
                window.open(`/calendar_mgr/export_calendar_data/?from_date=${_this.data.fromDate}&to_date=${_this.data.toDate}`);
            });
        });
        this.el.find('.export-btn').attr("disabled", true);
        this.el.find('.export-btn').attr('disabled', true);
        let _this = this;

        let changeStartValue = (res) => {
            this.data.fromDate = res['value'];
            _this.actions.getExportDate();
        };
        let changeEndValue = (res) => {
            this.data.toDate = res['value'];
            _this.actions.getExportDate();
        };

        this.append(new DateControl({value: ''},{changeValue: changeStartValue}), this.el.find('.start-date'));
        this.append(new DateControl({value: ''},{changeValue: changeEndValue}), this.el.find('.end-date'));
    },
};
class CalendarExport extends Component {
    constructor() {
        super(config);
    }
}
export default CalendarExport;