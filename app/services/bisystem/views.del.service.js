import {HTTP} from "../../lib/http";

export const ViewsDelService = {

    /**
     * 删除数据
     * @param data{id:""}
     * @returns {Promise}
     */
    async delData(data) {
        const res = await HTTP.getImmediately('/bi/del_new_view_data',data);
        return new Promise((resolve, reject) => {
            if (res['success']===1) {
                resolve(res);
            } else {
                reject(res);
            }
        })
    }
};
