import FormBase from '../components/form/base-form/base-form'
import {HTTP} from '../lib/http';
import '../components/form/vender/my-multiSelect/my-multiSelect'
import '../components/form/vender/my-multiSelect/my-multiSelect.css'
let FormEntrys={
    formBase:null,
    init:function(config={}){
        this.tableId=config.tableId||'';
        this.parentRealId=config.parentRealId||'';
        this.parentTempId=config.parentTempId||'';
        this.seqId=config.seqId||'';
        this.realId=config.realId||'';
        this.parentTableId=config.parentTableId||'';
        this.parentRecordId=config.parentRecordId||'';
        this.isView=config.isView||0;
        this.isBatch=config.isBatch||0;
        this.recordId=config.recordId||'';
        this.action=config.action||'';
        this.el=config.el||'';
    },
    hasKeyInFormDataStatic:function (key,staticData){
    let isExist = false;
    for(let dict of staticData["data"]){
        if(dict["dfield"] == key){
            isExist = true;
        }
    }
    return isExist;
},
//merge静态和动态数据
    mergeFormData:function (staticData,dynamicData){
    //merge数据
    for(let dfield in dynamicData["data"]){
        if(this.hasKeyInFormDataStatic(dfield,staticData)){
            for(let dict of staticData["data"]){
                if(dict["dfield"] == dfield){
                    for(let k in dynamicData["data"][dfield]){
                        dict[k] = dynamicData["data"][dfield][k];
                    }
                }
            }
        }else{
            staticData["data"].push(dynamicData["data"][dfield]);
        }
    }
    staticData["record_info"] = dynamicData["record_info"];
    staticData["parent_table_id"] = dynamicData["parent_table_id"];
    staticData["frontend_cal_parent_2_child"] = dynamicData["frontend_cal_parent_2_child"];
    staticData["error"] = dynamicData["error"];
    let data={

    }
    this.parseRes(staticData);
    for(let obj of staticData.data){
        data[obj.dfield]=obj;
    }
    staticData.data=data;
    return staticData;
},
//处理数据
    parseRes:function (res){
    if(res !== null){
        let formData = res["data"];
        if(formData.length != 0){
            //年份选择设置为默认当年
            let myDate = new Date();
            let myYear = myDate.getFullYear();
            let parentRealId = '';
            let parentTableId = '';
            let parentTempId = '';
            for( let data of formData ){
                if( data['id'] == 'real_id' ){
                    parentRealId = data['value'];
                }else if( data['id'] == 'table_id' ){
                    parentTableId = data['value'];
                }else if( data['id'] == 'temp_id' ){
                    parentTempId = data['value'];
                }
            }
            for( let data of formData ){
                if( data.type == "year" ){
                    if( data.value == "" ){
                        data.value = String( myYear );
                    }
                }else if( data.type == "correspondence" ){
                    data['parent_real_id'] = parentRealId;
                    data['parent_table_id'] = parentTableId;
                    data['parent_temp_id'] = parentTempId;
                }else if(data.type == "datetime"){
                    // if( data.value.length == 19 ){
                    //     data.value = data.value.slice( 0,16 )
                    // }
                }
            }

            if(res['record_info']['id']){
                let recordId = res['record_info']['id'];
                for(let d of this.data){
                    if(d['type'] == 'songrid'){
                        d['recordId']=recordId;
                    }
                }
            }
        }
    }
},
//请求数据
    getFormData:async function (el,template,seqid,table_id,real_id,is_view) {
        // let staticData = await HTTP.postImmediately({
        //     url: `/get_form_static_data/?seqid=${seqid}&table_id=${table_id}&is_extra=&form_id=`,
        //     type: "POST",
        //     data: {
        //         form_id:'',
        //         table_id:table_id,
        //         is_view:is_view,
        //         parent_table_id:'',
        //         parent_real_id:'',
        //         real_id:real_id,
        //         parent_temp_id:'',
        //     }
        // });
        // let dynamicData = await HTTP.postImmediately({
        //     url: `/get_form_dynamic_data/?seqid=${seqid}&table_id=${table_id}&is_extra=&form_id=`,
        //     type: "POST",
        //     hearder:'',
        //     data: {
        //         form_id:'',
        //         table_id:table_id,
        //         is_view:is_view,
        //         parent_table_id:'',
        //         parent_real_id:'',
        //         parent_temp_id:'',
        //         real_id:real_id,
        //     }
        // });
        let _this=this;
        Promise.all([HTTP.post('get_form_dynamic_data',{
            form_id:'',
            table_id:table_id,
            is_view:is_view,
            parent_table_id:'',
            parent_real_id:'',
            real_id:real_id,
            parent_temp_id:'',
        }),HTTP.post('get_form_static_data',{
            form_id:'',
            table_id:table_id,
            is_view:is_view,
            parent_table_id:'',
            parent_real_id:'',
            real_id:real_id,
            parent_temp_id:'',
        })]).then(res=>{
            template=_this.formDefaultVersion(res[1].data);
            let data=_this.mergeFormData(res[1],res[0]);
            let formData={
                template:template,
                data:data,
            }
            _this.formBase=new FormBase(formData);
            _this.formBase.render(el);
        })
        HTTP.flush();
    },
    //生成默认表单

    formDefaultVersion : function (data){
    let html='<div class="form">';
    for(let obj of data){
        html+=`<div data-dfield="${obj.dfield}" data-type="${obj.type}"></div>`;
    }
    html+='</div>'
    return html;
},

    createForm:function(config={}){
        this.init(config);
        if(this.formBase){
            this.formBase.destroySelf();
        }
        let html=$('<div style="border: 1px solid red;background:#fff;position: fixed;width: 100%;height:100%;overflow: auto">').appendTo(this.el);
        let template='';
        this.getFormData(html,template,this.seqId,this.tableId,this.realId,this.isView);
    }
}

