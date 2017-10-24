/**
 *@author chenli
 *@description 时间控件
 */
import Component from '../../../lib/component'
import template from './time-control.html'
import './time-control.scss';

let config = {
    template: template,
    data: {
        // width: '240px'
    },
    actions: {
        //时间日期输入错误提示
        keyup: function () {
            let _this = this;
            //hh:mm:ss
            let strDate = this.el.find(".timeInput").val();
            let re = /^((20|21|22|23|[0-1]\d)\:[0-5][0-9])(\:[0-5][0-9])?$/;

            if (re.test(strDate))//判断日期格式符合hh:mm:ss标准
            {
                this.el.find(".hour").children("span").text(strDate.substring(0, 2))
                this.el.find(".minute").children("span").text(strDate.substring(3, 5));
                this.el.find(".second").children("span").text(strDate.substring(6, 8));
                this.el.find("#errorMessage").css("display", "none");
                if (!_this.data.isAgGrid) {
                    _this.data.value = strDate.replace(/\//g, "-");
                    _.debounce(function () {
                        _this.events.changeValue(_this.data)
                    }, 200)();
                }
            }
        }
    },
    binds: [
        {
            event: 'click',
            selector: '.ui-history',
            callback: function () {
                this.events.emitHistory(this.data);
            }
        },
        {
            event: 'click',
            selector: '.ui-datepicker-current',
            callback: function () {
                //增加0
                function p(s) {
                    return s < 10 ? '0' + s : s;
                }

                //获取当前时间
                let myDate = new Date();
                let h = myDate.getHours();
                let m = myDate.getMinutes();
                let s = myDate.getSeconds();
                let now = p(h) + ':' + p(m) + ":" + p(s);

                let nowTime = this.el.find(".timeInput").val(now);
                this.data.value = now;
                _.debounce(() => {
                    this.events.changeValue(this.data)
                }, 200)();
                this.el.find(".hour").children("span").text(p(h));
                this.el.find(".minute").children("span").text(p(m));
                this.el.find(".second").children("span").text(p(s));
            }
        },
        {
            event: 'click',
            selector: '.input-img',
            callback: function () {
                this.el.find('.time').css({'position': 'fixed'}).toggle();
            }
        },

        {
            event: 'click',
            selector: '.ui-datepicker-close',
            callback: function () {
                let _this = this;
                this.el.find('.time').css('display', 'none');
                let re = /^((20|21|22|23|[0-1]\d)\:[0-5][0-9])(\:[0-5][0-9])?$/;
                let strDate = this.el.find(".timeInput").val();
                if (re.test(strDate)) {
                    _this.data.value = strDate;
                    _.debounce(function () {
                        _this.events.changeValue(_this.data)
                    }, 200)();
                }
            }
        }
    ],
    afterRender() {
        let _this = this;
        this.el.find('.ui-width').css('width', this.data.width);
        this.el.find('.time').css('width', this.data.width);
        //修改历史
        if(! this.data.isCalendar && !this.data.isAgGrid && this.data.history){
            this.el.find('.ui-history').css('visibility','visible');
        }
        if(this.data.isCalendar || this.data.isAgGrid) {
            this.el.find('.ui-history').css('visibility','hidden');
        }

        //查看模式/编辑模式
        if (this.data.is_view) {
            this.el.find('.ui-width').attr('title', this.data.value)
            this.el.find('.ui-width').attr('disabled', true);
            this.el.find('.input-img').css('pointer-events', 'none');
        } else {
            this.el.find('.ui-width').attr('disabled', false);
        }

        //增加0
        function p(s) {
            return s < 10 ? '0' + s : s;
        }

        //获取当前时间
        let myDate = new Date();
        let h = myDate.getHours();
        let m = myDate.getMinutes();
        let s = myDate.getSeconds();
        let now = p(h) + ':' + p(m) + ":" + p(s);

        let timeInput = _this.el.find(".timeInput");
        let hour = this.el.find(".hour").children("span");
        let minute = this.el.find(".minute").children("span");
        let second = this.el.find(".second").children("span");
        let time =  this.el.find(".time")

        //回显
        if (_this.data.value) {
            timeInput.val(_this.data.value);
            hour.text(_this.data.value.substring(0, 2))
            minute.text(_this.data.value.substring(3, 5));
            second.text(_this.data.value.substring(6, 8));

        } else {
            timeInput.val('时:分:秒');
            hour.text(p(h));
            minute.text(p(m));
            second.text(p(s));
        }

        this.el.on("click", '.timeInput', function () {
            time.css({'position': 'fixed','display':'block'});
            if (_this.data.value) {
                timeInput.val(_this.data.value);
            } else {
                timeInput.val(now);
                if(!_this.data.isAgGrid){
                    _this.data.value = now;
                    _.debounce(function () {
                        _this.events.changeValue(_this.data)
                    }, 200)();
                }
            }
        })
        this.el.on("click", '.plus', function () {
            //当前时间+1
            let myDate2 = new Date();
            myDate2.setHours(h + 1);
            myDate2.setMinutes(m + 1);
            myDate2.setSeconds(s + 1);
            if ($(this).parents().hasClass("hour")) {
                h = myDate2.getHours();
                hour.text(p(h));
            } else if ($(this).parents().hasClass("minute")) {
                m = myDate2.getMinutes();
                minute.text(p(m));
            } else {
                s = myDate2.getSeconds();
                second.text(p(s));
            }
            let now2 = p(h) + ':' + p(m) + ":" + p(s);
            now = now2
            timeInput.val(now);
            if (!_this.data.isAgGrid) {
                _this.data.value = now;
                _.debounce(function () {
                    _this.events.changeValue(_this.data)
                }, 200)();
            }

        });
        this.el.on("click", '.reduce', function () {
            //当前时间-1
            let myDate3 = new Date();
            myDate3.setHours(h - 1);
            myDate3.setMinutes(m - 1);
            myDate3.setSeconds(s - 1);
            if ($(this).parents().hasClass("hour")) {
                h = myDate3.getHours();
                hour.text(p(h));
            } else if ($(this).parents().hasClass("minute")) {
                m = myDate3.getMinutes();
                minute.text(p(m));
            } else {
                s = myDate3.getSeconds();
                second.text(p(s));
            }
            let now3 = p(h) + ':' + p(m) + ":" + p(s);
            now = now3;
            timeInput.val(now);
            if (!_this.data.isAgGrid) {
                _this.data.value = now;
                _.debounce(function () {
                    _this.events.changeValue(_this.data)
                }, 200)();
            }

        });

        this.el.find('.timeInput').on('input', _.debounce(function () {
            _this.actions.keyup();
        }, 200));
        if(!_this.data.isAgGrid){
            _.debounce(function () {
                _this.events.changeValue(_this.data)
            }, 200)();
        }

    },
    beforeDestory: function () {
        $(document).off('click:timeControl');
        this.el.off();
    }
}
export default class TimeControl extends Component {
    constructor(data,events,newConfig){
        super($.extend(true,{},config,newConfig),data,events)
    }
}