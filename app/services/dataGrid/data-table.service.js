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
    //我的操作
    getOperationData: function ( data ) {
        return HTTP.post( 'get_operation_record',data )
    },
    //表级操作数据
    getTableOperation: function ( data ) {
        return HTTP.post( 'get_operation',data )
    },
    //表级操作cache
    tableOperationRefresh: function ( data ) {
        return HTTP.post( 'update_table_cache',data )
    },
    //获取表的表单工作流参数
    getPrepareParmas: function ( data ) {
        return HTTP.post( 'prepare_params',data )
    },
    //获取权限信息
    getPermData: function ( data ) {
        return HTTP.post( 'user_perms',data )
    },
    //设置权限信息
    setPermData: function ( data ) {
        return HTTP.post( 'user_perms',data )
    },
    //请求帮助文档信息
    getHelpData: function ( data ) {
        return HTTP.post( 'get_help_data',data )
    },
    //请求附件数据
    getAttachmentList(json){
        return HTTP.post('query_attachment_list',json);
    },
    //保存编辑数据
    saveEditFormData: function (data) {
        return HTTP.post( 'add_update_table_data',data )
    },
    //二维表保存
    refreshReport: function (data) {
        return HTTP.postImmediately( '/refresh_report/',data )
    },
    //行级操作（后端）
    rowOperationBackend: function (data,address) {
        return HTTP.postImmediately(address,data);
    },
    //获取保存的BI的字段
    getBIField: function ( json ) {
        return HTTP.postImmediately('/folder_preference/',json);
    },
    setImgDataAndNum(res,imgData,imgSelect){
        imgData = res;
        let imgTotal = res.rows.length;
        if(imgData){
            for( let i=0;i<imgData.rows.length;i++ ){
                imgData.rows[i]["isSelect"] = false;
            }
            if( imgData.rows[0] ){
                imgData.rows[0]["isSelect"] = true;
                imgSelect = imgData.rows[0].file_id;
            }
        }
        let imgNum = 0;
        return {imgSelect:imgSelect,imgData:imgData,imgTotal:imgTotal,imgNum:imgNum};
    },
    //获取表单新增统计表数据
    getNewFormCountData: function ( data ) {
        return HTTP.postImmediately( '/get_detailed_data/',data )
    },
    //获取文件名后缀
    getFileExtension (filename) {
        return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
    },
    preview_file : ["gif","jpg","jpeg","png","txt","pdf","lua","sql","rm","rmvb","wmv","mp4","3gp","mkv","avi"],
}