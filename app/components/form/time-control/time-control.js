import Component from '../../../lib/component'
import Mediator from '../../../lib/mediator';

let config={
    template:`<div class="clearfix">
                {{#if unvisible}}
                    <a href="javascript:void(0);" style="color:#ccc;">权限受限</a>
                 {{else if be_control_condition }}
                    <a href="javascript:void(0);" style="color:#ccc;">被修改条件限制</a>
                 {{else}}
                    <input type="text" style="width: 240px" value="{{value}}" class="ui-calendar" id="timeInput"> <span class="cancel-x" style="display: none;cursor: pointer">X</span>
                 <div class="ui-timepicker ui-widget-header ui-corner-all time" style="border:1px solid #000000;background: none;display: none">
                       <!--时-->
                    <div class="ui-hour-picker hour">
                        <a href="#" class="plus">+</a>
                        <span style="display: inline;"></span>
                        <a href="#" class="reduce">-</a>
                    </div>              
                     <!--分-->
                    <div class="ui-minute-picker minute">
                        <a href="#" class="plus">+</a>
                        <span style="display: inline;"></span>
                        <a href="#"class="reduce">-</a>
                    </div>
                    <!--秒-->
                    <div class="ui-second-picker second">
                        <a href="#" class="plus">+</a>
                        <span style="display: inline;"></span>
                        <a href="#"class="reduce">-</a>
                    </div>
                </div>
                           {{#if required}}
                                    <span id="requiredLogo" class="{{requiredClass}}" ></span>
                           {{/if}}
                           {{#if history}}
                                <a href="javascript:void(0);" class="ui-history"  style="vertical-align: middle;"></a>     
                            {{/if}}       
                      </div>
                 {{/if}}
            </div>`,
    data:{

    },
    actions:{

    },
    firstAfterRender:function(){
        let _this=this;
        this.el.on('click','.ui-history',function(){
            _.debounce(function(){Mediator.publish('form:history:'+_this.data.tableId,_this.data)},300)();
        });
    },
    afterRender:function(){
        $(".ui-calendar").val("时:分:秒");
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
        let _this=this;

         $("#timeInput").on("click", function () {

             this.el.find("input").on("click", function () {
                 $('.time,.cancel-x').css('display', 'block');
                 var nowTime = $("#timeInput").val(now);
                 $(".hour").children("span").text(p(h));
                 $(".minute").children("span").text(p(m));
                 $(".second").children("span").text(p(s));
                 event.stopPropagation();
             })

        $("#timeInput").mousemove(function(){

        this.el.find("input").mousemove(function(){

            $('.cancel-x').css('display','block');
        })
        this.el.find(".time").on('click',function(){
            event.stopPropagation();
        });
        $(document).on('click',function(){
            $('.time,.cancel-x').css('display','none');
        });


        $(".cancel-x").on("click", function () {
            $('.time').css('display','none');
            $("#timeInput").val("时:分:秒");

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

                    $(".hour").children("span").text(p(h));
                }else if($(this).parents().hasClass("minute")){
                    m = myDate2.getMinutes();
                    $(".minute").children("span").text(p(m));
                }else{
                    s =myDate2.getSeconds();
                    $(".second").children("span").text(p(s));
                }
                var now2=p(h)+':'+p(m)+":"+p(s);
                now = now2
               $("#timeInput").val(now);

                _this.el.find(".hour").children("span").text(h);
                }else if($(this).parents().hasClass("minute")){
                    m = myDate2.getMinutes();
                    _this.el.find(".minute").children("span").text(m);
                }else{
                    s =myDate2.getSeconds();
                    _this.el.find(".second").children("span").text(s);
                }
                var now2=p(h)+':'+p(m)+":"+p(s);
                now = now2
                _this.el.find(".ui-calendar").val(now);

            });

            _this.el.find(".reduce").on("click", function () {
                //当前时间-1
                var myDate3 = new Date();
                myDate3.setHours(h - 1);
                myDate3.setMinutes(m - 1);
                myDate3.setSeconds(s - 1);
                if($(this).parents().hasClass("hour")){
                    h = myDate3.getHours();

                    $(".hour").children("span").text(p(h));
                }else if($(this).parents().hasClass("minute")){
                    m= myDate3.getMinutes();
                    $(".minute").children("span").text(p(m));
                }else{
                    s =myDate3.getSeconds();
                    $(".second").children("span").text(p(s));
                }
                var now3=p(h)+':'+p(m)+":"+p(s);
                now = now3;
                $("#timeInput").val(now);
            });
        let _this=this;

            _this.el.find(".hour").children("span").text(h);

                }else if($(this).parents().hasClass("minute")){
                    m= myDate3.getMinutes();
                    _this.el.find(".minute").children("span").text(m);
                }else{
                    s =myDate3.getSeconds();
                    _this.el.find(".second").children("span").text(s);
                }
                var now3=p(h)+':'+p(m)+":"+p(s);
                now = now3;
                _this.el.find(".ui-calendar").val(now);
            });

        _.debounce(function(){Mediator.publish('form:changeValue:'+_this.data.tableId,_this.data)},200)();

    },
    beforeDestory:function(){
        Mediator.removeAll('form:changeValue:'+this.data.tableId);
    }
}
export default class TimeControl extends Component{
    constructor(data){
        super(config,data);
    }
}