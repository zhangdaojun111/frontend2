import Component from '../../../lib/component'
import DropDown from '../vender/dropdown/dropdown'
import Mediator from '../../../lib/mediator';

let config={
    template:`<div class="clearfix">
                <div style="float: left">{{label}}</div>
                <div class="dropdown" style="float: left"></div>
              <div style="float: left;">
                   {{#if required}}
                    <span class="{{requiredClass}}" ></span>
                   {{/if}} 
              </div>
              </div>
                `,
    data:{
        options:[],
    },
    firstAfterRender:function(){
        let _this=this;
        Mediator.subscribe('form:dropDownSelect',function(data){
            if(data.dfield !=_this.data.dfield){
                return;
            }
            _this.data.value=data.value;
            if(_this.data.required){
                Mediator.publish('form:checkRequired',data);
            }
        });
    },
    afterRender:function(){
        this.append(new DropDown(this.data),this.el.find('.dropdown'));
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
        super(config,data);
    }
}