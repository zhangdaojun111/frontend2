import Component from '../../../lib/component'
import DropDown from '../vender/dropdown/dropdown'
import Mediator from '../../../lib/mediator';

let config={
    template:`<div style="dispaly:inline">
                {{#if unvisible}}
                        <a href="javascript:void(0);" style="color:#ccc;">权限受限</a>
                {{else if be_control_condition }}
                    <a href="javascript:void(0);" style="color:#ccc;">被修改条件限制</a>
                 {{else}}
                    <div class="dropdown" style="width:{{width}}"></div>
                    <div style="float: left;">
                       {{#if required}}
                        <span id="requiredLogo" class="{{requiredClass}}" ></span>
                       {{/if}}
                       {{#if history}}
                            <a href="javascript:void(0);" class="ui-history"  style="vertical-align: middle;"></a>     
                        {{/if}}                         
                    </div>
                 {{/if}}   
              </div>
                `,
    data:{
        width:'240px',
        options:[],
    },
    firstAfterRender:function(){
        let _this=this;
        Mediator.subscribe('form:dropDownSelect:'+_this.data.tableId,function(data){
            if(data.dfield !=_this.data.dfield || !_this.data.required){
                return;
            }
            _this.data.value=data.value;
            _.debounce(function(){Mediator.publish('form:changeValue:'+_this.data.tableId,_this.data)},200)();
        });
        this.el.on('click','.ui-history',function(){
            _.debounce(function(){Mediator.publish('form:history:'+_this.data.tableId,_this.data)},300)();
        });
    },
    afterRender:function(){
        if(!this.data.be_control_condition) {
            this.append(new DropDown(this.data), this.el.find('.dropdown'));
        }
    },
    beforeDestory:function(){
        Mediator.removeAll('form:dropDownSelect:'+this.data.tableId);
        Mediator.removeAll('form:changeValue:'+this.data.tableId);
    }
}
export default class YearControl extends Component{
    constructor(data){
        let myDate = new Date();
        let myYear = myDate.getFullYear();
        for( let i=5;i>=-10;i-- ){
            config.data.options.push( { "label": String(myYear + i),"value": String(myYear + i),"tableId":data.tableId} );
        }
        config.data.options.unshift({"label":"请选择","value":"请选择"});
        if(data.value){
            data.showValue=data.value;
        }
        super(config,data);
    }
}