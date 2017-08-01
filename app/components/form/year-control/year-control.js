import Component from '../../../lib/component'
import DropDown from '../vender/dropdown/dropdown'
import Mediator from '../../../lib/mediator';

let config={
    template:`<div class="clearfix">
                {{#if be_control_condition }}
                    <a href="javascript:void(0);" style="color:#ccc;">被修改条件限制</a>
                 {{else}}
                    <div style="float: left">{{label}}</div>
                    <div class="dropdown" style="float: left"></div>
                    <div style="float: left;">
                       {{#if required}}
                        <span class="{{requiredClass}}" ></span>
                       {{/if}}                     
                    </div>
                 {{/if}}   
              </div>
                `,
    data:{
        options:[],
    },
    firstAfterRender:function(){
        let _this=this;
        Mediator.subscribe('form:dropDownSelect',function(data){
            if(data.dfield !=_this.data.dfield || !_this.data.required){
                return;
            }
            _this.data.value=data.value;
            Mediator.publish('form:changeValue',_this.data);
        });
    },
    afterRender:function(){
        if(!this.data.be_control_condition) {
            this.append(new DropDown(this.data), this.el.find('.dropdown'));
        }
    }
}
export default class YearControl extends Component{
    constructor(data){
        let myDate = new Date();
        let myYear = myDate.getFullYear();
        for( let i=5;i>=-10;i-- ){
            config.data.options.push( { "label": String(myYear + i),"value": String(myYear + i)} );
        }
        config.data.options.unshift({"label":"请选择","value":"请选择"});
        if(data.value){
            data['showValue']=data.value;
        }
        super(config,data);
    }
}