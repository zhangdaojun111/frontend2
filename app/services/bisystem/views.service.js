import {HTTP} from "../../lib/http";

export const ViewsService = {

    /**
     * 新建视图/编辑视图
     * @param data{id:"",name:""} 传id,name
     * @returns {Promise}
     */
    async update(data) {
        const res = await HTTP.getImmediately('/bi/set_new_view_data',data);
        return new Promise((resolve, reject) => {
                resolve(res);
        })
    },
    /**
     * 保存视图排序
     * @param data{id:'',name:'',index:'',self:''}
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
    },
    /**
     * 删除列表
     * @param data{id:""} 传id
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
    },

    /**
     * 修改文本框数据
     * @param data 需要发送给服务器的参数
     */
    async setEditData(data) {
        const res = await HTTP.ajaxImmediately({
            url: '/bi/set_new_richtxt/',
            data: data,
            method:'post',
            traditional: true
        });
        return new Promise((resolve, reject) => {
                resolve(res);
        })
    },


};
