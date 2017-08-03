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
    getAboutData:async function(json){
        let data=formatParams(json);
        return await HTTP.postImmediately({url:'get_about_data',data:data});
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
    },
    getDynamicData:async function({tableId,real_id,seqid}){
        return await HTTP.postImmediately({
            url: `http://127.0.0.1:8081/get_form_dynamic_data/?seqid=${seqid}&table_id=${tableId}&is_extra=&form_id=`,
            type: "POST",
            data: {
                form_id:'',
                table_id:tableId,
                is_view:0,
                parent_table_id:'',
                parent_real_id:'',
                parent_temp_id:'',
                real_id:real_id
            }
        });
    }
}