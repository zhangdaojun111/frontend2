import Component from '../../../lib/component'
import DropDown from "../vender/dropdown/dropdown";
import Mediator from '../../../lib/mediator';
import template from './select-control.html'
let config={
    template:template,
    firstAfterRender(){
        let _this=this;
        Mediator.subscribe('form:dropDownSelect:'+_this.data.tableId,function(data){
            if(data.dfield !=_this.data.dfield){
                return;
            }
            _this.data=Object.assign(_this.data,data);
            _.debounce(function(){Mediator.publish('form:changeValue:'+_this.data.tableId,_this.data)},200)();
        });
        Mediator.subscribe('form:changeOption:'+_this.data.tableId,function(data){
            if( _this.data.dfield && res == _this.data.dfield ){
                _this.data.value = [];
                _this.reload();
            }
        })
        _this.el.on('click','.add-item',function(){
            _.debounce(function(){Mediator.publish('form:addItem:'+_this.data.tableId,_this.data)},200)();
        })
        this.el.on('click','.ui-history',function(){
            _.debounce(function(){Mediator.publish('form:history:'+_this.data.tableId,_this.data)},300)();
        });
    },
    afterRender(){
        if(!this.data.be_control_condition){
            this.destroyChildren();
            this.append(new DropDown(this.data),this.el.find('.dropdown'));
        }
    },
    beforeDestory(){
        Mediator.removeAll('form:dropDownSelect:'+this.data.tableId);
        Mediator.removeAll('form:changeValue:'+this.data.tableId);
        Mediator.removeAll('form:addItem:'+this.data.tableId);
        Mediator.removeAll('form:history:'+this.data.tableId);
    }
}
export default class SelectControl extends Component{
    constructor(data){
        super(config,data);
    }
}