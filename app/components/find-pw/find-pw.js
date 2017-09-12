/**
 * @author zhaoyan
 * 注册界面
 */
import Component from '../../lib/component';
import 'jquery-ui/themes/base/base.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/ui/widgets/dialog.js';
import './find-pw.scss';
import template from './find-pw.html';
import {UserInfoService} from '../../services/main/userInfoService';
import msgbox from '../../lib/msgbox';

let config = {
    template:template,
    data:{
        password:'',
    },
    actions:{
        removeHtmlTab:function(pw){
            return pw.replace(/<[^<>]+?>/g,'');    //删除所有HTML标签
        },
        resetUserPassword:function () {
            this.actions.checkPasswordLegal();

        },
        checkPasswordLegal:function () {
            let new_pw = this.el.find('.new-pw').val();
            let new_pw_confirm = this.el.find('.new-pw-confirm').val();
            if(new_pw === ''){

            }
        }


    },
    binds:[
        {
            event:'click',
            selector:'.reset-pw-btn',
            callback:function () {
                this.actions.resetUserPassword();
            }
        }
    ],
    afterRender:function () {

    },
    beforeDestory:function () {

    }
};

class FindPassword extends Component{
    constructor(){
        super(config);
    }
}

export{FindPassword}