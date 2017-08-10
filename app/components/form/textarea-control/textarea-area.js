import Component from '../../../lib/component';
import Mediator from '../../../lib/mediator';
let config={
    template:`
              <div class="clearfix">
                {{#if unvisible}}
                        <a href="javascript:void(0);" style="color:#ccc;">权限受限</a>
                {{else if be_control_condition }}
                    <a href="javascript:void(0);" style="color:#ccc;">被修改条件限制</a>
                 {{else}}
                   <div style="display: inline-block">{{label}}</div>
                    <input type="textarea" value="{{value}}" style=" height: 100px;  color: rgb(0, 0, 0); width: 240px;"/>
                    {{#if required}}
                    <div style="float: left;">                       
                        <span id="requiredLogo" class="{{requiredClass}}" ></span>               
                    </div>
                    {{/if}}      
                 {{/if}}   
              </div>
                `,
    data:{
    },
    actions:{
    },
    firstAfterRender(){
        let _this=this;
        _this.el.on('input','input',_.debounce(function(){
            _this.data.value=$(this).val();
            Mediator.publish('form:changeValue:'+_this.data.tableId,_this.data);
        },300));
    }
}
class TextAreaControl extends Component {
    constructor(data){
        super(config,data);
        // console.log(this.data);
    }
}

export default TextAreaControl