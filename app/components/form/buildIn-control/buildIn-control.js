import Component from '../../../lib/component'
import DropDown from "../vender/dropdown/dropdown";
import Mediator from '../../../lib/mediator';
import './buildin-control.scss'

let config={
    template:`  <div class="clearfix">
                    {{#if unvisible}}
                        <a href="javascript:void(0);" style="color:#ccc;">权限受限</a>
                    {{else if be_control_condition}}
                        <a href="javascript:void(0);" style="color:#ccc;">被修改条件限制</a>
                    {{else}}
                        <div class="dropdown" style="float: left"></div>
                        <div style="float: left;">
                            {{#if required}}
                                <span id="requiredLogo" class="{{requiredClass}}" ></span>
                            {{/if}}
                            {{#if history}}
                                       <a href="javascript:void(0);" class="ui-history"  style="vertical-align: middle;"></a>     
                            {{/if}} 
                            {{#unless is_view}}
                                <a href="javascript:void(0);" class="ui-selector" ></a>
                                {{#if can_add_item}}
                                    <a href="javascript:void(0);" class="add-item noprint"> + </a>
                                {{/if}}
                            {{/unless}} 
                        </div>
                     {{/if}}   
                </div>`,
    data:{

    },
    actions:{

    },
    firstAfterRender:function(){
        let _this=this;
        Mediator.subscribe('form:dropDownSelect:'+_this.data.tableId,function(data){
            if(data.dfield !=_this.data.dfield || !_this.data.required){
                return;
            }
            _this.data=Object.assign(_this.data,data);
            _.debounce(function(){Mediator.publish('form:changeValue:'+_this.data.tableId,_this.data)},200)();
        });
        _this.el.on('click','.ui-selector',function(){

        });
        _this.el.on('click','.ui-history',function(){
            _.debounce(function(){Mediator.publish('form:history:'+_this.data.tableId,_this.data)},300)();
        });
        _this.el.on('click','.add-item',function(){
            _.debounce(function(){Mediator.publish('form:addNewBuildIn:'+_this.data.tableId,_this.data)},300)();
        });
    },
    afterRender:function(){
        if(!this.data.be_control_condition) {
            if(this.data.options[0]['value']){
                this.data.options.unshift({label:'',value:''});
            }
            this.append(new DropDown(this.data), this.el.find('.dropdown'));
        }
    },
    beforeDestory:function(){
        Mediator.removeAll('form:dropDownSelect:'+this.data.tableId);
        Mediator.removeAll('form:changeValue:'+this.data.tableId);
    }
}
export default class BuildInControl extends Component{
    constructor(data){
        super(config,data);
        console.log('buildin')
        console.log(this.data);
    }
}