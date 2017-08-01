import Component from '../../../lib/component';
import '../../../assets/scss/control.scss'
import 'jquery-ui/ui/widgets/dialog.js';
import Mediator from '../../../lib/mediator';
let config={
    template:`
             <div class="clearfix">
                    {{#if be_control_condition }}
                        <a href="javascript:void(0);" style="color:#ccc;">被修改条件限制</a>
                    {{else}}                 
                  <div style="display: inline-block">{{label}}</div>               
                   <input style="width: 240px"  type="password"  value="{{value}}"  readonly >{{value}}  
                   <div style="display: inline-block">
                           {{#if required}}
                            <span class="{{requiredClass}}" ></span>
                           {{/if}} 
                   </div>                   
                   {{/if}}
                    <a  href="javascript:;" id="edit" >编辑</a>
                <div style="display:none" id="editShow">
                    <h4>请修改</h4>
                    <input type="password" value="{{value}}">
                    <a href="javascript:;" id="save">确定</a>
                    <a href="javascript:;" id="cancel">取消</a>
                </div>                 
               </div>   
               
                `,
    data:{
     
    },
    actions:{
        save: function () {
            let val = this.el.find("input").siblings("#editShow").children("input").val();
            console.log("ddddd")
            console.log(val)
            this.data.value=val;
            Mediator.publish('form:changeValue',this.data);

        }    


    },
    afterRender: function() {
        this.el.on('click', ("#edit"), ()=> {
            this.el.find("#editShow").show();
        });
        this.el.on('click', ("#cancel"), ()=> {
            this.el.find("#editShow").hide();
        });
        this.el.on('click', '#save', () => {
            this.actions.save();
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