import Component from '../../../lib/component'
import DropDown from "../vender/dropdown/dropdown";
import Mediator from '../../../lib/mediator';

let config={
    template:`  <div class="clearfix">
                    {{#if unvisible}}
                        <a href="javascript:void(0);" style="color:#ccc;">权限受限</a>
                    {{else}}
                        {{#if be_control_condition }}
                        <a href="javascript:void(0);" style="color:#ccc;">被修改条件限制</a>
                        {{else}}
                        <div style="float: left">{{label}}</div>
                        <div class="dropdown" style="float: left"></div>
                        <div style="float: left;">
                            {{#if required}}
                                <span id="requiredLogo" class="{{requiredClass}}" ></span>
                            {{/if}} 
                        </div>
                        {{/if}}
                     {{/if}}   
                </div>`,
    data:{

    },
    actions:{

    },
    firstAfterRender:function(){
        let _this=this;
        Mediator.subscribe('form:dropDownSelect',function(data){
            if(data.dfield !=_this.data.dfield || !_this.data.required){
                return;
            }
            _this.data=Object.assign(_this.data,data);

            Mediator.publish('form:changeValue',_this.data);
        });
    },
    afterRender:function(){
        if(!this.data.be_control_condition) {
            if(this.data.options[0]['value']){
                this.data.options.unshift({label:'',value:''});
            }
            this.append(new DropDown(this.data), this.el.find('.dropdown'));
        }
    }
}
export default class BuildInControl extends Component{
    constructor(data){
        super(config,data);
        console.log('buildin')
        console.log(this.data);
    }
}