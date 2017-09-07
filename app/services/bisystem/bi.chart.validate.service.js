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
        if (value) {
            return true;
        } else {
            return false;
        };
    }
};
export {formChartValidateService}

