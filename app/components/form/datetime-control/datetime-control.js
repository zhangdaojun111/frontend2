/**
 *@author chenli
 *@description 精确日期控件
 */
import Component from '../../../lib/component'
import 'jquery-ui/ui/widgets/datepicker';
import 'jquery-ui-timepicker-addon';
import 'jquery-ui-timepicker-addon/dist/jquery-ui-timepicker-addon.css';
import 'jquery-ui';
import '../base-form/base-form.scss';
import template from './datetime-control.html';
import './datetime-control.scss';
import '../base-form/dateTime.scss';
import msgbox from '../../../lib/msgbox';
// import 'jedate'
let config = {
    template: template,
    actions:{
        //时间日期输入错误提示，暂时先去掉
        // keyup: function () {
        //     let _this = this;
        //     //YYYY-MM-DD hh:mm:ss
        //     let strDate = this.el.find(".datetime").val();
        //     let  re =/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;
        //
        //     if(re.test(strDate))//判断日期格式符合YYYY-MM-DD hh:mm:ss标准
        //     {
        //         let dateElement=new Date(RegExp.$1,parseInt(RegExp.$2,10)-1,RegExp.$3,RegExp.$4,RegExp.$5,RegExp.$6);
        //
        //         if(!((dateElement.getFullYear()==parseInt(RegExp.$1))&&((dateElement.getMonth()+1)==parseInt(RegExp.$2,10))&&(dateElement.getDate()==parseInt(RegExp.$3))&&(dateElement.getHours()==parseInt(RegExp.$4))&&(dateElement.getMinutes()==parseInt(RegExp.$5))&&(dateElement.getSeconds()==parseInt(RegExp.$6))))//判断日期逻辑
        //         {
        //
        //         } else{
        //             if(!_this.data.isAgGrid){
        //                 _this.data.value = strDate;
        //                 _.debounce(function () {
        //                     _this.events.changeValue(_this.data)
        //                 }, 200)();
        //             }
        //
        //         }
        //     }
        // },
    } ,
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
            selector: '.datetime',
            callback: function () {
                let e = new Date();
                let year = e.getFullYear();
                let month = (e.getMonth() + 101 + "").slice(1);
                let day = (e.getDate() + 100 + "").slice(1);
                let hour = (e.getHours() + 100 + "").slice(1);
                let min = (e.getMinutes() + 100 + "").slice(1);
                let sec = (e.getSeconds() + 100 + "").slice(1);
                let str = year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
                if (!this.data.value || (this.data.value == '请选择')) {
                    this.el.find(".datetime").val(str);
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
            this.el.find('.form-control').attr('title', this.data.value)
            this.el.find('.ui-width').attr('disabled', true);
            this.el.find('.datetime-control').css('pointer-events','none');
        } else {
            this.el.find('.ui-width').attr('disabled', false);
        }
        //回显
        if (_this.data.value) {
            _this.el.find(".datetime").val(_this.data.value);
        } else {
            _this.el.find(".datetime").val("年-月-日 时:分:秒");
        }
        //控制到时分秒
        _this.el.find(".datetime").datetimepicker({
            monthNamesShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            dayNamesMin: ["日", "一", "二", "三", "四", "五", "六"],
            timeText: '时间',
            hourText: '小时',
            minuteText: '分钟',
            secondText: '秒',
            currentText: '今',
            closeText: '确定',
            timeInput: true ,
            showHour: false,
            showMinute:false,
            showSecond:false,
            changeMonth: true,
            changeYear: true,
            dateFormat: "yy-mm-dd",
            yearRange:"1900:2999",
            defaultDate: new Date(_this.data.value),
            timeFormat: 'HH:mm:ss', //格式化时间
            showOn: 'both',//设置触发选择器为button/focus
            //buttonImage:"../../../assets/images/form/icon-rili.png",
            buttonImage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsSAAALEgHS3X78AAAAbElEQVQ4y6VT0QoAIQibR9/qP+XP7p68h7C0cxDEYsrYEpLo4IlIM2OFA4CxPqqqrKKIc35Ewgrng0IL1WGfhZPHDCPbsMPRQitGM6NP393THlyBJOacJImb45qyhasq/4oxirMSbbtI0v3OL3+8d/U3+COTAAAAAElFTkSuQmCC",
            buttonImageOnly: true,
            showOtherMonths: true,//填充没有显示的单元格，但无法使用
            //向外弹射操作后的值
            onSelect: function (selectTime) {
                let selectTime1 = selectTime;
                if(!_this.data.isAgGrid){
                    _this.data.value = selectTime.replace(/\//g, "-");
                    _.debounce(function () {
                        _this.events.changeValue(_this.data)
                    }, 200)();
                }
                if (_this.data.value.length > 19) {
                    _this.data.value = '';
                }
                let _val = '';
                if (selectTime) {
                    _val = selectTime.substring(0, 10);
                }
                let currentTime = new Date().getTime();
                selectTime = new Date(_val).getTime();
                //timeType 是否可以选择之前的日期，before:只能选择之前的日期，after：只能选择之后的，all：可以选择全部
                if(!_this.data.isAgGrid){
                    if (_this.data['timeType']) {
                        if (_this.data['timeType'] == 'after') {
                            if (selectTime < currentTime) {
                                msgbox.alert("所选日期不能早于当前日期！");
                                if(!_this.data.isAgGrid){
                                    _this.data.value = "请选择";
                                    _.debounce(function () {
                                        _this.events.changeValue(_this.data)
                                    }, 200)();
                                }
                            }
                        } else if (_this.data['timeType'] == 'before') {
                            if (selectTime > currentTime) {
                                msgbox.alert("所选日期不能晚于当前日期！");
                                if(!_this.data.isAgGrid){
                                    _this.data.value = "请选择";
                                    _.debounce(function () {
                                        _this.events.changeValue(_this.data)
                                    }, 200)();
                                }
                            }
                        } else if (_this.data['timeType'] == 'all') {
                            if(!_this.data.isAgGrid){
                                _this.data.value = selectTime1.replace(/\//g, "-");
                                _.debounce(function () {
                                    _this.events.changeValue(_this.data)
                                }, 200)();
                            }
                        }
                    } else {
                        console.error('数据错误，该项应该有名为isAllowChooseBefore的属性！', 'datetime-control');
                    }
                }

            },
            onClose: function(selectTime) {
                let _selectTime = $.trim(selectTime);
                let _selectTime1 = _selectTime;
                let  re =/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;
                if(re.test(_selectTime ))
                {
                    let dateElement=new Date(RegExp.$1,parseInt(RegExp.$2,10)-1,RegExp.$3,RegExp.$4,RegExp.$5,RegExp.$6);
                    if((dateElement.getFullYear()==parseInt(RegExp.$1))&&((dateElement.getMonth()+1)==parseInt(RegExp.$2,10))&&(dateElement.getDate()==parseInt(RegExp.$3))&&(dateElement.getHours()==parseInt(RegExp.$4))&&(dateElement.getMinutes()==parseInt(RegExp.$5))&&(dateElement.getSeconds()==parseInt(RegExp.$6)))//判断日期逻辑
                    {
                        //  _this.onSelect(_selectTime);
                            _this.data.value = _selectTime.replace(/\//g, "-");
                            _.debounce(function () {
                                _this.events.changeValue(_this.data)
                            }, 200)();
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
                        if(!_this.data.isAgGrid){
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
                                        _this.data.value = _selectTime1.replace(/\//g, "-");;
                                        _.debounce(function () {
                                            _this.events.changeValue(_this.data)
                                        }, 200)();
                                    }
                                }
                            } else {
                                console.error('数据错误，该项应该有名为isAllowChooseBefore的属性！', 'datetime-control');
                            }
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
        // _this.el.find('.datetime').on('input', _.debounce(function () {
        //     _this.actions.keyup();
        // }, 200));
        if(!_this.data.isAgGrid){
            _.debounce(function () {
                _this.events.changeValue(_this.data)
            }, 200)();
        }
    },
    beforeDestory: function () {
        this.el.off();
    }
}
let DateTimeControl  = Component.extend(config)
export default DateTimeControl