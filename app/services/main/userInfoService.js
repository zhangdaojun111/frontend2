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
    }
};