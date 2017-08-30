/**
 *@author chenli
 *@description 日期控件
 */

import Component from '../../../lib/component'
import 'jquery-ui/ui/widgets/datepicker';
import 'jquery-ui-timepicker-addon';
import 'jquery-ui-timepicker-addon/dist/jquery-ui-timepicker-addon.css';
import '../base-form/base-form.scss'
import template from './date-control.html';
import './date-control.scss';
import msgbox from '../../../lib/msgbox';

let config = {
    template: template,
    binds: [
        {
            event: 'click',
            selector: '.ui-history',
            callback: function () {
                this.events.emitHistory(this.data)
            }
        },
        {
            event: 'click',
            selector: '.date-close',
            callback: function () {
                this.el.find(".date_yy-mm-dd").val("年/月/日");
            }
        }
    ],
    afterRender() {
        let _this = this;
        this.el.find('.ui-width').css('width', this.data.width);
        if (this.data.is_view) {
            this.el.find('.ui-width').attr('disabled', true);
        } else {
            this.el.find('.ui-width').attr('disabled', false);
        }

        //回显
        if (_this.data.value) {
            _this.el.find(".date_yy-mm-dd").val(_this.data.value.replace(/-/g, "/"));
        } else {
            _this.el.find(".date_yy-mm-dd").val("年/月/日");
        }
        //控制到年月日
        _this.el.find(".date_yy-mm-dd").datepicker({
            monthNamesShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            dayNamesMin: ["日", "一", "二", "三", "四", "五", "六"],
            changeYear: true,
            changeMonth: true,
            dateFormat: "yy/mm/dd",
            defaultDate: new Date(_this.data.value),
            onClose: function (selectedDate) {
            },
            showOn: 'button',//设置触发选择器为button
            //buttonImage:"../../../assets/images/form/icon-rili.png",
            buttonImage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsSAAALEgHS3X78AAAAbElEQVQ4y6VT0QoAIQibR9/qP+XP7p68h7C0cxDEYsrYEpLo4IlIM2OFA4CxPqqqrKKIc35Ewgrng0IL1WGfhZPHDCPbsMPRQitGM6NP393THlyBJOacJImb45qyhasq/4oxirMSbbtI0v3OL3+8d/U3+COTAAAAAElFTkSuQmCC",
            buttonImageOnly: true,
            showOtherMonths: true, //填充没有显示的单元格，但无法使用
            //向外弹射操作后的值
            onSelect: function (selectTime, text) {
                let selectTime1 = selectTime;
                _this.data.value = selectTime.replace(/\//g, "-");
                _.debounce(function () {
                    _this.events.changeValue(_this.data)
                }, 200)();
                if (_this.data.value.length > 10) {
                    _this.data.value = '';
                }
                let _val = '';
                if (selectTime) {
                    _val = selectTime.substring(0, 10);
                }
                let currentTime = new Date().getTime();
                selectTime = new Date(_val).getTime();
                //timeType 是否可以选择之前的日期，before:只能选择之前的日期，after：只能选择之后的，all：可以选择全部
                if (_this.data['timeType']) {
                    if (_this.data['timeType'] == 'after') {
                        if (selectTime < currentTime) {
                            msgbox.alert("所选日期不能早于当前日期！");
                            _this.data.value = "请选择";
                            _.debounce(function () {
                                _this.events.changeValue(_this.data)
                            }, 200)();
                        }
                    } else if (_this.data['timeType'] == 'before') {
                        if (selectTime > currentTime) {
                            msgbox.alert("所选日期不能晚于当前日期！");
                            _this.data.value = "请选择";
                            _.debounce(function () {
                                _this.events.changeValue(_this.data)
                            }, 200)();
                        }
                    } else if (_this.data['timeType'] == 'all') {
                        _this.data.value = selectTime1.replace(/\//g, "-");
                        _.debounce(function () {
                            _this.events.changeValue(_this.data)
                        }, 200)();
                    }
                } else {
                    console.error('数据错误，该项应该有名为isAllowChooseBefore的属性！', this.selector);
                }

            }

        });
        _.debounce(function () {
            _this.events.changeValue(_this.data)
        }, 200)();
    },
    beforeDestory: function () {
        this.el.off();
    }
}
export default class DateControl extends Component {
    constructor(data, events) {
        super(config, data, events);
    }
}