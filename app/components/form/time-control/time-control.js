import Component from '../../../lib/component'
import Mediator from '../../../lib/mediator';
import template from './time-control.html'
import './time-control.scss';

let config={
    template:template,
    firstAfterRender(){
        let _this=this;
        this.el.on('click','.ui-history',function(){
            _.debounce(function(){Mediator.publish('form:history:'+_this.data.tableId,_this.data)},300)();
        });
    },
    afterRender(){
        let _this=this;
        this.el.find('.ui-width').css('width',this.data.width);
        if(this.data.is_view){
            this.el.find('.ui-width').attr('disabled',true);
        }else{
            this.el.find('.ui-width').attr('disabled',false);
        }
        this.el.find(".ui-calendar").val("时:分:秒");
        //增加0
        function p(s) {
            return s < 10 ? '0' + s: s;
        }
        //获取当前时间
        var myDate = new Date();
        var h=myDate.getHours();
        var m=myDate.getMinutes();
        var s=myDate.getSeconds();
        var now=p(h)+':'+p(m)+":"+p(s);

        this.el.find("input").on("click", function () {
                 _this.el.find('.time,.cancel-x').css('display', 'block');
                 var nowTime = _this.el.find("#timeInput").val(now);
                 _this.el.find(".hour").children("span").text(p(h));
                 _this.el.find(".minute").children("span").text(p(m));
                 _this.el.find(".second").children("span").text(p(s));
                 event.stopPropagation();
             })
        this.el.find("input").mouseover(function(){
            _this.el.find('.cancel-x').css('display','block');
        })
        this.el.find(".time").on('click',function(){
            event.stopPropagation();
        });
        $(document).on('click',function(){
            _this.el.find('.time,.cancel-x').css('display','none');
        });
        this.el.find(".cancel-x").on("click", function () {
            _this.el.find('.time').css('display','none');
            _this.el.find(".ui-calendar").val("时:分:秒");

        })
        this.el.find(".plus").on("click", function () {
                //当前时间+1
                var myDate2 = new Date();
                myDate2.setHours(h + 1);
                myDate2.setMinutes(m + 1);
                myDate2.setSeconds(s + 1);
                if($(this).parents().hasClass("hour")){
                    h = myDate2.getHours();
                    _this.el.find(".hour").children("span").text(p(h));
                }else if($(this).parents().hasClass("minute")){
                    m = myDate2.getMinutes();
                    _this.el.find(".minute").children("span").text(p(m));
                }else{
                    s =myDate2.getSeconds();
                    _this.el.find(".second").children("span").text(p(s));
                }
                var now2=p(h)+':'+p(m)+":"+p(s);
                now = now2
                _this.el.find("#timeInput").val(now);
            });
        _this.el.find(".reduce").on("click", function () {
            //当前时间-1
            var myDate3 = new Date();
            myDate3.setHours(h - 1);
            myDate3.setMinutes(m - 1);
            myDate3.setSeconds(s - 1);
            if($(this).parents().hasClass("hour")){
                h = myDate3.getHours();
                _this.el.find(".hour").children("span").text(p(h));
            }else if($(this).parents().hasClass("minute")){
                m= myDate3.getMinutes();
                _this.el.find(".minute").children("span").text(p(m));
            }else{
                s =myDate3.getSeconds();
                _this.el.find(".second").children("span").text(p(s));
            }
            var now3=p(h)+':'+p(m)+":"+p(s);
            now = now3;
            _this.el.find("#timeInput").val(now);
        });
        _.debounce(function(){Mediator.publish('form:changeValue:'+_this.data.tableId,_this.data)},200)();

    },
    beforeDestory:function(){
        Mediator.removeAll('form:changeValue:'+this.data.tableId);
        Mediator.removeAll('form:history:'+this.data.tableId);
    }
}
export default class TimeControl extends Component{
    constructor(data){
        super(config,data);
    }
}