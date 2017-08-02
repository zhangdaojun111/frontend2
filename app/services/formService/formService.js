import {HTTP} from '../../lib/http';

export const FormService={
    getCountData:async function(json){
        let data=formatParams(json);
        return await HTTP.postImmediately({url:'get_count_data',data:data});
    },
    get_exp_value:async function(eval_exps){
        let data=formatParams( {"eval_exps": eval_exps} );
        return await HTTP.postImmediately({url:'eval_exp_fun',data:data});
    },
    getDefaultValue:async function(json){
        let data=formatParams(json);
        return await HTTP.postImmediately({url:'get_workflow_default_values',data:data});
    },
    formatParams(params) {
        let result = [];
        for(let k in params){
            if(typeof(params[k]) == 'object'){
                result.push(k + '=' + JSON.stringify(params[k]));
            }else{
                result.push(k + '=' + params[k]);
            }
        }
        return result.join('&')
    }
}