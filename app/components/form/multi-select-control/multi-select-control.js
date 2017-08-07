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
                            <div id="MainContent_Caccey_location_ddl"></div>
                            <div style="float: left;">
                                {{#if required}}
                                    <span id="requiredLogo" class="required" ></span>
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
        $('#MainContent_Caccey_location_ddl').multiselect({
            includeSelectAllOption: true,
            enableFiltering: true,
            maxHeight: 400,
            numberDisplayed: 1
        });
        Mediator.subscribe('form:valueChange',function(data){
            if(data.dfield !=_this.data.dfield){
                return;
            }
            _this.data.value=data.value;
            //重置必填样式
            if(data.value=='' || data.value.length ==0 || data.value==null){
                _this.el.find('#requiredLogo').get(0).className='required';
            }else{
                _this.el.find('#requiredLogo').get(0).className='required2';
            }
        });
        Mediator.subscribe('form:changeOption:'+_this.data.tableId,function(data){
            if( _this.data.dfield && res == _this.data.dfield ){
                _this.data.value = [];
                _this.reload();
            }
        })
    },
    beforeDestory:function(){
        Mediator.removeAll('form:changeOption:'+this.data.tableId);
        Mediator.removeAll('form:changeValue:'+this.data.tableId);
    }
}
export default class MultiSelectControl extends Component{
    constructor(data){
        super(config,data);
    }
}