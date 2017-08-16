import Component from '../../../lib/component';
import Mediator from '../../../lib/mediator';
import template from './textarea-control.html'
let config={
    template:template,
    firstAfterRender(){
        let _this=this;
        _this.el.on('input','input',_.debounce(function(){
            _this.data.value=$(this).val();
            Mediator.publish('form:changeValue:'+_this.data.tableId,_this.data);
        },300));
        _this.el.on('click','.ui-history',function(){
            _.debounce(function(){Mediator.publish('form:history:'+_this.data.tableId,_this.data)},300)();
        });
    },
    afterRender(){
        this.el.find('.ui-width').css('width',this.data.width);
        if(this.data.is_view){
            this.el.find('.ui-width').attr('disabled',true);
        }else{
            this.el.find('.ui-width').attr('disabled',false);
        }
    },
    beforeDestory(){
      Mediator.removeAll('form:history:'+_this.data.tableId);
      Mediator.removeAll('form:changeValue:'+_this.data.tableId);
    }
}
class TextAreaControl extends Component {
    constructor(data){
        super(config,data);
    }
}

export default TextAreaControl