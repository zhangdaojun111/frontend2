import {HTTP} from "../../lib/http";

export const ViewsService = {

    /**
     * 获取导航栏列表数据
     * @param
     * @returns {Promise}
     */
    async getItemName(data) {
        const res = await HTTP.getImmediately('/bi/set_new_view_data',data);
        return new Promise((resolve, reject) => {
            if (res['success']===1) {
                resolve(res);
            } else {
                reject(res);
            }
        })
    }
};
