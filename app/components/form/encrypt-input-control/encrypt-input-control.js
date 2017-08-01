import Component from '../../../lib/component';
import '../../../assets/scss/control.scss'
import 'jquery-ui/ui/widgets/dialog.js';

let config={
    template:`
             <div class="clearfix">
                    {{#if be_control_condition }}
                        <a href="javascript:void(0);" style="color:#ccc;">被修改条件限制</a>
                    {{else}}                 
                  <div style="display: inline-block">{{label}}</div>               
                   <input style="width: 240px"  type="password" value="{{value}}"  >{{value}}  
                   <div style="display: inline-block">
                           {{#if required}}
                            <span class="{{requiredClass}}" ></span>
                           {{/if}} 
                   </div>                   
                   {{/if}}
                    <a  href="javascript:;" id="edit" >编辑</a>
                <div style="display:none" id="show">
                    <h4>请修改</h4>
                    <input type="password" value="{{value}}">
                    <a href="javascript:;" >确定</a>
                    <a href="javascript:;" >取消</a>
                </div>                 
               </div>   
               
                `,
    data:{
     
    },
    actions:{
    


    },
    afterRender: function() {
       this.el.on('click', ("#edit"), ()=> {
            this.el.find("#show").dialog();
            
        });     
//this.reload();

    },
}
class PasswordControl extends Component {
    constructor(data){
        super(config,data);
    }
}

export default PasswordControl