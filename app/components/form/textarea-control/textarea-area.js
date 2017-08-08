import Component from '../../../lib/component';
let config={
    template:`
              <div class="clearfix">
                {{#if be_control_condition }}
                    <a href="javascript:void(0);" style="color:#ccc;">被修改条件限制</a>
                 {{else}}
                   <div style="display: inline-block">{{label}}</div>
                    <input type="textarea" value="{{value}}" style=" height: 100px;  color: rgb(0, 0, 0); width: 100%;"/>
                    {{#if required}}
                    <div style="float: left;">                       
                        <span id="requiredLogo" class="{{requiredClass}}" ></span>               
                    </div>
                    {{/if}}      
                 {{/if}}   
              </div>
                `,
    data:{
        label:'',
        vale:'',
    },
    actions:{
    },
}
class TextAreaControl extends Component {
    constructor(data){
        super(config,data);
        console.log(this.data);
    }
}

export default TextAreaControl