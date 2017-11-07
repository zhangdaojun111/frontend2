import {HTTP} from '../../lib/http';
export const workflowService={
    recordIds:{},
    //get_workflow_favorite
    getWorkfLowFav(params){
        return HTTP.post('get_workflow_favorite', params)
    },
    //get_workflow
    getWorkfLow(params){
        return HTTP.post('get_workflow', params)
    },
    getWorkflowInfo(params){
        return HTTP.postImmediately( params)
    },
    createWorkflowRecord(params){
        return HTTP.postImmediately('/create_workflow_record/', params)
    },
    addUpdateTableData(params){
        return HTTP.postImmediately('/add_update_table_data/', params)
    },
    createWorkflowRecord(params){
        return HTTP.postImmediately('/create_workflow_record/', params)
    },
    validateDraftData(params){
        return HTTP.postImmediately('/validate_draft_data/', params)
    },
    delWorkflowFavorite(params){
        return HTTP.postImmediately('/del_workflow_favorite/', params)
    },
    addWorkflowFavorite(params){
        return HTTP.postImmediately('/add_workflow_favorite/', params)
    },
    //请求附件数据
    getAttachmentList(json){
        let res = HTTP.post('query_attachment_list', json);
        HTTP.flush();
        return res;
    },
    //审批工作流
    //
    approveWorkflowRecord(params){
        return HTTP.postImmediately( params)
    },
    getStuffInfo(params){
        return HTTP.getImmediately( params)
    },
    //获取盖章图片
    getStmpImg(params){
        return HTTP.postImmediately('/get_user_stamp/', params);
    },
    //删除盖章图片
     delStmpImg(params){
        return HTTP.postImmediately('/delete_user_stamp/', params);
    },
    //添加盖章图片
    addStmpImg(params){
        return HTTP.postImmediately('/upload_user_stamp/', params);
    },
    //get用户信息
    getUserInfo(params){
        return HTTP.postImmediately('/get_user_info/', params);
    },
    //Grid
    getGridinfo(params){
        return HTTP.postImmediately('/get_form_static_data/',params)
    },
    //记着修改到首页中的service中
    getRecordTotal(params){
        return HTTP.postImmediately('/get_workflow_record_total/')
    },
    getRecords(params){
        return HTTP.postImmediately('/get_workflow_records/',params)
    },
    approveMany(params){
        return HTTP.postImmediately('/approve_many_workflow/',params)
    },
    approve(params){
        return HTTP.postImmediately('/approve_workflow_record/',params)
    },
    getRecordInfo(params){
        return HTTP.postImmediately('/get_form_dynamic_data/',params)
    },
    getPrepareParams(params){
        return HTTP.postImmediately('/prepare_params/', params)
    },
    approveManyWorkflow(params){
        return HTTP.postImmediately('/approve_many_workflow/', params)
    },
    nodeAttachment(params){
        return HTTP.getImmediately('/node_attachment/', params)
    },

    //获取文件名后缀
    getFileExtension (filename) {
        return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
    },
    preview_file : ["gif","jpg","jpeg","png","wmv","mp4"],
}