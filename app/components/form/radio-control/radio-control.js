import Component from '../../../lib/component';
import Mediator from "../../../lib/mediator";
import './radio-control.scss';
let config={
    template:`<div class="clearfix">
                 {{#if unvisible}}
                    <a href="javascript:void(0);" style="color:#ccc;">权限受限</a>
                 {{else}}                
                     {{#if be_control_condition }}
                        <a href="javascript:void(0);" style="color:#ccc;">被修改条件限制</a>
                     {{else}}
                            <div style="display: inline-block">{{label}}</div>
                            {{#group}}
                                <label class="df-input-label">
                                    <div class="df-input-radio-wrapper noprint" style="display: inline">
                                       {{#if checked}} 
                                        <div  class="df-input-radio-status"  style="display: inline"></div>
                                       {{/if}} 
                                    </div>
                                    <input class="df-input-radio print" type="radio"  value="{{value}}"  readonly >{{ label }}
                                </label>
                            {{/group}}
                            {{#if required}}
                                        <span id="requiredLogo" class="{{requiredClass}}" ></span>
                            {{/if}}  
                     {{/if}}
                 {{/if}}    
              </div>   
                `,
    data:{

    },
    actions:{
    },
    firstAfterRender:function(){
        let _this=this;
        this.el.on('click','.df-input-radio',function(event){
            _this.data.value=event.target.value;
            _.debounce(function(){Mediator.publish('form:changeValue-'+_this.data.tableId,_this.data)},200)();
            for(let obj of _this.data.group){
                if(obj.value==event.target.value){
                    obj['checked']=true;
                }else{
                    obj['checked']=false;
                }
            }
            _this.reload();
        })
        Mediator.subscribe('form:changeOption'+_this.data.tableId,function(data){
            if( _this.data.dfield && res == _this.data.dfield ){
                _this.data.value = [];
                _this.reload();
            }
        })
    }
}
class RadioControl extends Component {
    constructor(data){
        super(config,data);
        console.log('RadioControl');
        console.log(this.data);
    }
}

export default RadioControl