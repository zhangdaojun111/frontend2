import Component from '../../../lib/component';
import '../../../assets/scss/control.scss'
import 'jquery-ui/ui/widgets/dialog.js';
import {md5} from "../../../services/login/md5";
import Mediator from '../../../lib/mediator';
import {PMAPI} from '../../../lib/postmsg';

let config={
    template:`
             <div class="clearfix">
                 {{#if unvisible}}
                    <p class="info">权限受限</p>
                 {{else}}           
                      {{#if be_control_condition }}
                            <p class="info">被修改条件限制</p>
                      {{else}}                 
                      <div style="display: inline-block">{{label}}</div>               
                       <input type="text"  value="{{value}}"  id="inputShow" readonly>{{value}}  
                    <a href="javascript:void(0);" style="color:#ccc;">权限受限</a>
                 {{else if be_control_condition}}     
                       <a href="javascript:void(0);" style="color:#ccc;">被修改条件限制</a>
                 {{else}}                              
                       <input style="width: 240px"  type="password"  value="{{value}}"  readonly >{{value}}  
                       <div style="display: inline-block">
                               {{#if required}}
                                <span id="requiredLogo" class="{{requiredClass}}" ></span>
                               {{/if}} 
                       </div>                   
                        <a  href="javascript:;" id="edit" >编辑</a>
                        <div style="display:none" id="editShow">
                        <h4>请修改</h4>
                        <input type="text" value="{{value}}" id="inputHide">
                        <a href="javascript:;" id="save">确定</a>
                        <a href="javascript:;" id="cancel">取消</a>
                    </div>
                 {{/if}}                    
             </div>   
               
                `,
    data:{
     
    },
    actions:{
        save: function () {
            let _this=this;
            let val = this.el.find("#inputShow").val($("#inputHide").val());
            this.data.value =val;
            _.debounce(function(){
                console.log('发出了么');
                console.log('form:changeValue:'+_this.data.tableId);
                Mediator.publish('form:changeValue:'+_this.data.tableId,_this.data)},200)();
        }
    },
    afterRender: function() {
        this.el.on('click', ("#edit"), ()=> {
            this.el.find("#editShow").show();
        });
        this.el.on('click', ("#cancel,#save"), ()=> {
            this.el.find("#editShow").hide();
        });
        let _this=this;
        this.el.on( 'input', _.debounce(function () {
            _this.actions.save();
        }, 1000));

    },

}
class PasswordControl extends Component {
    constructor(data){
        super(config,data);
    }
}

export default PasswordControl