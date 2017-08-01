import Component from '../../../lib/component';
import '../../../assets/scss/control.scss'
import 'jquery-ui/ui/widgets/dialog.js';
import template from './encrypt-input-control.html';

let config={
    template:`<div style="display: inline-block">{{label}}</div>
                <input style="width: 240px"  type="text" value="{{value}}" >                 
                <a  href="javascript:;" id="edit" >编辑</a>
                <div style="display:none" id="show">
                    <h4>请修改</h4>
                    <input type="password" value="{{value}}">
                    <a href="javascript:;" >确定</a>
                    <a href="javascript:;" >取消</a>
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