import xss from 'xss';


$.ajaxSetup({
    dataType: 'json'
});

const GetSet = new Set();
const PostSet = new Set();
const Hash = {};
const prefix = 'erds-';
let counter = _.now();


function getKey() {
    return prefix + counter ++;
}

function xssObj(target) {
    if (target) {
        if (_.isString(target)) {
            return xss(target);
        } else if (_.isArray(target)) {
            target.forEach((item, index) => {
                target[index] = xssObj(item);
            });
            return target;
        } else if (_.isPlainObject(target)) {
            _.forEach(target, function(value, key) {
                target[key] = xssObj(value);
            });
            return target;
        } else {
            return target;
        }
    } else {
        return target;
    }

}

export const HTTP = {

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
            params: xssObj(params)
        });
        const promise = new Promise((resolve) => {
            Hash[key] = resolve;
        });
        return promise;
    },

    /**
     * 缓存的post请求，必须通过flush才能发送
     * @param url
     * @param params
     * @returns {Promise}
     */
    post: function(url, params) {
        const key = getKey();
        PostSet.add({
            url: url,
            key: key,
            params: xssObj(params)
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
            let array = [...GetSet];
            $.get('/pipe/', {actions: JSON.stringify(array)})
            .then((response) => {
                this._dealResponse(xssObj(response));
            }).fail(() => {
                this._dealResponseError(array);
            });
            GetSet.clear();
        }

        if (PostSet.size > 0) {
            let array = [...PostSet];
            $.post('/pipe/', {actions: JSON.stringify(array)})
            .then((response) => {
                this._dealResponse(xssObj(response));
            }).fail(() => {
                this._dealResponseError(array);
            });
            PostSet.clear();
        }
    },

    /**
     * 内部方法，不允许外部调研，处理ajax返回数据
     * @param response
     * @private
     */
    _dealResponse: function(response) {
        var data = response.data || {};
        for(let key in data) {
            if (Hash[key]) {
                Hash[key](data[key]);
                delete Hash[key];
            }
        }
    },

    /**
     * 内部方法，不允许外部调研，处理ajax请求失败
     * @param array
     * @private
     */
    _dealResponseError: function(array) {
        array.forEach(function(obj) {
            if (obj.key !== undefined && Hash[obj.key]) {
                Hash[obj.key]({
                    succ: 0,
                    msg: '请求失败'
                })
            }
        })
    },

    /**
     * 同$.get
     * @returns Deffered
     */
    getImmediately: function() {
        let args = _.toArray(arguments);
        args = xssObj(args);
        return $.get.apply($, args).done((response) => {
            xssObj(response);
        });
    },

    /**
     * 同$.post
     * @returns Deffered
     */
    postImmediately: function() {
        let args = _.toArray(arguments);
        args = xssObj(args);
        return $.post.apply($, args).done((response) => {
            xssObj(response);
        });
    },

    /**
     * 同$.ajax
     * @returns Deffered
     */
    ajaxImmediately: function() {
        let args = _.toArray(arguments);
        args = xssObj(args);
        return $.ajax.apply($, args).done((response) => {
            xssObj(response);
        });
    }

}