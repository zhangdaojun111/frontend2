import {HTTP} from "../../lib/http";

export const ViewsEditService = {

    /**
     * 获取导航栏列表数据
     * @param
     * @returns {Promise}
     */
    async getCharts() {
        const res = await HTTP.getImmediately('/bi/get_all_bi_setting');
        return new Promise((resolve, reject) => {
            if (res['success']===1) {
                resolve(res);
            } else {
                reject(res);
            }
        })
    },
};
