import Component from '../../../lib/component'
import DropDown from "../vender/dropdown/dropdown";
import Mediator from '../../../lib/mediator';
import '../base-form/base-form.scss';
let config={
    template:`<div class="display:block">
                 {{#if unvisible}}
                    <a href="javascript:void(0);" style="color:#ccc;">权限受限</a>
                 {{else if be_control_condition}}
                        <a href="javascript:void(0);" style="color:#ccc;">被修改条件限制</a>
                 {{else}}
                        <div class="dropdown " style="width:{{width}}; float: left"></div>
                        <div style="float: left; ">
                           {{#if required}}
                                    <span id="requiredLogo" class="{{requiredClass}}" ></span>
                           {{/if}}
                           {{#if history}}
                               <a href="javascript:void(0);" class="ui-history"  style="vertical-align: middle;"></a>     
                            {{/if}}      
                        </div>      
                        {{#if is_view}}
                        {{else}}
                            {{#if can_add_item}}
                                <a  href="javascript:void(0);" class="add-item noprint" style="margin-left: 15px"> + </a>
                            {{/if}}
                        {{/if}}               
                 {{/if}}  
            </div>`,
    data:{
        width:'240px',
    },
    actions:{

    },
    firstAfterRender:function(){
        let _this=this;
        Mediator.subscribe('form:dropDownSelect:'+_this.data.tableId,function(data){
            if(data.dfield !=_this.data.dfield){
                return;
            }
            _this.data=Object.assign(_this.data,data);
            _.debounce(function(){Mediator.publish('form:changeValue:'+_this.data.tableId,_this.data)},200)();
        });
        Mediator.subscribe('form:changeOption:'+_this.data.tableId,function(data){
            if( _this.data.dfield && res == _this.data.dfield ){
                _this.data.value = [];
                _this.reload();

            }
        })
        _this.el.on('click','.add-item',function(){
            _.debounce(function(){Mediator.publish('form:addItem:'+_this.data.tableId,_this.data)},200)();
        })
        this.el.on('click','.ui-history',function(){
            _.debounce(function(){Mediator.publish('form:history:'+_this.data.tableId,_this.data)},300)();
        });
    },
    afterRender:function(){
        if(!this.data.be_control_condition){
            this.append(new DropDown(this.data),this.el.find('.dropdown'));
        }
    },
    beforeDestory:function(){
        Mediator.removeAll('form:dropDownSelect:'+this.data.tableId);
        Mediator.removeAll('form:changeValue:'+this.data.tableId);
    }
}
export default class SelectControl extends Component{
    constructor(data){
        super(config,data);
        console.log('select');
        console.log(this.data);
    }
}