import {HTTP} from "../../lib/http"
import {Utils} from "./utils"

export const UserInfoService = {
    http:HTTP,
    utils:Utils,
    // 向后台发送编辑的用户信息
    saveInfo:function (data) {
        let url = '/save_person_info/';
        let body = this.utils.formatParams(data);

        return this.http.postImmediately({
            url:url,
            type:"post",
            data:body
        });
    },
    //向后台发送修改密码信息
    modifyPassword:function (data) {
        let url = '/change_person_password/';
        let body = this.utils.formatParams(data);

        return this.http.postImmediately({
            url:url,
            type:"post",
            data:body
        });
    },
    //向后台发送存储头像数据
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
    //请求agent界面信息
    getAgentData:function () {


        let url = '/get_agent/';
        return this.http.getImmediately({
            type:"get",
            url:url
        })
    },
    saveAgentData:function (data) {
        console.log(data);
        let url = '/set_agent/';
        data.workflow_names = JSON.stringify(data.workflow_names);
        return this.http.postImmediately({
            type:'post',
            url:url,
            data:data
        })
    },
    getSysConfig:function () {
        let url = 'sysConfig';
        let res = HTTP.post(url);
        HTTP.flush();
        return res;
    },
    getAllUsersInfo:function () {
        let url = '/get_all_userInfo/';
        return HTTP.getImmediately({
            url:url,
            type:"get"
        })
    },
    getSearchHistory:function () {
        let url = '/search_history/';
        return HTTP.getImmediately({
            url:url,
            type:"get"
        })
    },
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
    change_login_user:function (user_id) {
        return HTTP.getImmediately('/change_login_user/?user_id='+ user_id).done((result) => {
            if(result.success === 1){
                return result;
            }
        });
    },
    register:function (json) {
        let url = '/register/';
        let body = this.utils.formatParams(json);

        return this.http.postImmediately({
            url:url,
            data:body,
            type:'post'
        })
    },

    saveUserConfig:function (json,json2) {
        let url = 'user_preference';

        let p1 = HTTP.post(url,json);
        let p2 = HTTP.post(url,json2);

        let res = Promise.all([p1,p2]);
        HTTP.flush();
        return res;
    },
    getUserInfoByName:function (json) {
        console.log(json);
        let url = '/get_user_info_by_name/';
        return HTTP.postImmediately(url,Utils.formatParams(json))
    }
};