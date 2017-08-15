import Component from '../../../lib/component'
import Mediator from '../../../lib/mediator'
import {AutoSelect} from '../../util/autoSelect/autoSelect'
import {FormService} from '../../../services/formService/formService'
import template from './multi-select-control.html'

let config={
    template:template,
    actions:{
        setValue(){
            let values=[];
            for(let key in this._autoSelect.data.choosed){
                values.push(this._autoSelect.data.choosed[key]['id']);
            }
            this.data.value=values;
        }
    },
    firstAfterRender:function(){
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
            let el=this.el.find('#multi-select');
            if(this._autoSelect){
                this._autoSelect.render(el);
            }else{
                let data=FormService.createSelectJson(this.data,'multi');
                data.onSelect=function(data){
                    if(!_this._autoSelect || _this._autoSelect.data.choosed.length == 0){
                        return;
                    }
                    _this.actions.setValue();
                    _.debounce(function(){Mediator.publish('form:changeValue:'+_this.data.tableId,_this.data)},200)();
                };
                let autoSelect=new AutoSelect(data);
                this._autoSelect=autoSelect;
                this.destroyChildren();
                autoSelect.render(el);
            }
        }
    },
    beforeDestory:function(){
        Mediator.removeAll('form:changeOption:'+this.data.tableId);
    }
}
export default class MultiSelectControl extends Component{
    constructor(data){
        super(config,data);
    }
}