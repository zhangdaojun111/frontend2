/**
 * @author zhaoyan
 * 打开个人设置界面
 */
import Component from '../../../lib/component';
import 'jquery-ui/themes/base/base.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/ui/widgets/dialog.js';
import './personal-settings.scss';
import template from './personal-settings.html';
import {UserInfoService} from '../../../services/main/userInfoService';
import msgbox from '../../../lib/msgbox';
import {AvatarSet} from './set-avatar/set-avatar';
import {agentSetting} from './set-agent/set-agent';
import {LoginByOther} from "../login-by-other/login-by-other";
import Mediator from '../../../lib/mediator';
import {PMAPI} from '../../../lib/postmsg';
import userInfoDisplay from './user-info-display/user-info-display';
import {PasswordInput} from "../../util/passwordInput/password-input"

function getData(component_instance) {
    _.defaultsDeep(component_instance.data, {
        avatar: window.config.sysConfig.userInfo.avatar,
        avatar_content:window.config.sysConfig.userInfo.avatar_content,
        name:window.config.sysConfig.userInfo.name,
        username: window.config.sysConfig.userInfo.username,
        department:window.config.sysConfig.userInfo.user_department,
        position:window.config.sysConfig.userInfo.user_job,
        user_email:window.config.sysConfig.userInfo.email,
        user_phone:window.config.sysConfig.userInfo.tel,
        otherLoginVisible:window.config.sysConfig.userInfo.is_superuser
    });
}

