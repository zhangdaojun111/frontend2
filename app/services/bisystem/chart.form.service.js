/**
 * Created by birdyy on 2017/8/16.
 * chart 配置表单获取数据源，x轴，y轴数据
 */
import {HTTP} from "../../lib/http";


export const ChartFormService = {
    /**
     * 从服务器url参数值
     * @return 数据源promise
     */
    getQueryString(name) {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  decodeURI(r[2]); return null;
    },

    /**
     * 从服务器获取图表数据源
     * @return 数据源promise
     */
    async getChartSource() {
            let params = {
                parent_table_id: ChartFormService.getQueryString('parent_table_id')
            };
            console.log(params);
            let res = await HTTP.getImmediately('/bi/get_new_table_info');
            return Promise.resolve(res);
    },

    /**
     * 从服务器获取图表图标
     * @return 图标promise
     */
    async getChartIcon() {
        let res = await HTTP.getImmediately('/bi/get_all_icon');
        return Promise.resolve(res);
    },

    /**
     * 从服务器获取x,y轴数据
     * @return x,y promise
     */
    async getChartField(table_id) {
        let res = await HTTP.getImmediately('/bi/get_new_field_info', {table_id: table_id});
        return Promise.resolve(res);
    },

    /**
     * 保存图表数据
     * @return promise
     */
    async saveChart(chart) {
        let res = await HTTP.ajaxImmediately({
            url: '/bi/get_new_save_bi_setting/',
            data: {
                folder_id: '',
                operation_id: '',
                parent_table_id: '',
                query_mark: 'normal',
                row_id:'',
                chart:chart
            },
            // contentType: "application/json; charset=utf-8",
            method:'post',
            traditional: true
        });
        return Promise.resolve(res);
    }
}
