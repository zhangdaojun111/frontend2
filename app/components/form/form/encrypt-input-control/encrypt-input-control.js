import Component from '../../../lib/component';
//import {md5} from "../../../services/login/md5";
import Mediator from '../../../lib/mediator';
import './add-enrypt.html';

let config={
    template:`
             <div class="clearfix">
                 {{#if unvisible}}
                    <a href="javascript:void(0);" style="color:#ccc;">权限受限</a>
                 {{else if be_control_condition}}     
                       <a href="javascript:void(0);" style="color:#ccc;">被修改条件限制</a>
                 {{else}}                              
                       <input style="width:{{width}}"  type="password"  value="{{value}}"  readonly id="inputShow"  class="dynamic-form-input"> 
                       <div style="display: inline-block">
                               {{#if required}}
                                <span id="requiredLogo" class="{{requiredClass}}" ></span>
                               {{/if}} 
                       </div>                   
                        <a  href="javascript:;" id="edit" style="color: rgb(14, 122, 239); background: none;" class="dynamic-form-input-a">编辑</a>                    
                 {{/if}}                    
             </div>   
               
                `,
    data:{
        // width:'240px',
    },
    actions:{
        // save: function () {
        //     let _this=this;
        //     let val = this.el.find("#inputShow").val($("#inputHide").val());
        //     console.log(val)
        //     this.data.value =val;
        //     _.debounce(function(){
        //         Mediator.publish('form:changeValue:'+_this.data.tableId,_this.data)},200)();
        // }
        hasChangeValue(data){
            let _this=this;
            this.data=_.defaultsDeep({},data);
            $('#inputShow').val(data.value);
            _.debounce(function(){
                Mediator.publish('form:changeValue:'+_this.data.tableId,_this.data)},200)();
        }
    },
    afterRender: function() {
        let _this=this;
        _this.el.on('click','#edit',function(){
            _.debounce(function(){Mediator.publish('form:addPassword:'+_this.data.tableId,_this.data)},200)(

            );
        })
        // this.el.on('click', ("#edit"), ()=> {
        //     this.el.find("#editShow").show();
        // });
        // this.el.on('click', ("#cancel,#save"), ()=> {
        //     this.el.find("#editShow").hide();
        // });
        // let _this=this;
        // this.el.on( 'input', _.debounce(function () {
        //     _this.actions.save();
        // }, 1000));

    },

}
class PasswordControl extends Component {
    constructor(data){
        super(config,data);
    }
}

export default PasswordControl