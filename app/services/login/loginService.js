//具体实现登录与后台交互
import {HTTP} from "../../lib/http"
import {Utils} from "./utils"

export const LoginService = {
    http:HTTP,
    utils:Utils,
    isNeedDownload:false,
    username_value:'',
    password_value:'',
    userName:'',

    support:function () {
        return this.isNeedDownload;     //添加浏览器检测
    },
    getVersionInfo:function () {
        return this.http.postImmediately({
            type:'post',
            url:'/get_revision_info/',
        })
    },
    userLogin:function (data) {
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
        console.log(body);
        return this.http.postImmediately({
            type:'post',
            url:url,
            data:body
        })
    }
};