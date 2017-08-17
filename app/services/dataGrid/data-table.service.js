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
    },
    // 保存偏好
    savePreference: function ( param ) {
        return HTTP.post( 'save_preference',param )
    },
    //删除偏好
    delPreference: function ( param ) {
        return HTTP.post( 'delete_preference',param )
    },
    //删除数据
    delTableData: function ( param ) {
        return HTTP.post( 'delete_table_data',param )
    },
    //导入数据
    importData: function ( data ) {
        // let headers = new Headers({'Content-Type': 'application/vnd.ms-excel; charset=UTF-8'});
        return HTTP.post( 'delete_table_data',data )
    },
    //获取工作流表数据
    getWorkflowData: function ( data ) {
        return HTTP.post( 'get_workflow_records',data )
    },
    //对应关系保存
    saveForCorrespondence: function ( param ) {
        return HTTP.post( 'update_correspondence',param )
    },
    //获取在途数据
    getInProcessNum: function ( param ) {
        return HTTP.post( 'get_on_passage_count',param )
    }
}