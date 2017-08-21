/**
 *@author yudeping
 *下拉框控件
 */


import Component from '../../../lib/component'
import template from './select-control.html'
import {AutoSelect} from "../../util/autoSelect/autoSelect"
import {FormService} from "../../../services/formService/formService";
let config={
    template:template,
    actions:{
        changeOption(res){
            if( _this.data.dfield && res == _this.data.dfield ){
                _this.data.value = [];
                _this.reload();
            }
        }
    },
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
        this.el.on('click','.add-item',_.debounce(function(){
            _this.events.addItem(_this.data);
        },200))
        this.el.on('click','.ui-history',_.debounce(function(){
            _this.events.emitHistory(_this.data);
        },300));
    },
    beforeDestory(){
       this.el.off();
    }
}
export default class SelectControl extends Component{
    constructor(data,events){
        super(config,data,events);
    }
}