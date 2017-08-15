import Component from '../../../lib/component'
import Mediator from '../../../lib/mediator';
import {AutoSelect} from '../../util/autoSelect/autoSelect'

let config={
    template:`  <div class="clearfix">
                    {{#if unvisible}}
                        <a href="javascript:void(0);" style="color:#ccc;">权限受限</a>
                    {{else if be_control_condition}}
                            <a href="javascript:void(0);" style="color:#ccc;">被修改条件限制</a>
                    {{else}}
                        <div id="multi-select"></div>
                        <div style="float: left;">
                            {{#if required}}
                                <span id="requiredLogo" class="required" ></span>
                            {{/if}} 
                        </div>   
                    {{/if}}
                </div>`,
    firstAfterRender:function(){
        let _this=this;
        let $wrap = this.el.find('#multi-select');
        let list=[];
        for(let key in this.data.options){
            console.log(this.data.options[key]);
            list.push({
                name:this.data.options[key].label,
                id:this.data.options[key].value,
            });
        }
        let autoSelect = new AutoSelect({list:list});
        autoSelect.render($wrap);
        Mediator.subscribe('form:changeOption:'+_this.data.tableId,function(data){
            if( _this.data.dfield && res == _this.data.dfield ){
                _this.data.value = [];
                _this.reload();
            }
        })
    },
    beforeDestory:function(){
        Mediator.removeAll('form:changeOption:'+this.data.tableId);
    }
}
export default class MultiSelectControl extends Component{
    constructor(data){
        super(config,data);
    }
}