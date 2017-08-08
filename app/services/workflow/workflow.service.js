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
    getRecordInfo(params){
        return HTTP.postImmediately( params)
    }
}