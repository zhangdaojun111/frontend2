import {HTTP} from "../../lib/http";

export const AsideChartService = {

    /**
     * 获取导航栏列表数据
     * @param
     * @returns {Promise}
     */
    async delChart(chart_id) {
        const res = await HTTP.getImmediately('/bi/save_del_bi_setting',{"chart_id":chart_id});
        return new Promise((resolve, reject) => {
            if (res['success']===1) {
                resolve(res);
            } else {
                reject(res);
            }
        })
    }
};
