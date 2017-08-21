import {HTTP} from "../../lib/http"
import {Utils} from "./utils";


export const TabService = {
    http:HTTP,
    getFavoriteList:function () {
        let favorite = {};
        favorite['query_type'] = 'get';
        let url = '/personal_view/';
        let para = Utils.formatParams(favorite);
        console.log(para);

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
    }
};