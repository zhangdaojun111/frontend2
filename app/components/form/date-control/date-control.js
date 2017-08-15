import Component from '../../../lib/component'
import Mediator from '../../../lib/mediator';
import 'jquery-ui/ui/widgets/datepicker';
import 'jquery-ui-timepicker-addon';
import 'jquery-ui-timepicker-addon/dist/jquery-ui-timepicker-addon.css';
import template from  './date-control.html';
import './date-control.scss';
let config={
    template:template,
    data:{
        width:'240px'
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
        _this.el.find("#date_yy-mm-dd").val("年/月/日");
        _this.el.find("#date_yy-mm-dd").datepicker({
            monthNamesShort: [ "一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月" ],
            dayNamesMin: [ "日","一","二","三","四","五","六" ],
            changeYear:true,
            changeMonth: true,
            dateFormat: "yy/mm/dd",
            onClose: function(selectedDate) {
            }
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
            _this.el.find("#date_yy-mm-dd").val("年/月/日");
        })

        _.debounce(function(){Mediator.publish('form:changeValue:'+_this.data.tableId,_this.data)},200)();

    },
    beforeDestory(){
        Mediator.removeAll('form:changeValue:'+this.data.tableId);
        Mediator.removeAll('form:history:'+this.data.tableId);
    }
}
export default class DateControl extends Component{
    constructor(data){
        super(config,data);
    }
}