import Component from '../../../lib/component'
import Mediator from '../../../lib/mediator';
import 'jquery-ui/ui/widgets/datepicker';
import 'jquery-ui-timepicker-addon';
import 'jquery-ui-timepicker-addon/dist/jquery-ui-timepicker-addon.css';
import 'jquery-ui';
import '../base-form/base-form.scss'
import '../date-control/data-control-alert.html'
let config={
    template:`<div class="clearfix">
                {{#if unvisible}}
                    <a href="javascript:void(0);" style="color:#ccc;">权限受限</a>
                 {{else if be_control_condition }}
                    <a href="javascript:void(0);" style="color:#ccc;">被修改条件限制</a>
                 {{else}}
                <input type="text" style="width: 240px" value="{{value}}" class="ui-calendar datetime" > 
                <span class="date-close">X</span>
                <span style="" id="icon_rili">日历</span>
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
        onSelect:function(val) {
            let _this = this;
            let valInput = _this.el.find(".datetime").val();
            this.data.value=valInput;
            //timeType 是否可以选择之前的日期，before:只能选择之前的日期，after：只能选择之后的，all：可以选择全部
            let currentTime = new Date().getTime();
            let valTime = new Date(this.data.value).getTime();
            if(this.data['timeType']){
                if(this.data['timeType'] == 'after'){
                    if(valTime < currentTime){
                        _.debounce(function(){Mediator.publish('form:alertDateFuture:'+_this.data.tableId,_this.data)},200)();
                    }
                }else if(this.data['timeType'] == 'before') {
                    if(valTime > currentTime){
                        _.debounce(function(){Mediator.publish('form:alertDateHistory:'+_this.data.tableId,_this.data)},200)();
                    }
                }
            }else{
                console.error('数据错误，该项应该有名为isAllowChooseBefore的属性！',this.selector);
            }
        }
    },
    afterRender:function(){
        let _this=this;
        this.el.on('click','.ui-history',function(){
            _.debounce(function(){Mediator.publish('form:history:'+_this.data.tableId,_this.data)},300)();
        });
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
            onSelect: function(dateText, inst){//选中事件
                console.log("onselect, dateText",dateText);
                console.log("onselect, inst",inst);
            },
            onClose : function(dateText, inst){//当日期面板关闭后触发此事件（无论是否有选择日期）
                console.log("onClose, dateText",dateText);
                console.log("onClose, inst",inst);
            }
            // controlType: 'slider',
            // stepHour: 1,
            // stepMinute: 1,
            // stepSecond: 1,
            // //addSliderAccess: true,
            // closeOnDateSelect: true,
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
        _this.el.find('.datetime','input',function(event){
            console.log('1111111')
            console.log('1111111')
            console.log('1111111')
            console.log('1111111')
        })

        $('#ui-datepicker-div').on('click',function () {
            console.log($('#ui-datepicker-div'));
            _this.actions.onSelect();
        });
        //无法绑定到当前td，暂时先绑定到input
        // _this.el.find('input').parent('div').parent('div').parent('td').parent('tr').parent('tbody').parent('table').parent('div').parent('div').siblings('div#ui-datepicker-div').on('click',function () {
        //     _this.actions.onSelect();
        // });
        _.debounce(function(){Mediator.publish('form:changeValue:'+_this.data.tableId,_this.data)},200)();
    },
    beforeDestory:function(){
        _this.el.find('input').parent('div').parent('div').parent('td').parent('tr').parent('tbody').parent('table').parent('div').parent('div').siblings('div#ui-datepicker-div').off('click');
        Mediator.removeAll('form:changeValue:'+this.data.tableId);
    }
}
export default class DateTimeControl extends Component{
    constructor(data){
        super(config,data);
    }
}