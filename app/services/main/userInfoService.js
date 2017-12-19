import {HTTP} from "../../lib/http"
import {Utils} from "./utils"

export const UserInfoService = {
    http:HTTP,
    utils:Utils,
    /**
     * 向后台发送编辑的用户信息请求
     * @param data
     * @returns {*|Deffered}
     */
    saveInfo:function (data) {
        let url = '/save_person_info/';
        let body = this.utils.formatParams(data);

        return this.http.postImmediately({
            url:url,
            type:"post",
            data:body
        });
    },
    /**
     * 向后台发送修改密码信息请求
     * @param data
     * @returns {*|Deffered}
     */
    modifyPassword:function (data) {
        let url = '/change_person_password/';
        let body = this.utils.formatParams(data);

        return this.http.postImmediately({
            url:url,
            type:"post",
            data:body
        });
    },
    /**
     * 向后台发送存储头像数据请求
     * @param data
     * @returns {*|Deffered}
     */
    saveAvatar:function (data) {
        let url= '/user_preference/';
        let formatData = JSON.stringify(data);
        let body = {
            action:"save",
            content:formatData,
            pre_type:3
        };

        return this.http.postImmediately({
            url:url,
            type:"post",
            data:body
        });
    },
    /**
     * 请求agent界面信息
     * @returns {*|Deffered}
     */
    getAgentData:function () {
        let url = '/get_agent/';
        return this.http.getImmediately({
            type:"get",
            url:url
        })
    },
    /**
     * 保存设置代理信息请求
     * @param data
     * @returns {*|Deffered}
     */
    saveAgentData:function (data) {
        let url = '/set_agent/';
        data.workflow_names = JSON.stringify(data.workflow_names);
        return this.http.postImmediately({
            type:'post',
            url:url,
            data:data
        })
    },
    /**
     * 关闭用户代理代理
     * @param data
     * @returns {*|Deffered}
     */
    shutDownAgent:function (data) {
        let url = '/set_agent/';
        let body = Utils.formatParams(data);

        return HTTP.postImmediately({
            url:url,
            data:body,
            type:"post"
        })
    },
    /**
     * 获取系统config
     * @returns {*|Promise}
     */
    getSysConfig:function () {
        let url = 'sysConfig';
        let res = HTTP.post(url);
        HTTP.flush();
        return res;
    },
    /**
     * 获取全部用户信息
     * @returns {*|Deffered}
     */
    getAllUsersInfo:function () {
        let url = '/get_all_userInfo/';
        return HTTP.getImmediately({
            url:url,
            type:"get"
        })
    },
    /**
     * 获取全局搜索历史记录
     * @returns {*|Deffered}
     */
    getSearchHistory:function () {
        let url = '/search_history/';
        return HTTP.getImmediately({
            url:url,
            type:"get"
        })
    },
    /**
     * 保存全局搜索历史记录
     * @param data
     * @returns {*|Deffered}
     */
    saveGlobalSearchHistory:function (data) {
        let url = '/search_history/';
        let body = {
            action:"save",
            content:data
        };
        body = Utils.formatParams(body);

        return this.http.postImmediately({
            url:url,
            data:body,
            type:"post"
        })
    },
    /**
     * 根据id请求他人登录
     * @param user_id
     */
    change_login_user:function (user_id) {
        return HTTP.getImmediately('/change_login_user/?user_id='+ user_id).done((result) => {
            if(result.success === 1){
                return result;
            }
        });
    },
    /**
     * 向后台请求注册
     * @param json
     * @returns {*|Deffered}
     */
    register:function (json) {
        let url = '/register/';
        let body = this.utils.formatParams(json);

        return this.http.postImmediately({
            url:url,
            data:body,
            type:'post'
        })
    },
    /**
     * 保存用户快捷设置（快捷打开bi/日历/home）,以数组形式储存
     * @param json
     * @param json2
     * @returns {Promise.<*[]>|Promise<[any , any , any , any , any , any , any , any , any , any]>}
     */
    saveUserConfig:function (json) {
        let url = 'user_preference';
        let res = HTTP.post(url,json);
        HTTP.flush();
        console.log(res);
        return res;
    },
    /**
     * 根据用户名获取用户基本信息（内置信息展示）
     * @param json
     * @returns {*|Deffered}
     */
    getUserInfoByName:function (json) {
        let url = '/get_user_info_by_name/';
        return HTTP.postImmediately(url,Utils.formatParams(json))
    },
    /**
     * 重置密码
     * @param json
     * @returns {*|Deffered}
     */
    resetPassword:function (json) {
        let url = '/validate_url_or_reset_pwd/';
        let body = Utils.formatParams(json);

        return HTTP.postImmediately(url,body);
    },
    getUserTheme:function () {
        let url= '/user_preference/';
        let body = {
            action:"get",
            pre_type:9
        };

        return this.http.postImmediately({
            url:url,
            type:"post",
            data:body
        });
    },
    saveUserTheme:function (data) {
        let url= '/user_preference/';
        let body = {
            action:"save",
            content:data,
            pre_type:9
        };

        return this.http.postImmediately({
            url:url,
            type:"post",
            data:body
        });
    },
    getHomePageList:function () {
        let url = '/bi/home/?query_mark=home';
        return this.http.getImmediately({
            url:url,
            type:"get"
        });
    },
    // saveHomePageConfig:function (json3) {
    //     let url = '/user_preference/';
    //
    //     return HTTP.postImmediately({
    //         url:url,
    //         type:"post",
    //         data:json3
    //     });
    // }
};