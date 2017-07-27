
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
     * @param url 请求的接口路径
     * @param params 请求的接口的参数
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

    /**
     * 发送所有缓存的请求， get和post单独分开发
     */
    flush: function() {

        if (GetSet.size > 0) {
            $.get(url, {actions: [...GetSet]})
                .then((response) => {
                    _dealResponse(response);
                });
        }

        if (PostSet.size > 0) {
            $.post(url, {actions: [...GetSet]})
                .then((response) => {
                    _dealResponse(response);
                });
        }


    },

    _dealResponse: function(response) {
        if (response.succ === 1) {

        } else {

        }
    }

}