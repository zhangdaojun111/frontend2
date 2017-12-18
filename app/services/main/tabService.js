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

        let url1 = 'get_opening_tabs';
        let p1 = HTTP.get(url1);

        // let url2 = 'user_preference';
        // let json = {action:'get', pre_type:4};
        // let p2 = HTTP.get(url2,json);
        //
        // let json2 = {action:'get', pre_type:5};
        // let p3 = HTTP.get(url2,json2);
        //
        // let json3 = {action:'get', pre_type:10};
        // let p4 = HTTP.get(url2,json3);

        let res = Promise.all([p1,p2,p3,p4]);
        HTTP.flush();
        return res;
    }
};