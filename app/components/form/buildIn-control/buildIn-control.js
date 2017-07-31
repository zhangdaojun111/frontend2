import Component from '../../../lib/component'
import DropDown from "../vender/dropdown/dropdown";
import Mediator from '../../../lib/mediator';

let config={
    template:`  <div class="clearfix">
                     {{#if be_control_condition }}
                    <a href="javascript:void(0);" style="color:#ccc;">被修改条件限制</a>
                    {{else}}
                    <div style="float: left">{{label}}</div>
                    <div class="dropdown" style="float: left"></div>
                    <div style="float: left;">
                        {{#if required}}
                            <span  class="{{requiredClass}}" ></span>
                        {{/if}} 
                    </div>
                    {{/if}}
                </div>`,
    data:{

    },
    actions:{

    },
    firstAfterRender:function(){
        let _this=this;
        Mediator.subscribe('form:dropDownSelect',function(data){
            if(data.dfield !=_this.data.dfield){
                return;
            }
            _this.data.value=data.value;
            console.log(_this.data.value);
            if(_this.data.required){
                Mediator.publish('form:checkRequired',data);
            }
        });
    },
    afterRender:function(){
        this.append(new DropDown(this.data),this.el.find('.dropdown'));
    }
}
export default class BuildInControl extends Component{
    constructor(data){
        super(config,data);
    }
}