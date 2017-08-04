import Component from '../../../lib/component';
import 'jquery-ui/ui/widgets/dialog.js';
import './personal-settings.scss';
import template from './personal-settings.html';
import {HTTP} from  '../../../lib/http'
import msgbox from '../../../lib/msgbox';

function getData(component_instance) {
    console.log(window.config.sysConfig.userInfo);
    _.defaultsDeep(component_instance.data, {
    avatar: window.config.sysConfig.userInfo.avatar,
    name:window.config.sysConfig.userInfo.name,
    username: window.config.sysConfig.userInfo.username,
    user_department:"test",
    // user_position:window.userInfo.sysConfig.,
    user_email:window.config.sysConfig.userInfo.email,
    // user_phone:window.userInfo.sysConfig.,
    });
}

let config = {
    template:template,
    data:{
        avatar:'',
    },
    actions:{
        initInfo:function () {
            // 初始化，检测用户头像路径返回值，没有则显示默认头像
            if(this.data.avatar === ''){
                console.log(this.el.find("img"));
                this.el.find("img").attr("src","../../../../assets/images/framework/default_avatar.png")     //属性修改成功，图片未显示
            }
        }
    },
    afterRender:function () {
       this.actions.initInfo();
       //事件绑定
        console.log("do event");
        this.el.on("click",".user_avatar",() => {
            //打开头像设置页面
            console.log("set avatar");
        }).on("click","a.set-proxy",() => {
            //设置代理
            console.log("set proxy");
        }).on("click",".show-personal-info",() => {
            //切换至个人资料
            this.el.find("div.personal-info").show();
            this.el.find("div.modify-password").hide();
        }).on("click",".show-modify-password",() => {
            //切换至修改密码
            this.el.find("div.personal-info").hide();
            this.el.find("div.modify-password").show();
        }).on("click","span.edit-info-btn",() => {
            //编辑个人资料
            console.log("edit personal info");
        }).on("click",".clear-storage-btn",() => {
            //清除缓存
            console.log("clear storage");
        }).on("click",".cancel-btn",() => {
            //取消编辑
            console.log("cancel edit");
        }).on("click",".save-btn",() => {
            //保存
            console.log("edit save");
        }).on("click",".confirm-btn",() => {
            //修改密码确认
            console.log("confirm modify pw");
        })
    },
    beforeDestory:function () {

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
        let el = $('<div>').appendTo(document.body);
        getData(component);
        component.render(el);
        el.dialog({
            title: '个人设置',
            width: 400,
            height: 600,
            close: function() {
                component.destroySelf();
            }
        });
    }
}