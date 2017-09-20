/**
 * Created by birdyy on 2017/8/1.
 */
import {HTTP} from '../../lib/http';

export const canvasCellService = {

    /**
     * 通过视图id获取画布块数组
     * @param {view_id: viewId}
     * @returns {Promise}
     */
    async getCellLayout(data) {
        const res = await HTTP.getImmediately('/bi/get_view_layout/?&canvasType=pc', data);
        return new Promise((resolve, reject) => {
            if (res['success']===1) {
                resolve(res);
            } else {
                reject(res);
            }
        })
    },

    /**
     *保存视图画布数据
     * @param {cells: 当前视图所有画布块}
     * @returns {Promise}
     */
    async saveCellLayout(data) {
        const res = await HTTP.ajaxImmediately({
            url: '/bi/set_view_layout/',
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
     * 获取画布块图表数据
     * @param charts = [chart_id1, chart_id2, chart_id3]
     */
    async getCellChart(charts) {
        const res = await HTTP.ajaxImmediately({
            url: '/bi/get_bi_data/?&canvasType=pc',
            data: charts,
            method:'post',
            traditional: true
        });

        return new Promise((resolve, reject) => {
            resolve(res);
        })
    },
    /**
     * 获取下穿数据
     * @param data 需要发送给服务器的参数
     */
    async getDeepData(data) {
        const res = await HTTP.ajaxImmediately({
            url: '/bi/get_bi_data/',
            data: data,
            // contentType: "application/json; charset=utf-8",
            method:'get',
            traditional: true
        });
        return new Promise((resolve, reject) => {
            resolve(res);
        })
    },

    /**
     * 保存原始数据到服务器
     * @param data = 保存数据到服务器
     */
    async saveOriginalData(data) {
        const res = await HTTP.ajaxImmediately({
            url: '/bi/set_new_bi_deep/',
            data: data,
            // contentType: "application/json; charset=utf-8",
            method:'post',
            traditional: true
        });
        return new Promise((resolve, reject) => {
            resolve(res);
        })
    },

    /**
     * 保存高级计算到服务器
     * @param data = 保存数据到服务器
     */
    async saveAdvancedData(data) {
        const res = await HTTP.ajaxImmediately({
            url: '/bi/new_create_compute_field/',
            data: data,
            // contentType: "application/json; charset=utf-8",
            method:'post',
            traditional: true
        });
        return new Promise((resolve, reject) => {
            resolve(res);
        })
    },

    /**
     * 获取高级计算字段列表
     * @param data
     */
    async getAdvancedListData(data) {
        const res = await HTTP.ajaxImmediately({
            url: '/bi/new_get_compute_field/',
            data: data,
            // contentType: "application/json; charset=utf-8",
            traditional: true
        });
        return new Promise((resolve, reject) => {
            resolve(res);
        })
    },

}

