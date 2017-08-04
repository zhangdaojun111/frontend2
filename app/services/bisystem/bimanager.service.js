import {HTTP} from "../../lib/http";

export const biManagerService = {

    /**
     * 获取导航栏列表数据
     * @param data
     * @returns {Promise}
     */
    async getCellLayout(data) {
        const res = await HTTP.getImmediately('bi/get_all_bi_setting', data);
        return new Promise((resolve, reject) => {
            if (res['success']===1) {
                resolve(res['data']);
            } else {
                reject(res);
            }
        })
    },
};
