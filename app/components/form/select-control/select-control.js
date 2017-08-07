import Component from '../../../lib/component'
import DropDown from "../vender/dropdown/dropdown";
import Mediator from '../../../lib/mediator';

let config={
    template:`<div class="clearfix">
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
        Mediator.subscribe('form:dropDownSelect'+_this.data.tableId,function(data){
            if(data.dfield !=_this.data.dfield){
                return;
            }
            _this.data=Object.assign(_this.data,data);
            Mediator.publish('form:changeValue-'+_this.data.tableId,_this.data);
        });
        Mediator.subscribe('form:changeOption'+_this.data.tableId,function(data){
            if( _this.data.dfield && res == _this.data.dfield ){
                _this.data.value = [];
                _this.reload();

            }
        })
    },
    afterRender:function(){
        if(!this.data.be_control_condition){
            this.append(new DropDown(this.data),this.el.find('.dropdown'));
        }
    }
}
export default class SelectControl extends Component{
    constructor(data){
        super(config,data);
        console.log('select');
        console.log(this.data);
    }
}