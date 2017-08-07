import {HTTP} from '../../lib/http';

export const FormService={
    getCountData:async function(json){
        let data=this.formatParams(json);
        // return await HTTP.postImmediately({url:'http://192.168.2.223:9001/get_count_data/',data:data});
        return await HTTP.postImmediately({url:'/get_count_data/',data:data});
    },
    get_exp_value:async function(eval_exps){
        let data=this.formatParams( {"eval_exps": eval_exps} );
        // return await HTTP.postImmediately({url:'http://192.168.2.223:9001/eval_exp_fun/',data:data});
        return await HTTP.postImmediately({url:'/eval_exp_fun/',data:data});
    },
    getDefaultValue:async function(json){
        let data=this.formatParams(json);
        // return await HTTP.postImmediately({url:'http://192.168.2.223:9001/get_workflow_default_values/',data:data});
        return await HTTP.postImmediately({url:'/get_workflow_default_values/',data:data});
    },
    getAboutData:async function(json){
        let data=this.formatParams(json);
        // return await HTTP.postImmediately({url:'http://192.168.2.223:9001/get_about_data/',data:data});
        return await HTTP.postImmediately({url:'/get_about_data/',data:data});
    },
    getPrepareParmas:async function(json){
        let data=this.formatParams(json);
        // return await HTTP.postImmediately({url:'http://192.168.2.223:9001/get_about_data/',data:data});
        return await HTTP.postImmediately({url:'/prepare_params/',data:data});
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
    getDynamicDataImmediately:async function({tableId,real_id,seqid}){
        return await HTTP.postImmediately({
            url: `http://192.168.2.223:9001/get_form_dynamic_data/?seqid=${seqid}&table_id=${tableId}&is_extra=&form_id=`,
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
    },

    getFormData(json){
        let res=Promise.all([this.getStaticData(json),this.getDynamicData(json)]);
        HTTP.flush();
        return res;
    },

    getStaticData:async function (json) {
        return HTTP.post( 'get_form_static_data',json )
    },
    getDynamicData:async function (json) {
        return HTTP.post( 'get_form_dynamic_data',json )
    }
}