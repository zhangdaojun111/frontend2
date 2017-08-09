import Component from '../../../lib/component';
import 'jquery-ui/themes/base/base.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/ui/widgets/dialog.js';
import './personal-settings.scss';
import template from './personal-settings.html';
import {UserInfoService} from '../../../services/main/userInfoService';
import msgbox from '../../../lib/msgbox';
import SetAvatar from './set-avatar/set-avatar';
import SetAgent from './set-agent/set-agent';
import Mediator from "../../../lib/mediator";

function getData(component_instance) {
    // console.log(window.config.sysConfig.userInfo);
    _.defaultsDeep(component_instance.data, {
    avatar: window.config.sysConfig.userInfo.avatar,
    name:window.config.sysConfig.userInfo.name,
    username: window.config.sysConfig.userInfo.username,
    user_department:"开发部",
    user_position:"manager",
    user_email:window.config.sysConfig.userInfo.email,
    user_phone:window.config.sysConfig.userInfo.tel,
    });
}

let config = {
    template:template,
    // dataService:UserInfoService,
    data:{},
    actions:{
        initInfo:function () {
            // 初始化，检测用户头像路径返回值，没有则显示默认头像
            if(this.data.avatar === ''){
                this.el.find("img").attr("src","../../../../assets/images/framework/default_avatar.png")     //属性修改成功，图片未显示
            }
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
                SetAgent.show();
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
        // saveEmail:function () {
        //
        // },
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
                useremail: this.user_email,
                usertel: this.data.user_phone
            };
            this.dataService.saveInfo(data).done((result) => {
                // msgbox.alert("保存成功");
                console.log("保存成功");
            }).fail((err) => {
                // msgbox.alert("修改失败");
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

            this.dataService.modifyPassword(data).done((result) => {
                if(result.success === 1){
                    msgbox.alert("密码修改成功！")
                }else{
                    msgbox.alert(result.error)
                }
            }).fail((err) => {
                console.log(err);
            })
        },
        clearLocalStorage:function(){
            window.localStorage.clear();
            $(window).attr("location","/login");
        }
    },
    afterRender:function () {
       this.actions.initInfo();
       //事件绑定
        this.el.on("click","div.avatar-box",() => {           //打开头像设置页面
            this.actions.setAvatar();
        }).on("click","div.agent-group",() => {                 //设置代理
            this.actions.setAgent();
        }).on("click","div.login-group",() => {
            //他人登录
            console.log("login by other");
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
        }).on("click",".confirm-btn",() => {        //修改密码确认
            this.actions.modifyPassword();
        }).on("input","input.new-pw",() => {        //监听旧密码的输入
            this.actions.isLegal();
        });
        //窗口监听来自子窗口的设置头像的消息
        Mediator.on("personal:setAvatar",(data) => {
            // console.log("on mess",this,this.el);
            this.el.find("img.user-avatar")
                .attr("src",data.src)
                .css("width",data.width)
                .css("height",data.height)
                .css("left",data.left)
                .css("top",data.top);
            msgbox.alert("头像设置成功!");
        })
    },
    beforeDestory:function () {
        // Mediator.removeAll();
    }
};

class PersonalSetting extends Component{
    constructor(){
        super(config);
    }
}

export default {
    show: function() {
        let component = new PersonalSetting();
        component.dataService = UserInfoService;
        let el = $('<div id="personal-setting-page">').appendTo(document.body);
        getData(component);
        component.render(el);
        el.dialog({
            title: '账号设置',
            width: 540,
            height: 600,
            modal: true,
            close: function() {
                component.destroySelf();
            }
        });
    }
}