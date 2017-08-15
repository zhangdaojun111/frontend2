import {HTTP} from "../../lib/http";

export const ViewsSaveService = {

    /**
     * 保存序列号
     * @paramvd data{id:''}
     * @returns {Promise}
     */
    async saveData(data) {
        const res = await HTTP.getImmediately('/bi/set_new_view_sort',data);
        return new Promise((resolve, reject) => {
            if (res['success']===1) {
                resolve(res);
            } else {
                reject(res);
            }
        })
    }
};
