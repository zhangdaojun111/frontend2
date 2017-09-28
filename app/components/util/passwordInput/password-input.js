/**
 * @author zhaoyan
 * 密码输入框组件
 */

import Component from '../../../lib/component';
import 'jquery-ui/themes/base/base.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/ui/widgets/dialog.js';
import template from './password-input.html';
import './password-input.scss';


let config = {
    template:template,
    data:{
        password_value:'',
        isLegal:false,                  //密码输入是否合法（长度，非法字符，非空）
        isCapsLockOpen:false,           //是否开启了大写锁定
        checkChar:true,                 //是否检测字符非法（默认检测）
        fakerPsw:true,                 //是否显示密码框中的眼睛(默认显示)
        pswDisplay:false,               //密码是否可见（显示为真实值）
    },
    actions:{
        /**
         * 初始化input前方的title和后方的输入规则
         */
        initPswInput:function () {
            if(this.data.title !== undefined && this.data.title !== ''){
                this.el.find('.password-title').html(this.data.title);
            }
            // this.el.find('.password-rule').html(this.data.rule);
            if(this.data.fakerPsw === false){
                this.el.find('.default-faker-password').hide();
            }
        },
        /**
         * 监听用户输入的字母，判断是否开启大小写，并给出提示
         * @param event
         */
        listenKeyPress:function (event) {
            let e = event;
            let $capitalTip = this.el.find('.caps-lock-tips');
            let keyCode = e.keyCode;
            let isShift = e.shiftKey || (keyCode === 16 ) || false;

            if((( keyCode >= 65 && keyCode <= 90 ) && !isShift ) || (( keyCode >= 97 && keyCode <= 122 ) && isShift )){
                $capitalTip.show();
                this.data.isCapsLockOpen = true;
            } else{
                this.data.isCapsLockOpen = false;
                $capitalTip.hide();
            }
        },
        /**
         * 通过监听keyup监听capslock键，切换大小写模式
         * @param event
         */
        listenKeyUp:function(event) {
            let e = event;
            let $capitalTip = this.el.find('.caps-lock-tips');
            let keyCode = e.keyCode;

            if (keyCode === 20) {
                if (this.data.isCapsLockOpen === true) {
                    this.data.isCapsLockOpen = false;
                    $capitalTip.hide();
                } else {
                    this.data.isCapsLockOpen = true;
                    $capitalTip.show();
                }
            }
        },
        /**
         * 设置密码值，并检测密码是否合法，不合法则给出提示
         */
        checkPswLegal:function () {
            this.data.password_value = this.el.find('.set-password-input').val();
            this.el.find('.caps-lock-tips').hide();

            //密码不能为空
            if(this.data.password_value === ''){
                this.el.find('.input-password-warning').html('密码不能为空，请修改');
                this.data.isLegal = false;
                return;
            }
            //非法字符检测
            if(this.data.checkChar === true){
                if(this.actions.checkLegalChar(this.data.password_value) === false){
                    this.el.find('.input-password-warning').html('密码中不能含有特殊字符，请修改');
                    this.data.isLegal = false;
                    return;
                }
            }

            if(this.actions.checkPwLength(this.data.password_value) === false){
                this.el.find('.input-password-warning').html('密码长度必须为6-16位，请修改');
                this.data.isLegal = false;
                return;
            }
            this.data.isLegal = true;
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
            let length = pw.length;
            return (length >=6 && length <= 16 )
        },
        /**
         * input获取焦点时隐藏密码不合法的提醒
         */
        removeTips:function () {
            this.el.find('.input-password-warning').html('');
            window.clearTimeout(this.data.timer);
        },
        /**
         * 切换到用户信息显示页面时，重置所有input框的内容
         */
        resetInput:function () {
            this.password_value = '';
            this.isLegal = false;
            this.el.find('.set-password-input').val('');
            this.el.find('.input-password-warning').html('');
            this.el.find('.caps-lock-tips').hide();
        },
        /**
         * 点击眼睛后隐藏密码或显示密码
         */
        setPswDisplay:function () {
            if(this.data.pswDisplay === false){
                this.data.pswDisplay = true;
                this.el.find('.set-password-input').attr('type','text');
                this.el.find('.default-faker-password').addClass('display-password');
            }else{
                this.data.pswDisplay = false;
                this.el.find('.set-password-input').attr('type','password');
                this.el.find('.default-faker-password').removeClass('display-password');
            }
            this.el.find('.set-password-input').focus();    //点击眼睛后强制input获取焦点并取消延迟执行的blur事件
        },
        /**
         * 父组件设置密码组件的值
         * @param psw
         */
        setPswByParent:function (psw) {
            this.data.password_value = psw;
            this.el.find('.set-password-input').val(psw);
        },
        sendPawToParent:function () {
            console.log('do send');
            let password = this.el.find('.set-password-input').val();
            this.setValue(password);
        }
    },
    binds:[
        {
            event:'focus',
            selector:'.set-password-input',
            callback:function(target,event){
                this.actions.removeTips(event);         //监听密码的输入,大小写判定
            }
        },
        {
            event:'keypress',
            selector:'.set-password-input',
            callback:function(target,event){
                this.actions.listenKeyPress(event);         //监听capslock键改变大小写锁定
            }
        },
        {
            event:'keyup',
            selector:'.set-password-input',
            callback:function(target,event){
                this.actions.listenKeyUp(event);         //监听字母输入判断大小写锁定
            }
        },{
            event:'blur',
            selector:'.set-password-input',
            callback:function (target,event) {
                this.data.timer = window.setTimeout(() => {
                    this.data.timer = this.actions.checkPswLegal();     //input框失去焦点时，设置密码值以及检测密码是否合法（若是点击眼睛，该事件会被取消）
                }, 150);
            }
        },
        {
            event:'click',
            selector:'.default-faker-password',         //点击眼睛，显示/隐藏密码
            callback:function (target,event) {
                this.actions.setPswDisplay();
            }
        },
        {
            event:'input',
            selector:'.set-password-input',
            callback:function(){
                this.actions.sendPawToParent();
            }
        }
    ],
    afterRender:function () {
        this.actions.initPswInput();
    },
    beforeDestory:function () {

    },
};

/**
 * data可传入json对象:
 * {
 *      title:密码框前方文字，
 *      rule:密码框后方文字（填写说明）
 *      checkChar:是否检测非法字符（默认检测）
 *      fakerPsw:是否显示密码框中的眼睛（默认显示）
 *
 * }
 */

class PasswordInput extends Component {
    constructor(data,callback){
        super(config,data);
        this.setValue = callback;
    }
}

export {PasswordInput};