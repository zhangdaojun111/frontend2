import Component from '../../../lib/component'
import Mediator from '../../../lib/mediator';
import 'jquery-ui/ui/widgets/datepicker';
import 'jquery-ui-timepicker-addon';
import 'jquery-ui-timepicker-addon/dist/jquery-ui-timepicker-addon.css';
import '../base-form/base-form.scss'
import './data-control-alert.html'
let config={
    template:`<div class="clearfix">
                {{#if unvisible}}
                    <a href="javascript:void(0);" style="color:#ccc;">权限受限</a>
                 {{else if be_control_condition }}
                    <a href="javascript:void(0);" style="color:#ccc;">被修改条件限制</a>
                 {{else}}
                <input type="text" style="width: 240px" value="{{value}}" class="ui-calendar date_yy-mm-dd">                  
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
            let valInput = _this.el.find(".date_yy-mm-dd").val();
            this.data.value=valInput;
            //timeType 是否可以选择之前的日期，before:只能选择之前的日期，after：只能选择之后的，all：可以选择全部
            let currentTime = new Date().getTime();
            let valTime = new Date(this.data.value).getTime();
            if(this.data['timeType']){
                if(this.data['timeType'] == 'after'){
                    if(valTime < currentTime){
                        _.debounce(function(){Mediator.publish('form:alertDateFuture:'+_this.data.tableId,_this.data)},200)();
                        //alert("所选日期不能早于当前日期！");
                        console.log("早")
                    }
                }else if(this.data['timeType'] == 'before') {
                    if(valTime > currentTime){
                           _.debounce(function(){Mediator.publish('form:alertDateHistory:'+_this.data.tableId,_this.data)},200)();
                        //alert("所选日期不能晚于当前日期！");
                        console.log("晚")
                    }
                }
            }else{
                console.error('数据错误，该项应该有名为isAllowChooseBefore的属性！',this.selector);
            }

        }
    },
    firstAfterRender:function(){
        let _this=this;
        this.el.on('click','.ui-history',function(){
            _.debounce(function(){Mediator.publish('form:history:'+_this.data.tableId,_this.data)},300)();
        });
    },
    afterRender:function(){
        let _this=this;
        // this.el.find(".date_yy-mm-dd").on("click", function () {
        //     _this.el.find(".date_yy-mm-dd").val("年/月/日");
        //     //增加0
        //     function p(s) {
        //         return s < 10 ? '0' + s: s;
        //     }
        //     //获取当前时间
        //    let myDate = new Date();
        //    let y=myDate.getFullYear();
        //     let m=myDate.getMonth();
        //    let d=myDate.getDate();
        //    let now=y+'/'+p(m)+"/"+p(d);
        //    let nowTime = $(".date_yy-mm-dd").val(now);
        //     event.stopPropagation();
        // })
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
        //无法绑定到当前td,暂时先绑定到当前input
        // _this.el.find('input').parent('div').parent('div').parent('td').parent('tr').parent('tbody').parent('table').parent('div').parent('div').siblings('div#ui-datepicker-div').find('table.ui-datepicker-calendar>tbody>tr>td').on('click',function () {
        //    console.log('绑上了ma ')
        //     _this.actions.onSelect();
        // })
        this.el.on( 'click','input',function () {
            _this.actions.onSelect();
        });
    },
    beforeDestory:function(){
        //_this.el.find('input').parent('div').parent('div').parent('td').parent('tr').parent('tbody').parent('table').parent('div').parent('div').siblings('div#ui-datepicker-div').off('click')
        Mediator.removeAll('form:changeValue:'+this.data.tableId);
    }
}
export default class DateControl extends Component{
    constructor(data){
        super(config,data);
    }
}