import Component from '../../../lib/component'
import {AutoSelect} from "../../util/autoSelect/autoSelect"
import {FormService} from "../../../services/formService/formService";
import Mediator from '../../../lib/mediator';
import './buildin-control.scss';
import template from './buildIn-control.html';

let config={
    template:template,
    firstAfterRender(){
        let _this=this;
        _this.el.on('click','.ui-selector',function(){
            _.debounce(function(){Mediator.publish('form:selectChoose:'+_this.data.tableId,_this.data)},200)();
        });
        _this.el.on('click','.ui-history',function(){
            _.debounce(function(){Mediator.publish('form:history:'+_this.data.tableId,_this.data)},300)();
        });
        _this.el.on('click','.add-item',function(){
            _.debounce(function(){Mediator.publish('form:addNewBuildIn:'+_this.data.tableId,_this.data)},300)();
        });
    },
    afterRender(){
        let _this=this;
        if(!this.data.be_control_condition) {
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
        Mediator.removeAll('form:history:'+this.data.tableId);
        Mediator.removeAll('form:addNewBuildIn:'+this.data.tableId);
        Mediator.removeAll('form:selectChoose:'+this.data.tableId);
    }
}
export default class BuildInControl extends Component{
    constructor(data){
        super(config,data);
    }
}