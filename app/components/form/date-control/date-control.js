import Component from '../../../lib/component'
import Mediator from '../../../lib/mediator';
import 'jquery-ui/ui/widgets/datepicker';
import 'jquery-ui-timepicker-addon';
import 'jquery-ui-timepicker-addon/dist/jquery-ui-timepicker-addon.css';
import '../base-form/base-form.scss'
import template from  './date-control.html';
import './date-control.scss';
import msgbox from '../../../lib/msgbox';

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
        //控制到年月日
        _this.el.find(".date_yy-mm-dd").val("年/月/日");
        _this.el.find(".date_yy-mm-dd").datepicker({
            monthNamesShort: [ "一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月" ],
            dayNamesMin: [ "日","一","二","三","四","五","六" ],
            changeYear:true,
            changeMonth: true,
            dateFormat: "yy/mm/dd",
            onClose: function(selectedDate) {
            },
            onSelect: function (selectTime, text) {
                _this.data.value = selectTime.replace(/\//g, "-");
                _.debounce(function(){Mediator.publish('form:changeValue:'+_this.data.tableId,_this.data)},200)();
                if( _this.data.value.length > 10 ){
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
                            _.debounce(function(){Mediator.publish('form:changeValue:'+_this.data.tableId,_this.data)},200)();
                        }
                    }else if( _this.data['timeType'] == 'before') {
                        if(selectTime > currentTime){
                            msgbox.alert("所选日期不能晚于当前日期！");
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
                _this.el.find(".date_yy-mm-dd").datepicker('show');
            });
            boolean = false;
        }else{
            _this.el.on('click','#icon_rili',function(){
                _this.el.find(".date_yy-mm-dd").datepicker('hide');
            });
             boolean = true;
        }
        _this.el.on('click','.date-close',function () {
            _this.el.find(".date_yy-mm-dd").val("年/月/日");
        })
        _.debounce(function(){Mediator.publish('form:changeValue:'+_this.data.tableId,_this.data)},200)();
    },
    beforeDestory:function(){
        Mediator.removeAll('form:changeValue:'+this.data.tableId);
        Mediator.removeAll('form:history:'+this.data.tableId);
    }
}
export default class DateControl extends Component{
    constructor(data){
        super(config,data);
    }
}