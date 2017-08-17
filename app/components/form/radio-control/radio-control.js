import Component from '../../../lib/component';
import Mediator from "../../../lib/mediator";
import './radio-control.scss';
import template from './radio-control.html'
let config={
    template:template,
    afterRender(){
        let _this=this;
        this.el.on('click','.df-input-radio',function(event){
            _this.data.value=event.target.value;
            _.debounce(function(){Mediator.publish('form:changeValue:'+_this.data.tableId,_this.data)},200)();
            for(let obj of _this.data.group){
                if(obj.value==event.target.value){
                    obj['checked']=true;
                }else{
                    obj['checked']=false;
                }
            }
            _this.reload();
        })

        this.el.on('click','.add-item',function(){
            _.debounce(function(){Mediator.publish('form:addItem:'+_this.data.tableId,_this.data)},200)();
        })

        Mediator.subscribe('form:changeOption:'+_this.data.tableId,function(data){
            if( _this.data.dfield && res == _this.data.dfield ){
                _this.data.value = [];
                _this.reload();
            }
        });

        this.el.on('click','.ui-history',function(){
            _.debounce(function(){Mediator.publish('form:history:'+_this.data.tableId,_this.data)},300)();
        });
        if(this.data.is_view){
            this.el.find('.df-input-radio').attr('disabled',true);
        }else{
            this.el.find('.df-input-radio').attr('disabled',false);
        }
    },
    beforeDestory(){
        Mediator.removeAll('form:changeValue:'+this.data.tableId);
        Mediator.removeAll('form:changeOption:'+this.data.tableId);
        Mediator.removeAll('form:history:'+this.data.tableId);
        Mediator.removeAll('form:addItem:'+this.data.tableId);
    }
}
class RadioControl extends Component {
    constructor(data){
        super(config,data);
    }
}

export default RadioControl