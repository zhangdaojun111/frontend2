import {HTTP} from "../../lib/http"
import {Utils} from "./utils";
export const GlobalService = {
    http:HTTP,

    
    sendSearch:function (data) {
        let url = '/search_full_text/';
        let body =  Utils.formatParams(data);

        return this.http.postImmediately({
            url:url,
            data:body,
            type:'post'
        })
    }


};