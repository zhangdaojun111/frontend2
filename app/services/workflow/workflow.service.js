import {HTTP} from '../../lib/http';
export const workflowService={
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
    validateDraftData(params){
        return HTTP.postImmediately('/validate_draft_data/', params)
    },
    delWorkflowFavorite(params){
        return HTTP.postImmediately('/del_workflow_favorite/', params)
    },
    addWorkflowFavorite(params){
        return HTTP.postImmediately('/add_workflow_favorite/', params)
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
}