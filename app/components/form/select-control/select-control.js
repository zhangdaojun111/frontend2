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
            this.el.find('.add-item').css('visibility','visible')
        }
        if(this.data.history){
            this.el.find('.ui-history').css('visibility','visible');
        }
        if(!this.data.be_control_condition) {
            let el=this.el.find('.dropdown');
            let data=FormService.createSelectJson(this.data);
            data.onSelect=function(data){
                if(_this.data.isInit || !data || data.length == 0 ){
                    console.log('但是没触发onselect');
                    _this.data.value=''
                    _.debounce(function(){_this.events.changeValue(_this.data)},200)();
                    return;

                }
                _this.data.value=data[0]['id'];
                console.log('id  ',  _this.data.value)
                _.debounce(function(){_this.events.changeValue(_this.data)},200)();
                 //debugger;
            };
            let autoSelect=new AutoSelect(data);
            this.append(autoSelect,el);
            console.log('data  ',el)
        }
        this.data.isInit=false;
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