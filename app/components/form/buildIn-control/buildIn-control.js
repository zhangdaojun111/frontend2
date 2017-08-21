/**
 *@author yudeping
 *内置字段控件
 */

import Component from '../../../lib/component'
import {AutoSelect} from "../../util/autoSelect/autoSelect"
import {FormService} from "../../../services/formService/formService";
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
                _.debounce(function(){_this.events.changeValue(_this.data)},200)();
            };
            let autoSelect=new AutoSelect(data);
            this.append(autoSelect,el);
        }
        this.data.isInit=false;
        _this.el.on('click','.ui-selector',_.debounce(function(){
            _this.events.selectChoose(_this.data);
        },200));
        _this.el.on('click','.ui-history',_.debounce(function(){
            _this.events.emitHistory(_this.data);
        },300));
        _this.el.on('click','.add-item',_.debounce(function(){
           _this.events.addNewBuildIn(_this.data);
        },300));
    },
    beforeDestory(){
    }
}
export default class BuildInControl extends Component{
    constructor(data,events){
        super(config,data,events);
    }
}