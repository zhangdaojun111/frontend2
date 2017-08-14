import Component from '../../../lib/component'
import Mediator from '../../../lib/mediator';
import 'jquery-ui/ui/widgets/datepicker';
import 'jquery-ui-timepicker-addon';
import 'jquery-ui-timepicker-addon/dist/jquery-ui-timepicker-addon.css';
let config={
    template:`<div class="clearfix">
                {{#if unvisible}}
                    <a href="javascript:void(0);" style="color:#ccc;">权限受限</a>
                 {{else if be_control_condition }}
                    <a href="javascript:void(0);" style="color:#ccc;">被修改条件限制</a>
                 {{else}}
                <input type="text" style="width: 240px" value="{{value}}" class="ui-calendar" id="date"> 
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
    },
    firstAfterRender:function(){
        let _this=this;
        this.el.on('click','.ui-history',function(){
            _.debounce(function(){Mediator.publish('form:history:'+_this.data.tableId,_this.data)},300)();
        });
    },
    afterRender:function(){
        let _this=this;
        //控制到时分秒
        _this.el.find("#date").val("年/月/日 时:分:秒");
        _this.el.find("#date").datetimepicker({
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
            onClose: function(selectedDate) {
            },
        });

        let boolean = true;
        if(boolean){
            _this.el.on('click','#icon_rili',function(){
                _this.el.find("input").datepicker('show');
            });
            boolean = false;
        }else{
            _this.el.on('click','#icon_rili',function(){
                _this.el.find("input").datepicker('hide');
            });
            boolean = true;
        }
        _this.el.on('click','.date-close',function () {
            _this.el.find("#date").val("年/月/日 时:分:秒");
        })

        _.debounce(function(){Mediator.publish('form:changeValue:'+_this.data.tableId,_this.data)},200)();

    },
    beforeDestory:function(){
        Mediator.removeAll('form:changeValue:'+this.data.tableId);
    }
}
export default class DateTimeControl extends Component{
    constructor(data){
        super(config,data);
    }
}