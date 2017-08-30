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
import SetAvatar from './set-avatar/set-avatar';
import {agentSetting} from './set-agent/set-agent';
import OtherLogin from "../login-by-other/login-by-other";
import Mediator from '../../../lib/mediator';
import userInfoDisplay from './user-info-display/user-info-display';
import {PMAPI} from '../../../lib/postmsg';

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
    },
    actions:{
        initInfo:function () {
            // 初始化，检测用户头像路径返回值，没有则显示默认头像
            let src = this.data.avatar;
            if(src !== ''){
                let $img = $("<img>").addClass("user-avatar");
                $img.attr('src', src);
                this.el.find("div.avatar-box").append($img);
                let that = this;
                $img.on('error', function () {
                    console.log('error la');
                    that.el.find("div.avatar-box").addClass('default_avatar');
                    $img.remove();
                });
            }else{
                console.log('no src');
                this.el.find("div.avatar-box").addClass('default_avatar');
            }
        },
        onImageError: function () {

        },
        setAvatar(){
            //检查页面是否已创建
            let $page = $(document).find("div#set-avatar-page");
            if($page.length !== 0){
                $page.focus();
            }else{
                //打开个人设置页面
                SetAvatar.show();
            }
        },
        setAgent(){
            //检查页面是否已创建
            let $page = $(document).find("div#set-agent-page");
            if($page.length !== 0){
                $page.focus();
            }else{
                //打开个人设置页面
                agentSetting.show();
            }
        },
        showPersonalInfo:function () {
            this.el.find("div.personal-info").show();
            this.el.find("div.modify-password").hide();
            this.el.find("div.show-personal-info").addClass("active");
            this.el.find("div.show-modify-password").removeClass("active");
        },
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
        editEmail:function () {
            this.el.find("input.email-info").removeAttr("disabled").focus();
        },
        editTel:function () {
            this.el.find("input.phone-info").removeAttr("disabled").focus();
        },
        cancelEdit:function () {
            this.el.find("input.email-info").val(this.data.user_email);
            this.el.find("input.phone-info").val(this.data.user_phone);
            this.el.find("input.email-info").attr("disabled",true);
            this.el.find("input.phone-info").attr("disabled",true);
            this.el.find("div.personal-foot").show();
            this.el.find("div.cancel-save").hide();
        },
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
        isLegal:function () {
            let newPw = this.el.find("input.new-pw").val();
            if(newPw !== ''){
              this.el.find("button.confirm-btn").removeAttr("disabled");
              this.el.find("span.ps-warn").hide();
            }else{
              this.el.find("button.confirm-btn").attr("disabled",true);
              this.el.find("span.ps-warn").show();
            }
        },
        modifyPassword:function () {
            let originPw = this.el.find("input.origin-pw").val();
            let newPw = this.el.find("input.new-pw").val();
            let confirmNewPw = this.el.find("input.confirm-new-pw").val();

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
                    msgbox.alert(result.error)
                }
            }).fail((err) => {
                console.log(err);
            })
        },
        otherLogin:function () {
            OtherLogin.show();
        },
        initAvatar:function () {
            let src = this.data.avatar;
            this.el.find("img.user-avatar")
                .attr("src",src)
        },
        clearLocalStorage:function(){
            window.localStorage.clear();
            $(window).attr("location","/login");
        },
        resetAvatar:function () {
            let $img = this.el.find("img.user-avatar");
            if($img.length === 0){
                $img = $("<img>").addClass("user-avatar");
                $img.attr("src",window.config.sysConfig.userInfo.avatar);
                this.el.find(".avatar-box").append($img);
            }else{
                $img.attr("src",window.config.sysConfig.userInfo.avatar);
            }
            msgbox.alert("头像设置成功!");
        },
        getTargetInfo:function () {
            UserInfoService.getUserInfoByName(this.data.targetUserName).done((result) => {
                if(result.success === 1){
                    //获取data
                    console.log(result);
                    let data = result.rows;
                    this.actions.displayTargetInfo(data);
                }else{
                    msgbox.alert("获取数据失败");
                    // PersonSetting.hide();
                }
            });
        },
        displayTargetInfo:function (data) {
            this.el.find('.department-info').val(data.user_department);
            this.el.find('.email-info').val(data.user_email);
            this.el.find('.position-info').val(data.user_job);
            this.el.find('.phone-info').val(data.user_tel);
            this.el.find('.name').html(this.data.targetUserName.name);
            if(data.avatar === ""){
                this.data.avatar = "";
            }else{
                this.data.avatar = "/mobile/get_file/?file_id=" + data.avatar + "&download=0";
            }
            this.actions.initInfo();
        },
    },
    afterRender:function () {
        if(this.data.mode === 'self'){
            this.actions.initInfo();
            this.actions.initAvatar();
            //事件绑定
            this.el.on("click","div.avatar-box",() => {           //打开头像设置页面
                this.actions.setAvatar();
            }).on("click","div.agent-group",() => {                 //设置代理
                this.actions.setAgent();
            }).on("click","div.login-group",() => {
                this.actions.otherLogin();
            }).on("click",".show-personal-info",() => {          //切换至个人资料
                this.actions.showPersonalInfo();
            }).on("click",".show-modify-password",() => {        //切换至修改密码
                this.actions.showModifyPassword();
            }).on("click","i.edit-email",() => {            //编辑邮箱
                this.actions.editEmail();
            }).on("blur","input.email-info",() => {            //保存邮箱
                this.actions.saveEdit();
            }).on("click","i.edit-tel",() => {            //编辑电话
                this.actions.editTel();
            }).on("blur","input.phone-info",() => {            //保存电话
                this.actions.saveEdit();
            }).on("click",".clear-storage-btn",() => {          //清除缓存
                this.actions.clearLocalStorage();
            }).on("click",".cancel-btn",() => {           //取消编辑
                this.actions.cancelEdit();
            }).on("click",".save-btn",() => {          //保存
                this.actions.saveEdit();
            }).on("click",".confirm-btn",_.debounce(() => {        //修改密码确认
                this.actions.modifyPassword();
            },500)).on("input","input.new-pw",() => {        //监听旧密码的输入
                this.actions.isLegal();
            });
        }else if(this.data.mode === 'other'){
            this.actions.getTargetInfo();
        }

        //窗口监听来自子窗口的设置头像的消息
        Mediator.on("personal:setAvatar",() => {
            this.actions.resetAvatar();
        })
    },
    beforeDestory:function () {
        Mediator.removeAll("personal:setAvatar");
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
        this.el.dialog({
            title: '账号设置',
            width: 540,
            height: 600,
            modal: true,
            close: function() {
                $(this).dialog('destroy');
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
                PMAPI.openDialogByComponent(userInfoDisplay, {
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
        this.el.dialog('close');
    }
};