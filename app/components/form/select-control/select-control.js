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
            if( this.data.dfield && res == this.data.dfield ){
                this.data.value = [];
                this.reload();
            }
        }
    },
    binds:[
        {
            event: 'click',
            selector: '.ui-history',
            callback: function(){
                this.events.emitHistory(this.data);
            }
        },
        {
            event: 'click',
            selector: '.add-item',
            callback: function(){
                this.events.addItem(this.data)
            }
        }
    ],
    afterRender(){
        let _this=this;
        this.data.isInit=true;
        if(!this.data.is_view && this.data.can_add_item){
            this.el.find('.add-item').css('visibility','visible').addClass('icon-fl')
        }
        if(this.data.is_view){
            for(let k in this.data.options) {
                if(this.data.value == this.data.options[k].value) {
                    this.el.find('.dropdown').attr('title',this.data.options[k].label)
                }
            }
        }
        if(this.data.history){
            this.el.find('.ui-history').css('visibility','visible').addClass('icon-fl');
        }
        if(!this.data.be_control_condition) {
            let el=this.el.find('.dropdown');
            let data=FormService.createSelectJson(this.data);
            data.onSelect=function(data){
                if(_this.data.isInit || !data || data.length == 0 ){
                    console.log('但是没触发onselect');
                    if(!_this.data.isInit){
                        _this.data.value='';
                        _.debounce(function(){_this.events.changeValue(_this.data)},200)();
                    }
                    return;
                }
                _this.data.value=data[0]['id'];
                _.debounce(function(){_this.events.changeValue(_this.data)},200)();
            };
            let autoSelect=new AutoSelect(data);
            this.append(autoSelect,el);
        }
        this.data.isInit=false;
    },
    beforeDestory(){
       this.el.off();
    }
}
let SelectControl = Component.extend(config)
export default SelectControl