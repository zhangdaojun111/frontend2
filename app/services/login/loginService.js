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

    /**
     * 检查当前浏览器是否为chrome
     * @returns {boolean}
     */
    support:function () {
        let browser = this.currentBrowser();
        console.log(browser);
        if (!browser['chrome']){
            this.needDownload = true;
        }
        return this.needDownload;
    },
    /**
     * 获取浏览器信息
     * @returns {{}}
     */
    currentBrowser:function(){
        let Browser = {
        };
        let ua = navigator.userAgent.toLowerCase();
        console.log(ua);
        let s;
        (s = ua.match(/msie ([\d.]+)/)) ? Browser['ie'] = s[1] :
            (s = ua.match(/firefox\/([\d.]+)/)) ? Browser['firefox'] = s[1] :
                (s = ua.match(/chrome\/([\d.]+)/)) ? Browser['chrome'] = s[1] :
                    (s = ua.match(/opera.([\d.]+)/)) ? Browser['opera'] = s[1] :
                        (s = ua.match(/version\/([\d.]+).*safari/)) ? Browser['safari'] = s[1] : 0;
        return Browser;
    },
    /**
     * 获取版本信息
     * @returns {*|Deffered}
     */
    getVersionInfo:function () {
        return this.http.postImmediately({
            type:'post',
            url:'/get_revision_info/',
        })
    },
    /**
     * 向后台发送账号、密码请求登录
     * @param data
     * @returns {*|Deffered}
     */
    userLoginVerification:function (data) {
        //登录
        let body = this.utils.formatParams(data);
        return this.http.postImmediately({
            type:'post',
            url:'/login/',
            data:body
        });
    },
    /**
     * 根据用户名找回密码
     * @param username
     * @returns {*|Deffered}
     */
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