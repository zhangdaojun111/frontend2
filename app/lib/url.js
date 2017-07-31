export default {

    getParam: function(url) {
        let res = {};
        if (url.indexOf("?") != -1) {
            let str = url.substr(1);
            let strs = str.split("&");
            for(var i = 0; i < strs.length; i ++) {
                res[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
            }
        }
        return res;
    },

    getOrigin: function() {

    },

    getUrl: function(url, data) {
        if (url.indexOf('?') === -1) {
            return url + '?' + $.param(data);
        } else {
            return url + '&' + $.param(data);
        }
    }

}