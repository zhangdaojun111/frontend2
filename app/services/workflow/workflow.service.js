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
        return HTTP.post('create_workflow_record', params)
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
    getFormStaticData(params){
        return HTTP.post('get_form_static_data', params)
    },
    getFormDynamicData(params){
        return HTTP.post('get_form_dynamic_data', params)
    },

}