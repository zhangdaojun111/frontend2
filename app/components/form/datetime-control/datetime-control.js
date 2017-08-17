import Component from '../../../lib/component'
import Mediator from '../../../lib/mediator';
import 'jquery-ui/ui/widgets/datepicker';
import 'jquery-ui-timepicker-addon';
import 'jquery-ui-timepicker-addon/dist/jquery-ui-timepicker-addon.css';
import 'jquery-ui';
import '../base-form/base-form.scss'
import '../date-control/data-control-alert.html'
import template from  './datetime-control.html';
let config={
    template:template,
    data:{
    },
    actions:{
    },
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

        //控制到时分秒
        _this.el.find(".datetime").val("年/月/日 时:分:秒");
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
            timeFormat: 'HH:mm:ss', //格式化时间

            onSelect: function (selectTime, text) {
                selectTime.replace("/", "-");
                _this.data.value = selectTime.replace(/\//g, "-");

                _.debounce(function(){Mediator.publish('form:changeValue:'+_this.data.tableId,_this.data)},200)();
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
                            _.debounce(function(){Mediator.publish('form:alertDateFuture:'+_this.data.tableId,_this.data)},200)();
                            _this.data.value = "请选择";
                            _.debounce(function(){Mediator.publish('form:changeValue:'+_this.data.tableId,_this.data)},200)();
                        }
                    }else if( _this.data['timeType'] == 'before') {
                        if(selectTime > currentTime){
                            _.debounce(function(){Mediator.publish('form:alertDateHistory:'+_this.data.tableId,_this.data)},200)();
                            _this.data.value = "请选择";
                            _.debounce(function(){Mediator.publish('form:changeValue:'+_this.data.tableId,_this.data)},200)();
                        }
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
        _this.el.on('click','.date-close',function () {
            _this.el.find(".datetime").val("年/月/日 时:分:秒");
        })
        _.debounce(function(){Mediator.publish('form:changeValue:'+_this.data.tableId,_this.data)},200)();
    },
    beforeDestory:function(){
        Mediator.removeAll('form:changeValue:'+this.data.tableId);
        Mediator.removeAll('form:history:'+this.data.tableId);
    }
}
export default class DateTimeControl extends Component{
    constructor(data){
        super(config,data);
    }
}