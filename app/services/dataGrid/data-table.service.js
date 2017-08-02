import {HTTP} from "../../lib/http"
export const dataTableService = {
    //请求偏好数据
    getPreferences: function ( param ) {
        return HTTP.post( 'get_preferences',param )
    },
    //请求表头数据
    getColumnList: function ( param ){
        return HTTP.post( 'get_column_list',param )
    },
    //请求提醒数据
    getReminRemindsInfo: function ( param ) {
        return HTTP.post( 'get_remindsInfo',param )
    },
    //请求表格数据
    getTableData: function ( param ) {
        return HTTP.post( 'get_table_data',param )
    },
    //请求表格数据
    getFooterData: function ( param ) {
        return HTTP.post( 'get_footer_data',param )
    },
    //请求sheet分页信息
    getSheetPage: function ( param ) {
        return HTTP.post( 'get_tab_page',param )
    }
}