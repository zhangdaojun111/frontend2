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
    data:{
        isClick : false,
    },
    actions: {
        dateVaild: function (val) {
            // let $events = $._data($('.ui-datepicker-trigger')[0], 'events')
            let _this = this;
            let  re =/^(\d{4})-(\d{2})-(\d{2})$/;
            if(!this.data.isClick){
                if(re.test(val)){
                    let dateElement=new Date(RegExp.$1,parseInt(RegExp.$2,10)-1,RegExp.$3);
                    if(!((dateElement.getFullYear()==parseInt(RegExp.$1))&&((dateElement.getMonth()+1)==parseInt(RegExp.$2,10))&&(dateElement.getDate()==parseInt(RegExp.$3)))){//判断日期逻辑
                        msgbox.alert('日期的标准格式为yyyy-mm-dd，请修改')
                    } else{
                        if(!_this.data.isAgGrid){
                            _this.data.value = val;
                            _.debounce(function () {
                                _this.events.changeValue(_this.data)
                            }, 200)();
                        }
                    }
                }else{
                    msgbox.alert('日期的标准格式为yyyy-mm-dd，请修改')
                }
            }
        }
    },
    binds: [
        {
            event: 'click',
            selector: '.ui-history',
            callback: function () {
                this.events.emitHistory(this.data)
            }
        },
        {
            event: 'blur',
            selector: '.date-control',
            callback: function () {
                let val = this.el.find(".date_yy-mm-dd").val();
                this.actions.dateVaild(val);
            }
        },
        {
            event: 'click',
            selector: '.date_yy-mm-dd',
            callback: function () {
                let _this = this;
                let e = new Date();
                let year = e.getFullYear();
                let month = (e.getMonth() + 101 + "").slice(1);
                let day = (e.getDate() + 100 + "").slice(1);
                let str = year + "-" + month + "-" + day;
                if (!_this.data.value || (_this.data.value == '请选择')) {
                    _this.el.find(".date_yy-mm-dd").val(str);
                    if(!_this.data.isAgGrid){
                        _this.data.value = str;
                        _.debounce(function () {
                            _this.events.changeValue(_this.data)
                        }, 200)();
                    }
                }
            }
        },
    ],
    afterRender() {
        let _this = this;
        this.el.find('.ui-width').css('width', this.data.width);
        if(! this.data.isCalendar && !this.data.isAgGrid && this.data.history){
            this.el.find('.ui-history').css('visibility','visible');
        }
        if(this.data.isCalendar || this.data.isAgGrid) {
            this.el.find('.ui-history').css('visibility','hidden');
        }
        if (this.data.is_view) {
            this.el.find('.form-control').attr('title', this.data.value);
            this.el.find('.ui-width').attr('disabled', true);
            this.el.find('.date-control').css('pointer-events','none');
        } else {
            this.el.find('.ui-width').attr('disabled', false);
        }
        //回显
        if (_this.data.value) {
            _this.el.find(".date_yy-mm-dd").val(_this.data.value);
        }
        else {
            _this.el.find(".date_yy-mm-dd").val("年-月-日");
        }
        //控制到年月日
        _this.el.find(".date_yy-mm-dd").datepicker({
            monthNamesShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            dayNamesMin: ["日", "一", "二", "三", "四", "五", "六"],
            timeText: '时间',
            hourText: '小时',
            minuteText: '分钟',
            secondText: '秒',
            currentText: '今',
            closeText: false,
            timeInput: true ,
            timeFormat:' ',
            showTime:false,
            showHour: false,
            showMinute:false,
            showSecond:false,
            changeYear: true,
            changeMonth: true,
            dateFormat: "yy-mm-dd",
            yearRange:"1900:2999",
            defaultDate: new Date(_this.data.value),
            showOn: 'button',//设置触发选择器为button/focus
            //buttonImage:"../../../assets/images/form/icon-rili.png",
            buttonImage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsSAAALEgHS3X78AAAAbElEQVQ4y6VT0QoAIQibR9/qP+XP7p68h7C0cxDEYsrYEpLo4IlIM2OFA4CxPqqqrKKIc35Ewgrng0IL1WGfhZPHDCPbsMPRQitGM6NP393THlyBJOacJImb45qyhasq/4oxirMSbbtI0v3OL3+8d/U3+COTAAAAAElFTkSuQmCC",
            buttonImageOnly: true,
            showOtherMonths: true, //填充没有显示的单元格，但无法使用
            beforeShow : function(){
                _this.data.isClick = true;
            },
            //向外弹射操作后的值
            onSelect: function (selectTime, text) {
                _this.el.find("#errorMessage").css("display","none");
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
                    console.error('数据错误，该项应该有名为isAllowChooseBefore的属性！', 'date-control');
                }
                _this.data.isClick = false;
            },
            onClose: function(selectTime) {
                let _selectTime = $.trim(selectTime);
                let _selectTime1 = _selectTime;
                let  re =/^(\d{4})-(\d{2})-(\d{2})$/;
                if(re.test(_selectTime ))
                {
                    let dateElement=new Date(RegExp.$1,parseInt(RegExp.$2,10)-1,RegExp.$3);
                    if((dateElement.getFullYear()==parseInt(RegExp.$1))&&((dateElement.getMonth()+1)==parseInt(RegExp.$2,10))&&(dateElement.getDate()==parseInt(RegExp.$3)))//判断日期逻辑
                    {
                        //  _this.onSelect(_selectTime);
                        if(!_this.data.isAgGrid){
                            _this.data.value = _selectTime.replace(/\//g, "-");
                            _.debounce(function () {
                                _this.events.changeValue(_this.data)
                            }, 200)();
                        }
                        if (_this.data.value.length > 19) {
                            _this.data.value = '';
                        }
                        let _val = '';
                        if (_selectTime) {
                            _val = _selectTime.substring(0, 10);
                        }
                        let currentTime = new Date().getTime();
                        _selectTime = new Date(_val).getTime();
                        //timeType 是否可以选择之前的日期，before:只能选择之前的日期，after：只能选择之后的，all：可以选择全部
                        if (_this.data['timeType']) {
                            if (_this.data['timeType'] == 'after') {
                                if (_selectTime < currentTime) {
                                    if(!_this.data.isAgGrid){
                                        _this.data.value = "请选择";
                                        _.debounce(function () {
                                            _this.events.changeValue(_this.data)
                                        }, 200)();
                                    }
                                }
                            } else if (_this.data['timeType'] == 'before') {
                                if (_selectTime > currentTime) {
                                    if(!_this.data.isAgGrid){
                                        _this.data.value = "请选择";
                                        _.debounce(function () {
                                            _this.events.changeValue(_this.data)
                                        }, 200)();
                                    }
                                }
                            } else if (_this.data['timeType'] == 'all') {
                                if(!_this.data.isAgGrid){
                                    _this.data.value = _selectTime1;
                                    _.debounce(function () {
                                        _this.events.changeValue(_this.data)
                                    }, 200)();
                                }
                            }
                        } else {
                            console.error('数据错误，该项应该有名为isAllowChooseBefore的属性！', 'datetime-control');
                        }
                    }
                }else{
                    if(!_this.data.isAgGrid && (_this.data['timeType'] == 'before' || _this.data['timeType'] == 'after')){
                        _this.data.value = "请选择";
                        _.debounce(function () {
                            _this.events.changeValue(_this.data)
                        }, 200)();
                    }
                }
            },
        });
    },
    beforeDestory: function () {
        this.el.off();
    }
}
let DateControl = Component.extend(config)
export default DateControl