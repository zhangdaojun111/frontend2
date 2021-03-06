/**
 *@author yudeping
 *年份控件
 */
import Component from '../../../lib/component'
import {AutoSelect} from "../../util/autoSelect/autoSelect"
import {FormService} from "../../../services/formService/formService";
import template from './year-control.html'

let config={
    template:template,
    data:{
        options:[],
    },
    binds:[
        {
            event: 'click',
            selector: '.ui-history',
            callback: function(){
                this.events.emitHistory(this.data);
            }
        }
    ],
    afterRender(){
        let myDate = new Date();
        let myYear = myDate.getFullYear();
        this.data.options = [];
        for( let i=5;i>=-10;i-- ){
            this.data.options.push( { "label": String(myYear + i),"value": String(myYear + i)} );
        }
        if(this.data.value == ''){
            this.data.value = myYear;
        }
        this.data.options.unshift({"label":"请选择","value":"请选择"});

        let _this=this;
        this.data.isInit=true;
        if(this.data.history){
            this.el.find('.ui-history').css('visibility','visible');
        }
        if (this.data.is_view) {
            for(let k in this.data.options) {
                if(this.data.value == this.data.options[k].value) {
                    this.el.find('.dropdown').attr('title',this.data.options[k].label)
                }
            }
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
            let autoSelect=new AutoSelect({data:data});
            this.append(autoSelect,el);
        }
        this.data.isInit=false;
    },
    beforeDestory(){
        this.el.off();
    }
}
let YearControl = Component.extend(config)
export default YearControl;