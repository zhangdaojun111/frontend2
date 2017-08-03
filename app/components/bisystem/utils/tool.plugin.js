/**
 * Created by xxt on 2017/6/6.
 * 插件工具箱
 */

let ToolPlugin = {

    /**
     * 对象复制
     * @param json
     */
    clone: (json) => {
        let res;
        if (json.constructor === Array) {
            res = [];
        } else {
            res = {};
        }
        for(let key in json) {
            if (json[key] === undefined) {
                res[key] = undefined;
            } else if (json[key] === null) {
                res[key] = null;
            } else if (json[key].constructor === Array || json[key].constructor === Object) {
                res[key] = ToolPlugin.clone(json[key]);
            } else {
                res[key] = json[key];
            }
        }
        return res;
    },

    /**
     * 从数组里面删除一个对象
     * @param array
     * @param target
     * @returns {Array<T>}
     */
    removeFromArray: (array, target) => {
        let index = array.indexOf(target);
        array.splice(index, 1);
        return array;
    },

    /**
     * 转换数字
     * 例如将749转化为800
     * @param num
     */
    fixMaxNumber: (num) => {

        if (num === 0) {
            return num;
        }

        if (num > 0) {
            // 有可能是浮点数
            num = Math.ceil(num);

            let len = num.toString().length,
                divisor = 1;

            for (let i =0; i < len -1; i++) {
                divisor = divisor * 10;
            }

            return Math.ceil(num/divisor) * divisor;
        } else {
            num = -Math.ceil(num);

            let len = num.toString().length,
                divisor = 1;

            for (let i =0; i < len -1; i++) {
                divisor = divisor * 10;
            }

            return -Math.floor(num/divisor) * divisor;
        }
    },

    fixMinNumber: (num) => {

        if (num === 0) {
            return num;
        }

        if (num > 0) {
            // 有可能是浮点数
            num = Math.floor(num);

            let len = num.toString().length,
                divisor = 1;

            for (let i =0; i < len -1; i++) {
                divisor = divisor * 10;
            }

            return Math.floor(num/divisor) * divisor;
        } else {
            num = -Math.ceil(num);

            let len = num.toString().length,
                divisor = 1;

            for (let i =0; i < len -1; i++) {
                divisor = divisor * 10;
            }

            return -Math.ceil(num/divisor) * divisor;
        }
    },


    /**
     * 对象比较，注意只是浅层比较
     * @param source
     * @param target
     * @returns {boolean}
     */
    equal:(source, target) => {
        let res = true;
        for(let key in source) {
            if (source[key] !== target[key]) {
                res = false;
                break;
            }
        }
        return res;
    }

};

// declare ToolPlugin as any;

export {ToolPlugin};