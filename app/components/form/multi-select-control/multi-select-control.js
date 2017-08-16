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
            for(let key in this.childSelect.data.choosed){
                values.push(this.childSelect.data.choosed[key]['id']);
            }
            this.data.value=values;
        }
    },
    firstAfterRender:function(){
        let _this=this;
        Mediator.subscribe('form:changeOption:'+_this.data.tableId,function(data){
            if( _this.data.dfield && res == _this.data.dfield ){
                _this.data.value = [];
                _this.childSelect.data.choosed=[];
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
        this.data.isInit=true;
        if(!this.data.be_control_condition) {
            this.set('childSelect', {});
            let el=this.el.find('#multi-select');
            if(this.data.options[0]['label'] == '-'){
                this.data.options[0]['value']='-';
            }
            let data=FormService.createSelectJson(this.data,true);
            data.onSelect=function(){
                if(_this.data.isInit || !_this.childSelect || _this.childSelect.data.choosed.length == 0 ){
                    return;
                }
                _this.actions.setValue();
                _.debounce(function(){Mediator.publish('form:changeValue:'+_this.data.tableId,_this.data)},200)();
            };
            let autoSelect=new AutoSelect(data);
            this.childSelect=autoSelect;
            this.append(autoSelect,el);
        }
        this.data.isInit=false;
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