import Component from '../../../lib/component';
import Mediator from "../../../lib/mediator";
let config={
    template:`<div class="clearfix">
                 {{#if be_control_condition }}
                    <a href="javascript:void(0);" style="color:#ccc;">被修改条件限制</a>
                 {{else}}
                        <div style="display: inline-block">{{label}}</div>
                       {{#group}}
                            <input type="radio" value="{{this.value}}" name="{{this.name}}"/>{{this.label}}
                        {{/group}}
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
        this.el.on('click',function(){
            console.log('1111111');
            _this.data.value='943_GHYY9WLbjMimbwQrQmkJSB';
            Mediator.publish('form:changeValue',_this.data);
        })
    }
}
class RadioControl extends Component {
    constructor(data){
        super(config,data);
    }
}

export default RadioControl