import Component from '../../../lib/component'
import {AutoSelect} from "../../util/autoSelect/autoSelect"
import {FormService} from "../../../services/formService/formService";
import Mediator from '../../../lib/mediator';
import './buildin-control.scss';
import template from './buildIn-control.html';

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