/**
 * Created by zj on 2017/8/7.
 */
import Component from "../../../../lib/component";
import template from './calendar.remind.html';
//import './calendar.remind.scss';

let css = `
.remind-wrap {
    width: calc(100% - 60px);
    padding: 30px;
    overflow: auto;
}
.remind-row {
        border: 1px solid rgba(228, 228, 228, 1);
        background-color: rgba(250, 250, 250, 1);
    }
    .title {
        padding-left: 5px;
        width: 35%;
        height: 40px;
        vertical-align: middle;
    }
    span {
        background-color: #ffffff;
        border: 1px solid rgba(228, 228, 228, 1);
        vertical-align: middle;
        line-height: 30px;
        display: inline-block;
        margin: 5px 0px;
        width: 96%;
        padding: 0px 5px;
    }
    .start, .end {
        width: 46.7%;
        height: 30px;
    }
    .detail {
        width: 598px;
        margin: 5px 5px 5px 0px;
    }
`

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
        css: css.replace(/(\n)/g, '')
    },
    actions: {

    },
    afterRender: function() {
        this.data.style = $("<style></style>").text(this.data.css).appendTo($("head"));
        this.el.on('click', '.open-form', () => {
            PMAPI.openDialogByIframe(
                '/calendar_mgr/create/?table_id='+ this.data.remindTableId,
                {
                    width: "1700",
                    height: '800',
                    title: '表单'
                });
        })
    },
    beforeDestory: function () {
        this.data.style.remove();
    }
};

export default CalendarRemind;