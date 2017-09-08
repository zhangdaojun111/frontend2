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
    data:{},
    actions:{
        doSubmit:function () {
            let newPw = this.el.find('.new-password').val();
            let newPwConfirm = this.el.find('.new-password-confirm').val();
            if(newPw === ''){
                msgbox.showTips('请输入密码');
                return;
            }
            if(newPwConfirm === ''){
                msgbox.showTips('请再次输入密码');
                return;
            }
            if(newPw !== newPwConfirm){
                //两次输入不同
                msgbox.showTips('两次密码输入不一致！');
                return;
            }

            let json = {};
            json['reset_pwd'] = 1;
            json['password'] = newPw;
            json['random_code'] = this.data.random_code;
            json['username'] = this.data.username;
            UserInfoService.resetPassword(json).done((result) => {
                if(result.success === 1){
                    //修改成功
                }else{

                }
            })
        }
    },
    binds:[
        {
            event:'click',
            selector:'.find-pw-btn',
            callback:function () {
                this.actions.doSubmit();
            }
        }
    ],
    afterRender:function () {

    },
    beforeDestory:function () {

    }
};

class FindPassword extends  Component{
    constructor(){
        super(config);
    }
}

export {FindPassword};