let config = {
    template:template,
    data:{
        targetUserName:'',
        isCapsLock:false,
    },
    actions:{
        /**
         * 初始化，检测用户头像路径返回值，没有则显示默认头像
         */
        initInfo:function () {
            let src = this.data.avatar;
            if(src !== ''){
                let $img = $("<img>").addClass("user-avatar");
                $img.attr('src', src);
                this.el.find("div.avatar-box").append($img);
                let that = this;
                $img.on('error', function () {
                    that.el.find("div.avatar-box").addClass('default_avatar');
                    $img.remove();
                });
            }else{
                this.el.find("div.avatar-box").addClass('default_avatar');
            }
        },
        onImageError: function () {

        },
        /**
         * 打开头像设置界面
         */
        setAvatar(){
            AvatarSet.show();
        },
        /**
         * 打开代理设置界面
         */
        setAgent(){
            agentSetting.show();
        },
        /**
         * 切换到个人信息界面
         */
        showPersonalInfo:function () {
            this.el.find("div.personal-info").show();
            this.el.find("div.modify-password").hide();
            this.el.find("div.show-personal-info").addClass("active");
            this.el.find("div.show-modify-password").removeClass("active");
            //清空密码界面的input
            this.old_pswInput.actions.resetInput();
            this.new_pswInput.actions.resetInput();
            this.confirm_new_pswInput.actions.resetInput();
        },
        /**
         * 切换到密码修改界面
         */
        showModifyPassword:function () {
            this.el.find("div.personal-info").hide();
            this.el.find("div.modify-password").show();
            this.el.find("div.show-personal-info").removeClass("active");
            this.el.find("div.show-modify-password").addClass("active");
        },
        // editPersonalInfo:function () {
        //     this.el.find("input.email-info").removeAttr("disabled");
        //     this.el.find("input.phone-info").removeAttr("disabled");
        //     this.el.find("div.personal-foot").hide();
        //     this.el.find("div.cancel-save").show();
        // },
        /**
         * 编辑email
         */
        editEmail:function () {
            this.el.find("input.email-info").removeAttr("disabled").focus();
        },
        /**
         * 编辑tel
         */
        editTel:function () {
            this.el.find("input.phone-info").removeAttr("disabled").focus();
        },
        // cancelEdit:function () {
        //     this.el.find("input.email-info").val(this.data.user_email);
        //     this.el.find("input.phone-info").val(this.data.user_phone);
        //     this.el.find("input.email-info").attr("disabled",true);
        //     this.el.find("input.phone-info").attr("disabled",true);
        //     this.el.find("div.personal-foot").show();
        //     this.el.find("div.cancel-save").hide();
        // },
        /**
         * 保存编辑结果
         */
        saveEdit:function () {
            this.data.user_email = this.el.find("input.email-info").val();
            this.data.user_phone = this.el.find("input.phone-info").val();
            this.el.find("input.email-info").attr("disabled",true);
            this.el.find("input.phone-info").attr("disabled",true);
            this.el.find("div.personal-foot").show();
            this.el.find("div.cancel-save").hide();
            //修改结果传给后台
            let data = {
                username:this.data.username,
                useremail: this.data.user_email,
                usertel: this.data.user_phone
            };
            UserInfoService.saveInfo(data).done((result) => {
                //修改window.config中的数据
                window.config.sysConfig.userInfo.email = this.data.user_email;
                window.config.sysConfig.userInfo.tel = this.data.user_phone;
            }).fail((err) => {
                msgbox.alert("修改失败");
                console.log("修改失败",err);
            })
        },
        /**
         * 修改密码
         */
        modifyPassword:function () {
            let originPw = this.old_pswInput.data.password_value;
            let newPw = this.new_pswInput.data.password_value;
            let confirmNewPw = this.confirm_new_pswInput.data.password_value;
            let result = this.actions.checkPasswordLegal(originPw,newPw,confirmNewPw);
            if(result === true){
                let data = {
                    username:this.data.username,
                    originalpwd: originPw,
                    newpwd: newPw,
                    newpwdagain:confirmNewPw
                };

                UserInfoService.modifyPassword(data).done((result) => {
                    if(result.success === 1){
                        msgbox.alert("密码修改成功！");
                        PersonSetting.hide();
                    }else{
                        msgbox.alert(result.error);
                    }
                }).fail((err) => {
                    console.log(err);
                })
            }else{

            }
        },
        /**
         * 显示他人登录界面
         */
        otherLogin:function () {
            LoginByOther.show();
        },
        // //初始化头像
        // initAvatar:function () {
        //     let src = this.data.avatar;
        //     this.el.find("img.user-avatar")
        //         .attr("src",src)
        // },
        // clearLocalStorage:function(){
        //     window.localStorage.clear();
        //     $(window).attr("location","/login");
        // },
        initPasswordPage:function () {
            //初始化旧密码框
            let $wrap1 = this.el.find('.old-pw-group');
            this.old_pswInput = new PasswordInput({title:'旧密码：',checkChar:false});
            this.old_pswInput.render($wrap1);

            //初始化新密码框
            let $wrap2 = this.el.find('.new-pw-group');
            this.new_pswInput = new PasswordInput({title:'新密码：'});
            this.new_pswInput.render($wrap2);

            //初始化确认新密码框
            let $wrap3 = this.el.find('.confirm-new-pw-group');
            this.confirm_new_pswInput = new PasswordInput({title:'确认新密码：'});
            this.confirm_new_pswInput.render($wrap3);
        },
        /**
         * 根据监听到的频道信息重置头像
         */
        resetAvatar:function () {
            let $img = this.el.find("img.user-avatar");
            if($img.length === 0){
                $img = $("<img>").addClass("user-avatar");
                $img.attr("src",window.config.sysConfig.userInfo.avatar);
                this.el.find(".avatar-box").append($img);
            }else{
                $img.attr("src",window.config.sysConfig.userInfo.avatar);
            }
        },
        /**
         *  检查用户密码输入合法性
         * @param originPw
         * @param newPw
         * @param confirmNewPw
         */
        checkPasswordLegal:function (originPw,newPw,confirmNewPw) {
            if(!(this.old_pswInput.data.isLegal && this.new_pswInput.data.isLegal && this.confirm_new_pswInput.data.isLegal)){
                msgbox.alert('密码填写有误，请按提示进行修改');
                return false;
            }

            if(originPw === newPw){
                msgbox.alert('新旧密码一致，请修改');
                // this.el.find('.save-password-warning').val('新旧密码一致，请修改');
                return false;
            }
            return true;
        },
        // getTargetInfo:function () {
        //     UserInfoService.getUserInfoByName(this.data.targetUserName).done((result) => {
        //         if(result.success === 1){
        //             //获取data
        //             console.log(result);
        //             let data = result.rows;
        //             this.actions.displayTargetInfo(data);
        //         }else{
        //             msgbox.alert("获取数据失败");
        //             // PersonSetting.hide();
        //         }
        //     });
        // },
        // displayTargetInfo:function (data) {
        //     this.el.find('.department-info').val(data.user_department);
        //     this.el.find('.email-info').val(data.user_email);
        //     this.el.find('.position-info').val(data.user_job);
        //     this.el.find('.phone-info').val(data.user_tel);
        //     this.el.find('.name').html(this.data.targetUserName.name);
        //     if(data.avatar === ""){
        //         this.data.avatar = "";
        //     }else{
        //         this.data.avatar = "/mobile/get_file/?file_id=" + data.avatar + "&download=0";
        //     }
        //     this.actions.initInfo();
        // },
    },
    binds:[
        {
            event:'click',
            selector:'.avatar-box',
            callback:function(){
                this.actions.setAvatar();       //打开头像设置页面
            }
        },
        {
            event:'click',
            selector:'.agent-group',
            callback:function(){
                this.actions.setAgent();         //设置代理
            }
        },
        {
            event:'click',
            selector:'.login-group',
            callback:function(){
                this.actions.otherLogin();      //他人登录页面
            }
        },{
            event:'click',
            selector:'.show-personal-info',
            callback:function(){
                this.actions.showPersonalInfo();        //显示个人信息
            }
        },{
            event:'click',
            selector:'.show-modify-password',
            callback:function(){
                this.actions.showModifyPassword();      //切换至修改密码
            }
        },{
            event:'click',
            selector:'.edit-email',
            callback:function(){
                this.actions.editEmail();       //编辑邮箱
            }
        },{
            event:'blur',
            selector:'.email-info',
            callback:function(){
                this.actions.saveEdit();        //保存邮箱
            }
        },{
            event:'click',
            selector:'.edit-tel',
            callback: function(){
                this.actions.editTel();         //编辑电话
            }
        },{
            event:'blur',
            selector:'.phone-info',
            callback:function(){
                this.actions.saveEdit();        //保存电话
            }
        },{
            event:'click',
            selector:'.confirm-btn',
            callback:_.debounce(function(){             //修改密码确认
                this.actions.modifyPassword();
            },500),
        }
    ],
    afterRender:function () {
        this.actions.initInfo();
        this.actions.initPasswordPage();
        // this.actions.initAvatar();
    },
    firstAfterRender:function () {
        //窗口监听来自子窗口的设置头像的消息
        Mediator.on("personal:setAvatar",() => {
            this.actions.resetAvatar();
        })
    },
    beforeDestory:function () {
        // Mediator.removeAll("personal:setAvatar");
    }
};

class PersonalSetting extends Component{
    constructor(userName,mode){
        super(config);
        this.data.targetUserName = userName;
        this.data.mode = mode;
    }
}

export const PersonSetting  = {
    el:null,
    show: function() {
        let component = new PersonalSetting("","self");
        this.el = $('<div class="personal-setting-page">').appendTo(document.body);
        getData(component);
        component.render(this.el);
        this.el.erdsDialog({
            title: '账号设置',
            width: 540,
            height: 600,
            modal: true,
            close: function() {
                $(this).erdsDialog('destroy');
                component.destroySelf();
            }
        });
    },
    showUserInfo:function (targetName) {
        UserInfoService.getUserInfoByName(targetName).done((result) => {
            if(result.success === 1){
                //获取data
                userInfoDisplay.data.userInfo = result.rows;
                userInfoDisplay.data.userName = targetName.name;

                PMAPI.openDialogByComponent(userInfoDisplay,{
                    width: 350,
                    height: 500,
                    title: "人员信息"
                })
            }else{
                msgbox.alert("获取数据失败");
                // PersonSetting.hide();
            }
        });
    },
    hide:function () {
        this.el.erdsDialog('close');
    }
};