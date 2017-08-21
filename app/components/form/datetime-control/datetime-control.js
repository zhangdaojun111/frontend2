import Component from '../../../lib/component'
import 'jquery-ui/ui/widgets/datepicker';
import 'jquery-ui-timepicker-addon';
import 'jquery-ui-timepicker-addon/dist/jquery-ui-timepicker-addon.css';
import 'jquery-ui';
import '../base-form/base-form.scss'
import template from  './datetime-control.html';
import msgbox from '../../../lib/msgbox';
let config={
    template:template,
    binds:[
        {
            event: 'click',
            selector: '.ui-history',
            callback: function(){
                this.events.emitHistory(this.data)
            }
        },
        {
            event: 'click',
            selector: '.date-close',
            callback: function(){
                this.el.find(".datetime").val("年/月/日 时:分:秒")
            }
        }
    ],
    afterRender(){
        let _this=this;
        this.el.find('.ui-width').css('width',this.data.width);
        if(this.data.is_view){
            this.el.find('.ui-width').attr('disabled',true);
        }else{
            this.el.find('.ui-width').attr('disabled',false);
        }


        //控制到时分秒
        if(_this.data.value == ''){
            _this.el.find(".datetime").val("年/月/日 时:分:秒");
        }else{
            _this.el.find(".datetime").val(_this.data.value.replace(/-/g, "/"));

        }

        _this.el.find(".datetime").datetimepicker({
            monthNamesShort: [ "一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月" ],
            dayNamesMin: [ "日","一","二","三","四","五","六" ],
            timeText: '时间',
            hourText: '小时',
            minuteText: '分钟',
            secondText: '秒',
            currentText: '现在',
            closeText: '完成',
            showSecond: true, //显示秒
            changeYear:true,
            changeMonth: true,
            dateFormat: "yy/mm/dd",
            defaultDate:new Date(_this.data.value),
            timeFormat: 'HH:mm:ss', //格式化时间

            onSelect: function (selectTime, text) {
                let selectTime1 = selectTime;
                _this.data.value = selectTime.replace(/\//g, "-");
                _.debounce(function(){_this.events.changeValue(_this.data)},200)();
                if( _this.data.value.length > 19 ){
                    _this.data.value = '';
                }
                let _val='';
                if( selectTime){
                    _val= selectTime.substring(0,10);
                }
                let currentTime = new Date().getTime();
                selectTime = new Date(_val).getTime();

                if( _this.data['timeType']){
                    if( _this.data['timeType'] == 'after'){
                        if(selectTime < currentTime){
                            msgbox.alert("所选日期不能早于当前日期！");
                            _this.data.value = "请选择";
                            _.debounce(function(){_this.events.changeValue(_this.data)},200)();
                        }
                    }else if( _this.data['timeType'] == 'before') {
                        if(selectTime > currentTime){
                            msgbox.alert("所选日期不能晚于当前日期！");
                            _this.data.value = "请选择";
                            _.debounce(function(){_this.events.changeValue(_this.data)},200)();
                        }
                    }else if(_this.data['timeType'] == 'all'){
                        _this.data.value = selectTime1.replace(/\//g, "-");
                        _.debounce(function(){_this.events.changeValue(_this.data)},200)();
                    }
                }else{
                    console.error('数据错误，该项应该有名为isAllowChooseBefore的属性！',this.selector);
                }

            }
        });

        let boolean = true;
        if(boolean){
            _this.el.on('click','#icon_rili',function(){
                _this.el.find(".datetime").datetimepicker('show');
            });
            boolean = false;
        }else{
            _this.el.on('click','#icon_rili',function(){
                $('#ui-datepicker-div').off();
                _this.el.find(".datetime").datetimepicker('hide');
            });
            boolean = true;
        }
        _.debounce(function(){_this.events.changeValue(_this.data)},200)();
    },
    beforeDestory:function(){
        this.el.off();
    }
}
export default class DateTimeControl extends Component{
    constructor(data,events){
        super(config,data,events);
    }
}