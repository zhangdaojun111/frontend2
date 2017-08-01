import Component from '../../../lib/component';
let config={
    template:`
                <div class="clearfix">
                    {{#if be_control_condition }}
                        <a href="javascript:void(0);" style="color:#ccc;">被修改条件限制</a>
                    {{else}}                 
                  <div style="display: inline-block">{{label}}</div>               
                   <input style="width: 240px"  type="hidden" value="{{value}}"  >{{value}}  
                   <div style="display: inline-block">
                           {{#if required}}
                            <span class="{{requiredClass}}" ></span>
                           {{/if}} 
                   </div>                   
                   {{/if}}                 
               </div>         
                `,
    data:{

    },
    actions:{
    },
}
class HiddenControl extends Component {
    constructor(data){
        super(config,data);
    }
}

export default HiddenControl