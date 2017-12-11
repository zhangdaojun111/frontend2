/**
 * @author zhaoyan
 * 注册界面
 */

import Component from '../../lib/component';
import 'jquery-ui/themes/base/base.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/ui/widgets/dialog.js';
import './register-page.scss';
import template from './register-page.html';
import {UserInfoService} from '../../services/main/userInfoService';
import msgbox from '../../lib/msgbox';

let RegisterComponent =Component.extend({
    template:template,
    data:{
        state:0,      //管理页面状态，0：investors，1：manager
        timer:60,     //用于倒计时使用
        telephone:'',       //用于保存电话
    },
    actions:{
        /**
         * 显示投资人注册页面
         */
        showInvestorsLogin:function () {
            this.el.find('div.investors-btn').addClass('active');
            this.el.find('div.manager-btn').removeClass('active');
            this.el.find('div.page-2').hide();
            this.data.status = 0;
        },
        /**
         * 显示管理员注册页面
         */
        showManagerLogin:function () {
            this.el.find('div.investors-btn').removeClass('active');
            this.el.find('div.manager-btn').addClass('active');
            this.el.find('div.page-2').show();
            this.data.status = 1;
        },
        /**
         * 跳转到登录页面
         */
        toLoginPage:function () {
            $(window).attr('location','/login');
        },
        /**
         * 点击注册后，判断注册种类
         */
        postRegister:function () {
            if(this.data.status === 0){
                this.actions.doInvestorsRegister();
            }else{
                this.actions.doManagerRegister();
            }
        },
        /**
         * 获取注册验证码
         */
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
            let that = this;
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
                that.actions.getVerificationCode(event);
            },1000)
        },
        /**
         * 进行投资人注册，验证注册信息后向后台发送注册数据
         */
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
            this.showLoading();
            let json = {
                action:'investor',
                phone:tel,
                username:username,
                name:name,
                code:verificationCode,
                email:email,
                password:password
            };
            let that = this;
            UserInfoService.register(json).done((result) => {
                that.hideLoading();
                if(result.success === 1){
                    msgbox.alert("注册成功，即将跳转到登录界面");
                    $(window).attr('location','/login');
                }else{
                    msgbox.alert("注册失败");
                }
            }).fail((err) => {
                that.hideLoading();
                msgbox.alert("注册失败");
            })
        },
        /**
         * 用户输入时对表格内容进行检查
         */
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
                                let that = this;
                                UserInfoService.register(json).done((result)=> {
                                    if(result.success === 1){
                                        //检测手机号未注册
                                        event.target.style.borderColor = 'green';
                                        event.target.nextElementSibling.textContent = '';
                                        this.el.find('button.get-code').removeAttr('disabled');
                                    }else{
                                        event.target.style.borderColor = 'red';
                                        event.target.nextElementSibling.textContent = result.error;
                                        that.el.find('button.get-code').attr('disabled',true);
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
        /**
         * 单独检测验证码输入
         */
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
        /**
         * 正则检查电话
         */
        checkTel:function (tel) {
            let reg =/^1[3|7|5|8]\d{9}$/;
            return reg.test(tel);
        },
        /**
         * 正则检查email
         */
        checkEmail:function (email) {
            let reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
            return reg.test(email);
        },
        /**
         * 管理员注册，向后台发送注册请求
         */
        doManagerRegister:function () {
            msgbox.alert("管理员注册暂未开放");
        }
    },
    binds:[
        {
            event:'click',
            selector:'div.investors-btn',                //点击显示投资人注册页面
            callback:function () {
                this.actions.showInvestorsLogin();
            }
        },
        {
            event:'click',
            selector:'div.manager-btn',                 //点击显示管理者注册页面
            callback:function () {
                this.actions.showManagerLogin();
            }
        },
        {
            event:'click',
            selector:'.login-btn',                      //跳转到登录页面
            callback:function () {
                this.actions.toLoginPage();
            }
        },
        {
            event:'click',
            selector:'.register-page-btn',              //点击进行注册操作
            callback:function () {
                this.actions.postRegister();
            }
        },
        {
            event:'click',
            selector:'.get-code',
            callback:function (target,event) {
                this.actions.getVerificationCode(event);        //点击获取验证码
            }
        },
        {
            event:'input',
            selector:'input.tel',
            callback:function (target,event) {
                this.data.telephone = event.target.value;       //检查电话格式
            }
        },
        {
            event:'blur',
            selector:'input.username',
            callback:function (target,event) {
                this.actions.checkForm(event,"请填写用户名","username");      //检查用户名格式
            }
        },
        {
            event:'blur',
            selector:'input.password',
            callback:function (target,event) {
                this.actions.checkForm(event,"请填写密码","password");       //检查密码格式
            }
        },
        {
            event:'blur',
            selector:'input.name',
            callback:function (target,event) {
                this.actions.checkForm(event,"请填写姓名","name");           //检查姓名格式
            }
        },
        {
            event:'blur',
            selector:'input.email',
            callback:function (target,event) {
                this.actions.checkForm(event,"请填写邮箱地址","email");        //检查邮箱格式
            }
        },
        {
            event:'blur',
            selector:'input.tel',
            callback:function(target,event){
                this.actions.checkForm(event,"请填写手机号码","tel");          //检查手机号码格式
            }
        },
        {
            event:'blur',
            selector:'input.verification-code',
            callback:function (target,event) {
                this.actions.checkVerification(event,"请填写验证码","verification-code");     //检查验证码填写
            }
        },
        {
            event:'click',
            selector:'.register-btn',
            callback:_.debounce(function(){
                this.actions.postRegister();        //点击发送注册请求
            },500)
        }

    ],

    afterRender:function () {
        this.data.status = 0;       //默认状态为0，投资人注册

        // this.el.on('click','div.investors-btn',() => {
        //     this.actions.showInvestorsLogin();
        // }).on('click','div.manager-btn',() => {
        //     this.actions.showManagerLogin();
        // }).on('click','.login-btn',() => {
        //     this.actions.toLoginPage();
        // }).on('click','.register-page-btn',() => {
        //     this.actions.postRegister();
        // }).on('click','.get-code',(event) => {
        //     this.actions.getVerificationCode(event);
        // }).on('input','input.tel',(event) => {
        //     this.data.telephone = event.target.value;
        // }).on("blur","input.username",(event) => {
        //     this.actions.checkForm(event,"请填写用户名","username");
        // }).on("blur","input.password",(event) => {
        //     this.actions.checkForm(event,"请填写密码","password");
        // }).on("blur","input.name",(event) => {
        //     this.actions.checkForm(event,"请填写姓名","name");
        // }).on("blur","input.email",(event) => {
        //     this.actions.checkForm(event,"请填写邮箱地址","email");
        // }).on("blur","input.tel",(event) => {
        //     this.actions.checkForm(event,"请填写手机号码","tel");
        // }).on("blur","input.verification-code",(event) => {
        //     this.actions.checkVerification(event,"请填写验证码","verification-code");
        // }).on("click",".register-btn",_.debounce(() => {
        //     this.actions.postRegister();
        // },500));
    },
    beforeDestory:function () {

    }
});

export {RegisterComponent};

