import Component from '../../../lib/component'
import Mediator from '../../../lib/mediator';
import template from './select-control.html'
import {AutoSelect} from "../../util/autoSelect/autoSelect"
import {FormService} from "../../../services/formService/formService";
let config={
    template:template,
    afterRender(){
        let _this=this;
        this.data.isInit=true;
        if(!this.data.be_control_condition) {
            let el=this.el.find('.dropdown');
            let data=FormService.createSelectJson(this.data);
            data.onSelect=function(data){
                if(_this.data.isInit || !data || data.length == 0 ){
                    return;
                }
                _this.data.value=data[0]['id'];
                _.debounce(function(){Mediator.publish('form:changeValue:'+_this.data.tableId,_this.data)},200)();
            };
            let autoSelect=new AutoSelect(data);
            this.append(autoSelect,el);
        }
        this.data.isInit=false;
        Mediator.subscribe('form:changeOption:'+_this.data.tableId,function(res){
            if( _this.data.dfield && res == _this.data.dfield ){
                _this.data.value = [];
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