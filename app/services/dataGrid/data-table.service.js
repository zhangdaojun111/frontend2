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
    },
    //修改历史数据
    getHistoryApproveData: function ( data ) {
        return HTTP.post( 'get_update_history_data',data )
    },
    //获取部门数据
    getDepartmentData: function ( data ) {
        return HTTP.post( 'query_department_list',data )
    },
    //人员信息表请求数据
    getUserData: function ( data ) {
        return HTTP.post( 'query_user_list',data )
    },
    //请求附件数据
    getAttachmentList(json){
        return HTTP.post('query_attachment_list',json);
    },
    //获取文件名后缀
    getFileExtension (filename) {
        return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
    },
    preview_file : ["gif","jpg","jpeg","png","txt","pdf","lua","sql","rm","rmvb","wmv","mp4","3gp","mkv","avi"],
}