$('#toEdit').on('click',function(){
    let real_id=$('#real_id').get(0).value||'';
    let is_view=$('#is_view').get(0).value||0;
    FormEntrys.createForm({
        tableId:'8696_yz7BRBJPyWnbud4s6ckU7e',
        seqId:'yudeping',
        el:$('body'),
        is_view:is_view,
        real_id:real_id
    });
});
$('#count').on('click',function(){
    let real_id=$('#real_id').get(0).value||'';
    let is_view=$('#is_view').get(0).value||0;
    FormEntrys.createForm({
        tableId:'7051_UoWnaxPaVSZhZcxZPbEDpG',
        seqId:'yudeping',
        el:$('body'),
        is_view:is_view,
        real_id:real_id
    });
});
$('#editRequired').on('click',function(){
    let real_id=$('#real_id').get(0).value||'';
    let is_view=$('#is_view').get(0).value||0;
    FormEntrys.createForm({
        tableId:'3461_P28RYPGTGGE7DVXH8LBMHe',
        seqId:'yudeping',
        el:$('body'),
        is_view:is_view,
        real_id:real_id
    });
});
$('#defaultValue').on('click',function(){
    let real_id=$('#real_id').get(0).value||'';
    let is_view=$('#is_view').get(0).value||0;
    FormEntrys.createForm({
        tableId:'1160_ex7EbDsyoexufF2UbXBmSJ',
        seqId:'yudeping',
        el:$('body'),
        is_view:is_view,
        real_id:real_id
    });
});
$('#exp').on('click',function(){
    let real_id=$('#real_id').get(0).value||'';
    let is_view=$('#is_view').get(0).value||0;
    FormEntrys.createForm({
        tableId:'7336_HkkDT7bQQfqBag4kTiFWoa',
        seqId:'yudeping',
        el:$('body'),
        is_view:is_view,
        real_id:real_id
    });
})
export default FormEntrys