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
        width: '240px'
    },
    actions: {},
    binds: [
        {
            event: 'click',
            selector: '.ui-history',
            callback: function () {
                this.events.emitHistory(this.data);
            }
        },
        // {
        //     event: 'keyup',
        //     selector: '.timeInput',
        //     callback: function () {
        //         console.log(this.value)
        //         this.value=this.value.replace("/[^w:]|_/ig,''");
        //     }
        // },
        {
            event: 'click',
            selector: '.ui-datepicker-current,.input-img',
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
                this.el.find('.time').css({'display': 'block', 'position': 'absolute'});
               event.stopPropagation();
            }
        },

        {
            event: 'click',
            selector: '.ui-datepicker-close',
            callback: function () {
                this.el.find('.time').css('display', 'none');
            }
        }
    ],
    afterRender() {
        let _this = this;
        this.el.find(".timeInput").val("时:分:秒");
        this.el.find('.ui-width').css('width', this.data.width);
        if (this.data.is_view) {
            this.el.find('.ui-width').attr('disabled', true);
        } else {
            this.el.find('.ui-width').attr('disabled', false);
        }
        //回显
        if (_this.data.value) {
            _this.el.find(".timeInput").val(_this.data.value);
        } else {
            this.el.find(".timeInput").val("时:分:秒");
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
            _this.data.value = now;
            _.debounce(function () {
                _this.events.changeValue(_this.data)
            }, 200)();
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
            _this.data.value = now;
            _.debounce(function () {
                _this.events.changeValue(_this.data)
            }, 200)();
        });
        _this.el.find(".ui-datepicker-close").on("click", function () {
            _this.data.value =  _this.el.find('.timeInput').val();
            _.debounce(function () {
                _this.events.changeValue(_this.data)
            }, 200)();
        })

        _this.el.find('.timeInput').on('keyup', function () {
            console.log("keyup")
            _this.data.value= _this.data.value.replace("/[^w:]|_/ig,''");
        })

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