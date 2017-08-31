/**
 * Created by zj on 2017/8/8.
 */
import Component from "../../../../lib/component";
import template from './calendar.export.html';
import './calendar.export.scss';
import DateControl from '../../../form/date-control/date-control';

let config = {
    template: template,
    data: {
        fromDate: '',
        toDate: ''
    },
    actions: {

        getExportDate: function() {
            this.data.fromDate = this.el.find('.start-date').val();
            this.data.toDate = this.el.find('.end-date').val();
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
        this.el.find('.export-btn').attr("disabled", true);
        this.el.find('.export-btn').attr('disabled', true);
        let that = this;
        this.el.on('click', '.export-btn', function () {
            window.open(`/calendar_mgr/export_calendar_data/?from_date=${that.data.fromDate}&to_date=${that.data.toDate}`);
        }).on('input propertychange', '.start-date', function () {
            that.actions.getExportDate();
        }).on('input propertychange', '.end-date', function () {
            that.actions.getExportDate();
        });
        let changeStartValue = (res) => {
            console.log(res);
        };
        let changeEndValue = (res) => {
            console.log(res);
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