import Component from '../../../lib/component'
import Mediator from '../../../lib/mediator';
import template from './select-control.html'
import {AutoSelect} from "../../util/autoSelect/autoSelect"
import {FormService} from "../../../services/formService/formService";
let config={
    template:template,
    firstAfterRender(){
        let _this=this;
        Mediator.subscribe('form:changeOption:'+_this.data.tableId,function(data){
            if( _this.data.dfield && res == _this.data.dfield ){
                _this.data.value = [];
                _this.data._autoSelect.data.choosed=[];
                _this.reload();
            }
        })
        this.el.on('click','.add-item',function(){
            _.debounce(function(){Mediator.publish('form:addItem:'+_this.data.tableId,_this.data)},200)();
        })
        this.el.on('click','.ui-history',function(){
            _.debounce(function(){Mediator.publish('form:history:'+_this.data.tableId,_this.data)},300)();
        });
    },
    afterRender(){
        let _this=this;
        if(!this.data.be_control_condition){
            let el=this.el.find('.dropdown');
            if(this._autoSelect){
                this._autoSelect.render(el);
            }else{
                let data=FormService.createSelectJson(this.data);
                data.onSelect=function(){
                    if(!_this._autoSelect || _this._autoSelect.data.choosed.length == 0){
                        return;
                    }
                    _this.data.value=_this._autoSelect.data.choosed[0]['id'];
                    _.debounce(function(){Mediator.publish('form:changeValue:'+_this.data.tableId,_this.data)},200)();
                };
                let autoSelect=new AutoSelect(data);
                this._autoSelect=autoSelect;
                this.destroyChildren();
                autoSelect.render(el);
            }
        }
    },
    beforeDestory(){
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