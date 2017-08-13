import Component from '../lib/component';
import 'jquery-ui/themes/base/base.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/ui/widgets/dialog.js';
import '../assets/scss/register.scss';
import template from '../../template/register.html';
import {UserInfoService} from '../services/main/userInfoService';
import msgbox from '../lib/msgbox';


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
                    }else{
                        msgbox.alert("验证码获取失败");
                    }
                }).fail((err) => {
                    msgbox.alert("验证码获取失败");
                    console.log("验证码获取失败",err);
                })
            }
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
                console.log(result);
                if(result.success === '1'){
                    msgbox.alert("注册成功，即将跳转到登录界面");
                    $(window).attr('location','/login');
                }else{
                    msgbox.alert("注册失败");
                    return;
                }
            }).fail((err) => {
                msgbox.alert("注册失败");
                return;
            })
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
        }).on('click','.register-btn',() => {
            this.actions.postRegister();
        }).on('click','button.get-code',(event) => {
            this.actions.getVerificationCode(event);
        }).on('input','input.tel',(event) => {
            this.data.telephone = event.target.value;
        })
    },
    beforeDestory:function () {

    }
};


class Register extends  Component{
    constructor(){
        super(config);
    }
}

// export {Register};

export const RegisterComponent = {
    el: null,
    show: function() {
        let component = new Register();
        this.el = $('<div id="register-page">').appendTo(document.body);
        component.render(this.el);
        this.el.dialog({
            title: '注册界面',
            width: "100%",
            height: 1800,
            modal: true,
            close: function() {
                $(this).dialog('destroy');
                component.destroySelf();
            }
        });
    },
    hide: function () {
        this.el.dialog('close');
    }
};
