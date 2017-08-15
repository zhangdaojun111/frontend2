import {HTTP} from "../../lib/http";

export const ViewsService = {

    /**
     * 新建视图
     * @param data{id:"",name:""} 传送name,id为空
     * @returns {Promise}
     */
    async update(data) {
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
