/**
 * Created by zj on 2017/8/8.
 */
import Component from "../../../../lib/component";
import template from './calendar.export.html';
import './calendar.export.scss';

let CalendarExport = {
    template: template,
    data: {
        fromDate: '',
        toDate: ''
    },
    actions: {

        getSchedule: function() {
            this.data.fromDate = this.el.find('.start-date').val();
            this.data.toDate = this.el.find('.end-date').val();
            console.log(this.data.fromDate, this.data.toDate);
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
            console.log(that.data.fromDate, that.data.toDate);
        }).on('input propertychange', '.start-date', function () {
            that.actions.getSchedule();
        }).on('input propertychange', '.end-date', function () {
            that.actions.getSchedule();
        })
    },
};

export default CalendarExport;