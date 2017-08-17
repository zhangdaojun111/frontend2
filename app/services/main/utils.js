//工具函数

export const Utils = {
    formatParams: function (params) {            //格式化用户名和密码
        let result = [];
        for (let k in params) {
            if (typeof(params[k]) === 'object') {
                result.push(k + '=' + JSON.stringify(params[k]));
            } else {
                result.push(k + '=' + params[k]);
            }
        }
        return result.join('&')
    }

};