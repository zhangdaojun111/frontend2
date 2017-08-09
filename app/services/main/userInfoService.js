import {HTTP} from "../../lib/http"
import {Utils} from "../login/utils"


export const UserInfoService = {
    http:HTTP,
    utils:Utils,
    // 向后台发送编辑的用户信息
    saveInfo:function (data) {
        console.log("do saveInfo");
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
        // console.log(data.src);
        // data.src = encodeURIComponent(data.src);
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
        let url = '/set_agent/';
        return this.http.postImmediately({
            type:'post',
            url:url,
            data:data
        })
    },
    getSysConfig:function () {
        console.log("do getSysConfig");

    },
    getAllUsersInfo:function () {
        let url = '/get_all_userInfo/';
        return HTTP.getImmediately({
            url:url,
            type:"get"
        })
    },
    change_login_user:function (user_id) {
        return HTTP.getImmediately('/change_login_user/?user_id='+ user_id).done((result) => {
            if(result.success === 1){
                return result;
            }
        });
    }
};