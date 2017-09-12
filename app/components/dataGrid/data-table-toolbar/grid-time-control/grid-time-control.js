/**
 * Created by zhr.
 */
import Component from '../../../../lib/component'
import template from './grid-time-control.html'
import './grid-time-control.scss';

let config = {
    template: template,
    data: {
        // width: '240px'
    },
    actions: {
        //时间日期输入错误提示
        keyup: function () {
            let _this = this
            // _this.data.value=_this.data.value.replace(/[^\d&:&]|_/ig,'');
            //hh:mm:ss
            let strDate = this.el.find(".timeInput").val();
            let re = /^((20|21|22|23|[0-1]\d)\:[0-5][0-9])(\:[0-5][0-9])?$/;

            if (re.test(strDate))//判断日期格式符合hh:mm:ss标准
            {
                this.el.find(".hour").children("span").text(strDate.substring(0,2))
                this.el.find(".minute").children("span").text(strDate.substring(3,5));
                this.el.find(".second").children("span").text(strDate.substring(6,8));
                this.el.find("#errorMessage").css("display", "none");
                if(!_this.data.isAgGrid){
                    _this.data.value = strDate.replace(/\//g, "-");
                    _.debounce(function () {
                        _this.events.changeValue(_this.data)
                    }, 200)();
                }

            }
            else {
                // this.el.find("#errorMessage").css("display", "inline-block").text("时间格式不正确，正确格式为12:00:00 ");
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
                this.el.find("#errorMessage").css("display","none");
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
                this.el.find('.time').css({ 'position': 'fixed'}).toggle();
                event.stopPropagation();
            }
        },

        {
            event: 'click',
            selector: '.ui-datepicker-close',
            callback: function () {
                let _this =this;
                this.el.find('.time').css('display', 'none');
                let re = /^((20|21|22|23|[0-1]\d)\:[0-5][0-9])(\:[0-5][0-9])?$/;
                let strDate = this.el.find(".timeInput").val();
                if (re.test(strDate)){
                    _this.data.value =strDate;
                    console.log("dd  "+ _this.data.value)
                    _.debounce(function () {
                        _this.events.changeValue(_this.data)
                    }, 200)();
                }
            }
        }
    ],
    afterRender() {
        let _this = this;
        this.el.find(".timeInput").val("时:分:秒");
        this.el.find('.ui-width').css('width', this.data.width);
        this.el.find('.time').css('width', this.data.width);
        if(this.data.history){
            this.el.find('.ui-history').css('visibility','visible');
        }
        if (this.data.is_view) {
            this.el.find('.ui-width').attr('disabled', true);
            this.el.find('.input-img').css('pointer-events','none');
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

        //回显
        if (_this.data.value) {
            _this.el.find(".timeInput").val(_this.data.value);
            let a =this.el.find(".hour").children("span").text(_this.data.value.substring(0,2))
            this.el.find(".minute").children("span").text(_this.data.value.substring(3,5));
            this.el.find(".second").children("span").text(_this.data.value.substring(6,8));

        } else {
            this.el.find(".timeInput").val("时:分:秒");
            this.el.find(".hour").children("span").text(p(h));
            this.el.find(".minute").children("span").text(p(m));
            this.el.find(".second").children("span").text(p(s));
        }

        this.el.on("click", '.plus', function () {
            //当前时间+1
            let myDate2 = new Date();
            myDate2.setHours(h + 1);
            myDate2.setMinutes(m + 1);
            myDate2.setSeconds(s + 1);
            if ($(this).parents().hasClass("hour")) {
                h = myDate2.getHours();
                _this.el.find(".hour").children("span").text(p(h));
            } else if ($(this).parents().hasClass("minute")) {
                m = myDate2.getMinutes();
                _this.el.find(".minute").children("span").text(p(m));
            } else {
                s = myDate2.getSeconds();
                _this.el.find(".second").children("span").text(p(s));
            }
            let now2 = p(h) + ':' + p(m) + ":" + p(s);
            now = now2
            let nowTime = _this.el.find(".timeInput").val(now);
            if(!_this.data.isAgGrid){
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
                _this.el.find(".hour").children("span").text(p(h));
            } else if ($(this).parents().hasClass("minute")) {
                m = myDate3.getMinutes();
                _this.el.find(".minute").children("span").text(p(m));
            } else {
                s = myDate3.getSeconds();
                _this.el.find(".second").children("span").text(p(s));
            }
            let now3 = p(h) + ':' + p(m) + ":" + p(s);
            now = now3;
            let nowTime = _this.el.find(".timeInput").val(now);
            if(!_this.data.isAgGrid){
                _this.data.value = now;
                _.debounce(function () {
                    _this.events.changeValue(_this.data)
                }, 200)();
            }

        });

        this.el.find('.timeInput').on('input', _.debounce(function () {
            _this.actions.keyup();
        }, 200));
        _.debounce(function () {
            _this.events.changeValue(_this.data)
        }, 200)();

    },
    beforeDestory: function () {
        $(document).off('click:timeControl');
        this.el.off();
    }
}
export default class TimeControl extends Component {
    constructor(data, events) {
        super(config, data, events);
    }
}