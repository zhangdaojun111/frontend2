//具体实现登录与后台交互
import {HTTP} from "../../lib/http"
import {Utils} from "./utils"

export const LoginService = {
    http:HTTP,
    utils:Utils,
    needDownload:false,
    username_value:'',
    password_value:'',
    userName:'',

    //检查当前浏览器是否为chrome
    support:function () {
        let browser = this.currentBrowser();
        if (!browser['chrome']){
            this.needDownload = true;
        }
        return this.needDownload;
    },
    //获取浏览器信息
    currentBrowser:function(){
        let Browser = {
        };
        let ua = navigator.userAgent.toLowerCase();
        let s;
        (s = ua.match(/msie ([\d.]+)/)) ? Browser['ie'] = s[1] :
            (s = ua.match(/firefox\/([\d.]+)/)) ? Browser['firefox'] = s[1] :
                (s = ua.match(/chrome\/([\d.]+)/)) ? Browser['chrome'] = s[1] :
                    (s = ua.match(/opera.([\d.]+)/)) ? Browser['opera'] = s[1] :
                        (s = ua.match(/version\/([\d.]+).*safari/)) ? Browser['safari'] = s[1] : 0;
        return Browser;
    },
    getVersionInfo:function () {
        return this.http.postImmediately({
            type:'post',
            url:'/get_revision_info/',
        })
    },
    userLoginVerification:function (data) {
        //登录
        let body = this.utils.formatParams(data);
        return this.http.postImmediately({
            type:'post',
            url:'/login/',
            data:body
        });
    },
    findPassword:function (username) {
        //找回密码
        let url = '/validate_username/';
        let body = this.utils.formatParams({username:username});
        return this.http.postImmediately({
            type:'post',
            url:url,
            data:body
        })
    }
};