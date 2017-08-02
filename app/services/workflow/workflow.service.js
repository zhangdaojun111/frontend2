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
    getWorkfLowInfo(params){
        return HTTP.post('get_workflow_info', params)
    },
    createWorkflowRecord(params){
        return HTTP.post('create_workflow_record', params)
    },
    validateDraftData(params){
        return HTTP.post('validate_draft_data', params)
    },
    delWorkflowFavorite(params){
        return HTTP.post('del_workflow_favorite', params)
    },
    addWorkflowFavorite(params){
        return HTTP.post('add_workflow_favorite', params)
    },
}