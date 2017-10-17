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
    binds:[
        {
            event: 'click',
            selector: '.ui-selector',
            callback: function(){
                this.events.selectChoose(this.data);
            }
        },
        {
            event: 'click',
            selector: '.ui-history',
            callback: function(){
                this.events.emitHistory(this.data)
            }
        },
        {
            event: 'click',
            selector: '.add-item',
            callback: function(){
                this.events.addNewBuildIn(this.data);
            }
        }
    ],
    afterRender(){
        let _this=this;
        this.data.isInit=true;
        if(!this.data.is_view && this.data.can_add_item){
            this.el.find('.add-item').css('visibility','visible').addClass('icon-fl');
        }
        if(!this.data.is_view){
            this.el.find('.ui-selector').css('visibility','visible').addClass('icon-fl');
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
export default class BuildInControl extends Component{
    constructor(data,events){
        super(config,data,events);
    }
}