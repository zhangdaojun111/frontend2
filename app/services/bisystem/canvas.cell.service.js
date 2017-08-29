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
            traditional: true
        });
        return new Promise((resolve, reject) => {
            if (res['success'] === 1) {
                resolve(res);
            } else {
                reject(res);
            }
        })
    }
}

