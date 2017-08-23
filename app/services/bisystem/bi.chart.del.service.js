import {HTTP} from "../../lib/http";

export const AsideChartService = {

    /**
     * 删除列表
     * @param data{chart_id:id}
     * @returns {Promise}
     */
    async delChart(data) {
        const res = await HTTP.getImmediately('/bi/save_del_bi_setting',data);
        return new Promise((resolve, reject) => {
                resolve(res);
        })
    }
};
