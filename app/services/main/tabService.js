import {HTTP} from "../../lib/http"
import {Utils} from "./utils";

export const TabService = {
    getFavoriteList:function () {
        let favorite = {};
        favorite['query_type'] = 'get';
        let url = '/personal_view/';
        let para = Utils.formatParams(favorite);

        return HTTP.postImmediately({
            url:url,
            data:para,
            type:'post'
        })
    },
    saveFavoriteItem:function (data) {
        let url = '/personal_view/';
        let para = Utils.formatParams(data);
        return HTTP.postImmediately({
            url:url,
            data:para,
            type:'post'
        })
    },

    deleteFavoriteItem:function (data) {
        let url = '/personal_view/';
        let para = Utils.formatParams(data);

        return HTTP.postImmediately({
            url:url,
            data:para,
            type:'post'
        })
    },
    // 记录用户打开新标签
    onOpenTab:function (id) {
        console.log("do save tabs");
        let url = '/update_tab_data/?';
        let param  = Utils.formatParams({'tab_id':id,'event_tab':1});
        url = url + param;
        return HTTP.getImmediately({
            url:url,
            type:"get",
        })
    },
    // 记录用户关闭标签
    onCloseTab:function (id,focus_id) {
        let url = '/update_tab_data/?';
        let param  = Utils.formatParams({'tab_id':id,'event_tab':0,'focus_tab_id':focus_id});
        url = url + param;
        return HTTP.getImmediately({
            url:url,
            type:"get",
        })
    },

    getOpeningTabs:function () {
        //commonTabs获取未关闭tabs
        let url1 = 'get_opening_tabs';
        let commonTabs = HTTP.get(url1);

        //specialTabs获取bi、日历、home的设置偏好，返回数组
        let url2 = 'user_preference';
        let json = {action:'get', pre_type:4};
        let specialTabs = HTTP.get(url2,json);

        let res = Promise.all([commonTabs,specialTabs]);
        HTTP.flush();
        return res;
    }
};