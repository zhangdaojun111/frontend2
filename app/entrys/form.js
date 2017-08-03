import FormBase from '../components/form/base-form/base-form'
import {HTTP} from '../lib/http';
import '../components/form/vender/my-multiSelect/my-multiSelect'
import '../components/form/vender/my-multiSelect/my-multiSelect.css'

let formBase;
function hasKeyInFormDataStatic(key,staticData){
    let isExist = false;
    for(let dict of staticData["data"]){
        if(dict["dfield"] == key){
            isExist = true;
        }
    }
    return isExist;
}
//merge静态和动态数据
function mergeFormData(staticData,dynamicData){
    //merge数据
    for(let dfield in dynamicData["data"]){
        if(hasKeyInFormDataStatic(dfield,staticData)){
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
    parseRes(staticData);
    for(let obj of staticData.data){
        data[obj.dfield]=obj;
    }
    staticData.data=data;
    return staticData;
}

function parseRes(res){
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
}

$('#toEdit').on('click',function(){
    if(formBase){
        formBase.destroySelf();
    }
    let el=$('<div style="border: 1px solid red;background:#fff;position: fixed;width: 100%;height:100%;overflow: auto">').appendTo('body');
    let template=`<div class="form">
                  <div data-dfield="f23" data-type="Textarea" data-width="500"/>
                  <div data-dfield="f8" data-type="Radio" data-width="300"/>
                  <div data-dfield="f26" data-type="Input" data-width="300"/>
                  <div data-dfield="f31" data-type="Input" data-width="300"/>
                  <div data-dfield="f7" data-type="Select" data-width="300"/>
                  <div data-dfield="f6" data-type="Year" data-width="300"/>
                  <div data-dfield="f5" data-type="Buildin" data-width="300"/>
                  <div data-dfield="f10" data-type="MultiLinkage" data-width="300"/>
                   <div data-dfield="f24" data-type="Input" data-width="300"/>
                   <div data-dfield="f30" data-type="Input" data-width="300"/>
                   <div data-dfield="f14" data-type="Input" data-width="300"/>
                   <div data-dfield="f29" data-type="Input" data-width="300"/>
                   <div data-dfield="f25" data-type="Input" data-width="300"/>
                   <div data-dfield="f15" data-type="Input" data-width="300"/>
                  <div data-dfield="f11" data-type="Readonly" data-width="300"/>
                   <div data-dfield="f233" data-type="Hidden" data-width="300"/>
                  <div data-dfield="f27" data-type="Password" data-width="300"/>
                  <div data-dfield="f28" data-type="YearMonthControl" data-width="300"/>
                  </div>
                    `;
    let real_id=$('#real_id').get(0).value||'';
    let is_view=$('#is_view').get(0).value||0;
    wait(el,template,'yudeping','8696_yz7BRBJPyWnbud4s6ckU7e',real_id,is_view);
});
$('#count').on('click',function(){
    if(formBase){
        formBase.destroySelf();
    }
    let el=$('<div style="border: 1px solid red;background:#fff;position: fixed;width: 100%;height:100%;overflow: auto">').appendTo('body');
    let template=`<div class="form">
              <div data-dfield="f5" data-type="Input" data-width="300"/>
              <div data-dfield="f6" data-type="Readonly" data-width="300"/>
              </div>
                `;
    let real_id=$('#real_id').get(0).value||'';
    let is_view=$('#is_view').get(0).value||0;
    wait(el,template,'yudeping','7051_UoWnaxPaVSZhZcxZPbEDpG',real_id,is_view);
});
$('#editRequired').on('click',function(){
    if(formBase){
        formBase.destroySelf();
    }
    let el=$('<div style="border: 1px solid red;background:#fff;position: fixed;width: 100%;height:100%;overflow: auto">').appendTo('body');
    let template=`<div class="form">
              <div data-dfield="f5" data-type="Input" data-width="300"/>
              <div data-dfield="f6" data-type="Radio" data-width="300"/>
              </div>
                `;
    let real_id=$('#real_id').get(0).value||'';
    let is_view=$('#is_view').get(0).value||0;
    wait(el,template,'yudeping','3461_P28RYPGTGGE7DVXH8LBMHe',real_id,is_view);
});
$('#defaultValue').on('click',function(){
    if(formBase){
        formBase.destroySelf();
    }
    let el=$('<div style="border: 1px solid red;background:#fff;position: fixed;width: 100%;height:100%;overflow: auto">').appendTo('body');
    //默认值
    let template=`<div class="form">
              <div data-dfield="f5" data-type="Input" data-width="300"/>
              <div data-dfield="f6" data-type="Input" data-width="300"/>
              </div>
                `;

    let real_id=$('#real_id').get(0).value||'';
    let is_view=$('#is_view').get(0).value||0;
    wait(el,template,'yudeping','1160_ex7EbDsyoexufF2UbXBmSJ',real_id,is_view);
});

$('#exp').on('click',function(){
    if(formBase){
        formBase.destroySelf();
    }
    let el=$('<div style="border: 1px solid red;background:#fff;position: fixed;width: 100%;height:100%;overflow: auto">').appendTo('body');
    let real_id=$('#real_id').get(0).value||'';
    let is_view=$('#is_view').get(0).value||0;
    let template='11';
    wait(el,template,'yudeping','7336_HkkDT7bQQfqBag4kTiFWoa',real_id,is_view);
})

async function wait(el,template,seqid,table_id,real_id,is_view) {
    let staticData = await HTTP.postImmediately({
        url: `/get_form_static_data/?seqid=${seqid}&table_id=${table_id}&is_extra=&form_id=`,
        type: "POST",
        data: {
            form_id:'',
            table_id:table_id,
            is_view:is_view,
            parent_table_id:'',
            parent_real_id:'',
            real_id:real_id,
            parent_temp_id:'',
        }
    });
    let dynamicData = await HTTP.postImmediately({
        url: `/get_form_dynamic_data/?seqid=${seqid}&table_id=${table_id}&is_extra=&form_id=`,
        type: "POST",
        hearder:'',
        data: {
            form_id:'',
            table_id:table_id,
            is_view:is_view,
            parent_table_id:'',
            parent_real_id:'',
            parent_temp_id:'',
            real_id:real_id,
        }
    });
    template=formDefaultVersion(staticData.data);
    let data=mergeFormData(staticData,dynamicData);
    let formData={
        template:template,
        data:data,
    }
    formBase=new FormBase(formData);
    formBase.render(el);
}

function formDefaultVersion(data){
    let html='<div class="form">';
    for(let obj of data){
        html+=`<div data-dfield="${obj.dfield}" data-type="${obj.type}"></div>`;
    }
    html+='</div>'
    return html;
}