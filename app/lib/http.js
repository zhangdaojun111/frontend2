
$.ajaxSetup({
    dataType: 'json'
});

const GetSet = new Set();
const PostSet = new Set();
const Hash = {};
const prefix = 'erds-';
let counter = 10000;




function getKey() {
    return prefix + counter ++;
}


export default {

    /**
     * 缓存的get请求，必须通过flush才能发送
     * @param url
     * @param params
     * @returns {Promise}
     */
    get: function(url, params) {
        const key = getKey();
        GetSet.add({
            url: url,
            key: key,
            params: params
        });
        const promise = new Promise((resolve) => {
            Hash[key] = resolve;
        });
        return promise;
    },

    post: function(url, data) {
        const key = getKey();
        PostSet.add({
            url: url,
            key: key,
            params: params
        });
        const promise = new Promise((resolve) => {
            Hash[key] = resolve;
        });
        return promise;
    },

    flush: function() {
        
    }

}