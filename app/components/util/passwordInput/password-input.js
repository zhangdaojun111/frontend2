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
        isLegal:false,
        isCapsLockOpen:false,
    },
    actions:{
        initPswInput:function () {
            this.el.find('.password-title').html(this.data.title + "：");
            this.el.find('.password-rule').html(this.data.rule);
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
            if(((keyCode >= 65 && keyCode <= 90 ) && !isShift) || (( keyCode >= 97 && keyCode <= 122 ) && isShift)){
                $capitalTip.show();
                this.data.isCapsLockOpen = true;
            } else{
                this.data.isCapsLockOpen = false;
                $capitalTip.hide();
            }
        },
        listenKeyUp:function(event) {
            // 如果是大小写锁定键，直接切换状态
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
            if(this.actions.checkLegalChar(this.data.password_value) === false){
                this.el.find('.input-password-warning').html('密码中不能含有特殊字符，请修改');
                this.data.isLegal = false;
                return;
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
            let reg = /^[a-z0-9]{6,16}$/i;
            return reg.test(pw);
        },
        removeTips:function () {
            this.el.find('.input-password-warning').html('');
        },
        resetInput:function () {
            this.password_value = '';
            this.isLegal = false;
            this.el.find('.set-password-input').val('');
            this.el.find('.input-password-warning').html('');
            this.el.find('.caps-lock-tips').hide();
        }
        // setBubblePopup:function () {
        //     this.el.find('.set-password-input').tooltip({
        //         position: {
        //             my: "center bottom-20",
        //             at: "center top",
        //             using: function( position, feedback ) {
        //                 $( this ).css( position );
        //                 $( "<div>" )
        //                     .addClass( "arrow" )
        //                     .addClass( feedback.vertical )
        //                     .addClass( feedback.horizontal )
        //                     .appendTo( this );
        //             }
        //         }
        //     });
        // }
    },
    binds:[
        {
            event:'focus',
            selector:'.set-password-input',
            callback:function(target,event){
                this.actions.removeTips(event);         //监听旧密码的输入,大小写判定
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
                this.actions.checkPswLegal();
            }
        },


    ],
    afterRender:function () {
        this.actions.initPswInput();
    },
    beforeDestory:function () {

    },
};

class PasswordInput extends Component {
    constructor(data){
        super(config,data);
    }
}

export {PasswordInput};