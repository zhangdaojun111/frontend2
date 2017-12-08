import {HTTP} from "../../lib/http";

export const ViewsService = {

    /**
     * 新建视图/编辑视图
     * @param data{id:"",name:""} 传id,name
     * @returns {Promise}
     */
    async update(data) {
        let params = {
            parent_table_id: window.config.parent_table_id,
            row_id: window.config.row_id,
            query_mark: window.config.query_mark ? window.config.query_mark : 'normal',
            operation_id:window.config.operation_id,
            folder_id: window.config.folder_id,
        };
        const res = await HTTP.getImmediately('/bi/set_new_view_data',Object.assign(data,params));
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
        // const res = await HTTP.postImmediately('/bi/set_new_view_sort',data);
        const res = await HTTP.ajaxImmediately({
            url: '/bi/set_new_view_sort/',
            data: data,
            // contentType: "application/json; charset=utf-8",
            method:'post',
            traditional: true
        });
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
     * 保存富文本框数据
     * @param data 需要发送给服务器的参数
     */
    async saveRichText(data) {
        const res = await HTTP.ajaxImmediately({
            url: '/bi/set_new_richtxt/',
            data: data,
            method:'post',
            traditional: true
        });
        return new Promise((resolve, reject) => {
                resolve(res);
        })
    }
    // postPdfHtml(data){
    //     return HTTP.ajaxImmediately({
    //         url:'/bi/download_pdf/',
    //         data: {
    //             bi_str:data.bi_str,
    //             view_id:data.view_id,
    //             pdf_name:'',
    //         },
    //         method:'post',
    //         traditional: true
    //     });
    // },
};
