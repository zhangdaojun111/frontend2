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
        username:'',
        randomCode:''
    },
    actions:{
        getInitData:function () {       //根据url获取初始数据
            this.data.randomCode = this.actions.getUrlPara('random_code');
            this.data.username = this.actions.getUrlPara('username');
            UserInfoService.resetPassword({username:this.data.username,random_code:this.data.randomCode}).done((result) => {
                if(result.success === 1){
                    this.el.find('.find-pw-step1').show();
                }else{
                    this.el.find('.find-pw-step2').show();
                    this.el.find('.reset-result').html(result.error);
                    this.el.find('.goLogin').hide();
                }
            })
        },
        getUrlPara(key){
            let reg = new RegExp('(^|;)' + key + '=([^;]*)(;|$)', 'i');
            let r = window.location.search.substr(1).match(reg);
            if (r !== null) {
                return unescape(r[2]);
            }
            return null
        },
        checkLegal:function(pw){     //验证密码合法性0-9 a-z A-Z,待完善
            let reg = /^[a-z0-9]+$/i;
            return reg.test(pw);
        },
        resetUserPassword:function () {
            let res = this.actions.checkPasswordLegal();
            if(!res){
                return;
            }
            let json = {};
            json['reset_pwd'] = 1;
            json['password'] = this.data.password;
            json['random_code'] = this.data.randomCode;
            json['username'] = this.data.username;

            UserInfoService.resetPassword(json).done((result) => {
                this.el.find('.find-pw-step1').hide();
                this.el.find('.find-pw-step2').show();
                if(result.success === 1){
                    this.el.find('.reset-result').html('密码重置成功，请重新登录');
                    this.el.find('.goLogin').show();
                }else{
                    this.el.find('.reset-result').html(result.err);
                    this.el.find('.goLogin').hide();
                }
            })
        },
        checkPasswordLegal:function () {
            let new_pw = this.el.find('.new-pw').val();
            let new_pw_confirm = this.el.find('.new-pw-confirm').val();
            if(new_pw === ''){
                msgbox.alert('请输入新密码');
                return false;
            }
            if(this.actions.checkLegal(new_pw) === false){
                msgbox.alert('新密码包含不合法的字符！');
                return false;
            }
            if(new_pw_confirm === ''){
                msgbox.alert('请再次输入新密码');
                return false;
            }
            if(new_pw !== new_pw_confirm){
                msgbox.alert('两次密码输入不一致！请重新输入！');
                this.el.find('.new-pw').val('');
                this.el.find('.new-pw-confirm').val('');
                return false;
            }
            this.data.password = new_pw;
            return true;
        }
    },
    binds:[
        {
            event:'click',
            selector:'.reset-pw-btn',
            callback:function () {
                this.actions.resetUserPassword();
            }
        },
        {
            event:'click',
            selector:'.goLogin',
            callback:function () {
                $(window).attr('location','/login');
            }
        },
    ],
    afterRender:function () {
        this.actions.getInitData();
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