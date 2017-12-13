/**
 * @author zhaoyan
 * 密码找回界面
 */
import Component from '../../lib/component';
import 'jquery-ui/themes/base/base.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/ui/widgets/dialog.js';
import './find-pw.scss';
import template from './find-pw.html';
import {UserInfoService} from '../../services/main/userInfoService';
import msgbox from '../../lib/msgbox';

let FindPassword = Component.extend({
    template:template,
    data:{
        password:'',
        username:'',
        randomCode:''
    },
    actions:{
        /**
         * 根据url获取初始数据,username和random_code
         */
        getInitData:function () {
            this.data.randomCode = this.actions.getUrlPara('random_code');
            this.data.username = this.actions.getUrlPara('username');
            //根据初始数据向后台确认数据是否有效，有效则显示密码重置界面，否则显示后台返回的错误信息
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
        /**
         * 参数解析函数
         * @param key
         * @returns {null}
         */
        getUrlPara(key){
            let reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i');
            let r = window.location.search.substr(1).match(reg);
            if (r !== null) {
                return unescape(r[2]);
            }
            return null
        },
        /**
         * 验证密码合法性0-9 a-z A-Z
         * @param pw
         * @returns {boolean}
         */
        checkLegalChar:function(pw){
            let reg = /^[a-z0-9]+$/i;
            return reg.test(pw);
        },
        /**
         * 验证密码长度
         * @param pw
         */
        checkPwLength:function (pw) {
            let reg = /^[a-z0-9]{6,16}$/i;
            return reg.test(pw);
        },
        /**
         * 验证密码合法性，重置用户密码
         */
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
            //向后台请求重置用户密码
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
        /**
         * 验证两次输入的密码合法性
         * @returns {boolean}
         */
        checkPasswordLegal:function () {
            let new_pw = this.el.find('.new-pw').val();
            let new_pw_confirm = this.el.find('.new-pw-confirm').val();
            if(new_pw === ''){
                msgbox.alert('请输入新密码');
                return false;
            }
            if(this.actions.checkLegalChar(new_pw) === false){
                msgbox.alert('新密码包含非法字符，请修改');
                return false;
            }
            if(this.actions.checkPwLength(new_pw) === false){
                msgbox.alert('新密码长度必须为6-16位，请修改');
                return false;
            }
            if(new_pw_confirm === ''){
                msgbox.alert('请再次输入新密码');
                return false;
            }
            if(new_pw !== new_pw_confirm){
                msgbox.alert('两次密码输入不一致！请修改！');
                // this.el.find('.new-pw').val('');
                // this.el.find('.new-pw-confirm').val('');
                return false;
            }
            this.data.password = new_pw;
            return true;
        }
    },
    binds:[
        {
            event:'click',
            selector:'.reset-pw-btn',           //重置密码提交按钮
            callback:function () {
                this.actions.resetUserPassword();
            }
        },
        {
            event:'click',
            selector:'.goLogin',                //跳转登录页面
            callback:function () {
                $(window).attr('location','/login');
            }
        },
    ],
    afterRender:function () {
        this.actions.getInitData();             //根据url获取初始化数据
    },
    beforeDestory:function () {

    }
});

export{FindPassword}