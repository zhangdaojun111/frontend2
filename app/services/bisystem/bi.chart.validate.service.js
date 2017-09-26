/**
 * Created by birdyy on 2017/9/7.
 * form 配置表单验证
 */
let formChartValidateService = {

    /**
     * 判断是否必填值
     * @param data = 传递过来的值
     */
    required(value) {
        let result;
        if (_.isArray(value)){// 判断是否数组
            if (value.length > 0) {
                result = true;
            } else {
                result = false;
            }
        } else if (_.isString(value)) {// 判断是否为字符串
            result = value ? true : false;
        } else if (_.isObject(value)) {// 判断是否为对象
            result = value['id'] ? true : false
        }
        return result;
    },

    /**
     * 判断是否正整数
     * @param data = 传递过来的值
     */
    positiveInteger(value) {
        let result;
        if (parseInt(value) > 0) {
            result = true;
        } else {
            result = false;
        }
        return result;
    },

    /**
     * 折线柱状图多y轴验证
     * @param data = y轴字段
     */
    validateYAxis(data = []) {
        let result = true;
        for(let y of data) {
           if (!y['field']) {
               result = false;
               break;
           }
        }
        return result;
    }

};
export {formChartValidateService}

