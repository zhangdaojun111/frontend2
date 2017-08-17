/**
 * @author zhaoyan
 * 打开注册界面
 */

import Component from '../../lib/component';
import 'jquery-ui/themes/base/base.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/ui/widgets/dialog.js';
import './register-page.scss';
import template from './register-page.html';
import {UserInfoService} from '../../services/main/userInfoService';
import msgbox from '../../lib/msgbox';


let config ={
    template:template,
    data:{
        state:0,      //管理页面状态，0：investors，1：manager
        timer:60,     //用于倒计时使用
        telephone:'',       //用于保存电话
    },
    actions:{
        showInvestorsLogin:function () {
            this.el.find('div.investors-btn').addClass('active');
            this.el.find('div.manager-btn').removeClass('active');
            this.el.find('div.page-2').hide();
            this.data.status = 0;
        },
        showManagerLogin:function () {
            this.el.find('div.investors-btn').removeClass('active');
            this.el.find('div.manager-btn').addClass('active');
            this.el.find('div.page-2').show();
            this.data.status = 1;
        },
        toLoginPage:function () {
            $(window).attr('location','/login');
        },
        postRegister:function () {
            if(this.data.status === 0){
                this.actions.doInvestorsRegister();
            }else{
                this.actions.doManagerRegister();
            }
        },
        getVerificationCode:function (event) {
            if(this.data.timer === 60){
                let json = {
                    action:'send_code',
                    phone:this.data.telephone,
                };
                UserInfoService.register(json).done((result) => {
                    if(result.success === 1){
                        //验证码发送成功
                        // console.log("验证码发送成功");
                    }else{
                        msgbox.alert("验证码获取失败");
                    }
                }).fail((err) => {
                    msgbox.alert("验证码获取失败");
                    // console.log("验证码获取失败",err);
                })
            }

            let $btn = this.el.find('.get-code');
            if (this.data.timer === 0) {
                $btn.removeAttr('disable');
                $btn.html("获取验证码");
                this.data.timer = 60;
                return;
            } else {
                $btn.attr("disabled", true);
                $btn.html("重新发送(" + this.data.timer + ")");
                this.data.timer--;
            }
            setTimeout(() => {
                this.actions.getVerificationCode(event);
            },1000)
        },
        doInvestorsRegister:function () {
            let username = this.el.find('input.username').val();
            let password = this.el.find('input.password').val();
            let name = this.el.find('input.name').val();
            let email = this.el.find('input.email').val();
            let tel = this.el.find('input.tel').val();
            let verificationCode = this.el.find('input.verification-code').val();

            if(!username || username.trim() === ''){
                msgbox.alert('请填写用户名');
                return;
            }else if(!password || password.trim() === ''){
                msgbox.alert('请填写密码',"error",'');
                return;
            }else if(!name || name.trim() === ''){
                msgbox.alert('请填写姓名');
                return;
            }else if(!email || email.trim() === ''){
                msgbox.alert('请填写邮箱');
                return;
            }else if(!tel || tel.trim() === ''){
                msgbox.alert('请填写电话',"error",'');
                return;
            }else if(!verificationCode || verificationCode.trim() === ''){
                msgbox.alert('请填写验证码');
                return;
            }

            let json = {
                action:'investor',
                phone:tel,
                username:username,
                name:name,
                code:verificationCode,
                email:email,
                password:password
            };

            UserInfoService.register(json).done((result) => {
                if(result.success === 1){
                    msgbox.alert("注册成功，即将跳转到登录界面");
                    // $(window).attr('location','/login');
                }else{
                    msgbox.alert("注册失败");
                    return;
                }
            }).fail((err) => {
                msgbox.alert("注册失败");
                return;
            })
        },
        checkForm:function (event,tip,type) {
            if(event.target.required === false){
                event.target.style.borderColor = 'rgba(169,169,169,0.5)';
                event.target.nextElementSibling.textContent = '';
                return;
            }

            let value = event.target.value.trim();
            if(value === ''){
                event.target.style.borderColor = 'red';
                event.target.nextElementSibling.textContent = tip;
            }else{
                if(type){
                    let json = {
                        action:'check'
                    };

                    switch(type) {
                        case 'username':
                            json["username"] = value;
                            UserInfoService.register(json).done((result) => {
                                console.log("post require");
                                console.log(result);
                                if(result.success === 1){
                                    //检测用户名未注册
                                    event.target.style.borderColor = 'green';
                                    event.target.nextElementSibling.textContent = '';
                                }else{
                                    event.target.style.borderColor = 'red';
                                    event.target.nextElementSibling.textContent = result.error;
                                }
                            });
                            break;
                        case 'password':
                            if (value !== ''){
                                event.target.style.borderColor = 'green';
                                event.target.nextElementSibling.textContent = '';
                            }
                            break;
                        case 'name':
                            json["name"] = value;
                            UserInfoService.register(json).done((result) => {
                                if(result.success === 1){
                                    //检测姓名合法
                                    event.target.style.borderColor = 'green';
                                    event.target.nextElementSibling.textContent = '';
                                }else{
                                    event.target.style.borderColor = 'red';
                                    event.target.nextElementSibling.textContent = result.error;
                                }
                            });
                            break;
                        case 'tel':
                            if (this.actions.checkTel(value)) {
                                json["tel"] = value;
                                UserInfoService.register(json).done((result)=> {
                                    if(result.success === 1){
                                        //检测手机号未注册
                                        event.target.style.borderColor = 'green';
                                        event.target.nextElementSibling.textContent = '';
                                        this.el.find('button.get-code').removeAttr('disabled');
                                    }else{
                                        event.target.style.borderColor = 'red';
                                        event.target.nextElementSibling.textContent = result.error;
                                        this.el.find('button.get-code').attr('disabled',true);
                                    }
                                })
                            }else{
                                event.target.style.borderColor = 'red';
                                event.target.nextElementSibling.textContent = '手机号格式不正确';
                                this.el.find('button.get-code').attr('disabled',true);
                            }
                            break;
                        case 'email':
                            if (this.actions.checkEmail(value)) {
                                event.target.style.borderColor = 'green';
                                event.target.nextElementSibling.textContent = '';
                            }else{
                                event.target.style.borderColor = 'red';
                                event.target.nextElementSibling.textContent = '邮箱格式不正确';
                            }
                            break;
                    }
                }
            }
        },
        checkVerification:function (event,tip,type) {
            let value = event.target.value.trim();
            if(value !== ''){
                event.target.style.borderColor = 'green';
                this.el.find('p.verification-p').html("");
            }else{
                event.target.style.borderColor = 'red';
                this.el.find('p.verification-p').html(tip);
            }

        },
        checkTel:function (tel) {
            let reg =/^1[3|7|5|8]\d{9}$/;
            return reg.test(tel);
        },
        checkEmail:function (email) {
            let reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
            return reg.test(email);
        },
        doManagerRegister:function () {
            msgbox.alert("管理员注册暂未开放");
        }
    },
    afterRender:function () {
        this.data.status = 0;       //默认状态为0，投资人注册

        this.el.on('click','div.investors-btn',() => {
            this.actions.showInvestorsLogin();
        }).on('click','div.manager-btn',() => {
            this.actions.showManagerLogin();
        }).on('click','.login-btn',() => {
            this.actions.toLoginPage();
        }).on('click','.register-page-btn',() => {
            this.actions.postRegister();
        }).on('click','.get-code',(event) => {
            this.actions.getVerificationCode(event);
        }).on('input','input.tel',(event) => {
            this.data.telephone = event.target.value;
        }).on("blur","input.username",(event) => {
            this.actions.checkForm(event,"请填写用户名","username");
        }).on("blur","input.password",(event) => {
            this.actions.checkForm(event,"请填写密码","password");
        }).on("blur","input.name",(event) => {
            this.actions.checkForm(event,"请填写姓名","name");
        }).on("blur","input.email",(event) => {
            this.actions.checkForm(event,"请填写邮箱地址","email");
        }).on("blur","input.tel",(event) => {
            this.actions.checkForm(event,"请填写手机号码","tel");
        }).on("blur","input.verification-code",(event) => {
            this.actions.checkVerification(event,"请填写验证码","verification-code");
        }).on("click",".register-btn",() => {
            this.actions.postRegister();
        })
    },
    beforeDestory:function () {

    }
};


class RegisterComponent extends  Component{
    constructor(){
        super(config);
    }
}

export {RegisterComponent};

