import FormBase from '../components/form/base-form/base-form'
import {HTTP} from '../lib/http';
import {FormService} from "../services/formService/formService";
import '../assets/scss/form.scss'

// @parma
//
let FormEntrys={
    init:function(config={}){
        this.tableId=config.table_id||'';
        this.parentRealId=config.parent_real_id||'';
        this.parentTempId=config.parent_temp_id||'';
        this.seqId=config.seqId||'';
        this.realId=config.real_id||'';
        this.parentTableId=config.parent_table_id||'';
        this.parentRecordId=config.parent_record_id||'';
        this.isView=config.is_view || 0;
        this.isBatch=config.is_batch || 0;
        this.recordId=config.record_id||'';
        this.action=config.action||'';
        this.el=config.el||'';
        this.reloadDraftData=config.reload_draft_data||0;
        this.formId=config.form_id||'';
        this.fromWorkFlow=config.from_workflow||0;
        this.flowId=config.flow_id||'';
        this.fieldId=config.field_Id||'';
        this.key=config.key||'';
        this.fromApprove=config.from_approve||'';
        this.formFocus=this.from_focus||'';
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
    //找到加载表单数据的formId和加载节点的flowId
    findFormIdAndFlowId(res) {
        if(res["data"] && res["data"]["flow_data"].length != 0) {
            //给选择节点视图的下拉框赋值
            this.selectItems = res["data"]["flow_data"];
            //默认的form_id和flow_id取第一个select
            this.formId = res["data"]["flow_data"][0]["form_id"];
            this.flowId = res["data"]["flow_data"][0]["flow_id"];
            //循环一遍，查看是否有默认值，如果有，则form_id和flow_id改变
            for (let d of res["data"]["flow_data"]) {
                if (d["selected"] == 1) {
                    this.formId = d["form_id"];
                    this.flowId = d["flow_id"];
                }
            }
        }
        if(res["data"] && res["data"]["form_id"] != 0){
            this.formId = res["data"]["form_id"];
            this.isloadCustomTableForm = true;
        }else {
            this.isloadWorkflow = true;
        }
    },
    //拼装发送json
    createPostJson(){
        let json;
        if(this.fromWorkFlow){
            json={
                form_id:this.formId,
                record_id:this.recordId,
                reload_draft_data:this.reloadDraftData,
                from_workflow:this.fromWorkFlow,
                table_id:this.tableId
            }
        }else if(this.fromApprove){
            json={
                form_id: this.formId,
                record_id: this.recordId,
                is_view: this.isView,
                from_approve: this.fromApprove,
                from_focus: this.fromFocus,
                table_id: this.tableId
            }
        }
        else{
            json=this.pickJson();
        }
        return json;
    },
    pickJson() {
        let json = {};
        if(this.fieldId !== ""){
            //加载单元格数据
            json = {
                field_id: this.fieldId,
                is_view: this.isView,
                parent_table_id: this.parentTableId || "",
                parent_real_id: this.parentRealId || "",
                parent_temp_id: this.parentTempId ||""
            }
        }else{
            //加载表单中所有数据，当有form_id时，不要为table_id赋值，保证缓存的可复用性
            if(this.formId){
                json = {
                    form_id: this.formId,
                    table_id: this.tableId,
                    is_view: this.isView,
                    parent_table_id: this.parentTableId || "",
                    parent_real_id: this.parentRealId || "",
                    parent_temp_id: this.parentTempId ||""
                }
            }else {
                json = {
                    form_id: "",
                    table_id: this.tableId,
                    is_view: this.isView,
                    parent_table_id: this.parentTableId || "",
                    parent_real_id: this.parentRealId || "",
                    parent_temp_id: this.parentTempId || ""
                }
            }
        }
        //如果是临时表，传temp_id，否则是real_id
        if(!this.action){
            json["real_id"] = this.realId;
        }else{
            json["temp_id"] = this.realId;
        }
        return json;
    },
    //merge数据
    mergeFormData:function (staticData,dynamicData){
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
    let data={};
    if(!this.formId || staticData['form_id'] == this.formId){
        this.parseRes(staticData);
    }
    staticData.formData=staticData.data;
    for(let obj of staticData.data){
        data[obj.dfield]=obj;
    }
    staticData.data=data;
    staticData.tableId=this.tableId;
    staticData.formId=this.formId;
    staticData.flowId=this.flowId;
    staticData.key=this.key;
    return staticData;
},
    //处理字段数据
    parseRes:function (res){
    if(res !== null){
        let formData = res["data"];
        if(formData.length != 0){
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
                data['tableId']=this.tableId;
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
                for(let d of res.data){
                    if(d['type'] == 'songrid'){
                        d['recordId']=recordId;
                    }
                }
            }
        }
    }
},
    //默认表单
    formDefaultVersion : function (data){
    let html=`<table class="form table table-striped table-bordered table-hover ">
            <tbody>
                `;
    for(let obj of data){
        if(data.type==='hidden'){
            html+=`<div data-dfield="${obj.dfield}" data-type="${obj.type}"></div>`;
        }else{
            html+=`<tr>
                        <td style="width: 150px;white-space: nowrap;">${ obj.label }</td>
                        <td><div data-dfield="${obj.dfield}" data-type="${obj.type}"></div></td>
                </tr>`;
        }
    }
    html+=`</tbody>
        </table>`
    return html;
},

    destoryForm(tableID){
        $(`#form-${tableID}`).remove();
    },
    //创建表单入口
    createForm:function(config={}){
        let _this=this;
        this.init(config);
        let tableID=this.tableId;
        if(this.tableId){
            this.destoryForm(this.tableId);
        }
        let html=$(`<div id="form-${tableID}" style="border: 1px solid red;background:#fff;position: fixed;width: 100%;height:100%;overflow: auto">`).appendTo(this.el);
        let template='<table><tbody><tr class="firstRow"><td width="244" valign="top"><span data-id="2562_nLNdMCPYogJJ4py4AHqDum" style="border:2px">名称</span></td><td width="244" valign="top"><label id="2562_nLNdMCPYogJJ4py4AHqDum" style="border:2px"><input type="text" data-fill-in="0" style="box-sizing:border-box;width:240px;height:34px;line-height:34px;border-radius:5px;padding:6px 12px;border:1px solid #ccc;" name="2562_nLNdMCPYogJJ4py4AHqDum" data-required="0"/></label></td><td width="244" valign="top" style="word-break: break-all;"><br/></td><td width="244" valign="top" style="word-break: break-all;"><br/></td></tr><tr><td width="244" valign="top" style="word-break: break-all;"><span data-id="7949_yaq4qmVjgatey4xAi2UCT9" style="border:2px">年份</span></td><td width="244" valign="top" style="word-break: break-all;"><label id="7949_yaq4qmVjgatey4xAi2UCT9" style="border:2px"><select data-fill-in="1" style="box-sizing:border-box;width:240px;height:34px;line-height:34px;border-radius:5px;border:1px solid #ccc;" name="7949_yaq4qmVjgatey4xAi2UCT9" data-required="0" data-year="1" class="normalSelect"></select></label></td><td width="244" valign="top"><span data-id="4207_jUwup8ziqYyTyeMivJJ2JL" style="border:2px">所在地</span></td><td width="244" valign="top"><label id="4207_jUwup8ziqYyTyeMivJJ2JL" style="border:2px"><input type="radio" data-required="0" data-fill-in="2" name="4207_jUwup8ziqYyTyeMivJJ2JL" value="6971_oargmg9mnTxZTU2Qqo6uge"/>北京<input type="radio" data-required="0" data-fill-in="2" name="4207_jUwup8ziqYyTyeMivJJ2JL" value="9398_ysjjqkNsbkf8A6yRar8Fsg"/>深圳<input type="radio" data-required="0" data-fill-in="2" name="4207_jUwup8ziqYyTyeMivJJ2JL" value="4253_5eN7tuKuBL2tLgiVPMhxAj"/>上海<input type="radio" data-required="0" data-fill-in="2" name="4207_jUwup8ziqYyTyeMivJJ2JL" value="1197_gP79KY5yjLLXFGvWF4JkBB"/>成都</label></td></tr></tbody></table><p><br/></p>';
        FormService.getPrepareParmas({table_id:this.tableId}).then(res=>{
            _this.findFormIdAndFlowId(res);
            let json=_this.createPostJson();
            FormService.getFormData(json).then(res=>{
                if(this.formId){
                    template=res[2]['data']['content'];
                }else{
                    template=_this.formDefaultVersion(res[0].data);
                }
                let data=_this.mergeFormData(res[0],res[1]);
                let formData={
                    template:template,
                    data:data,
                }
                _this.formBase=new FormBase(formData);
                _this.formBase.render(html);
            });
        })
    },
    //审批删除时重置表单可编辑性
    editDelWorkFlow(formId){
        this.formBase.actions.editDelWork(formId);
    },

    //接收关注人信息
    setUserIdList(data){
        this.formBase.data.focus_users=data;
    },

    getFormValue(){
        return this.formBase.actions.getFormValue();
    }
}

$('#toEdit').on('click',function(){
    let realId=$('#real_id').val()||'';
    let isView=$('#is_view').val()||0;
    FormEntrys.createForm({
        table_id:'8696_yz7BRBJPyWnbud4s6ckU7e',
        seqId:'yudeping',
        el:$('body'),
        is_view:isView,
        real_id:realId
    });
});
$('#text').on('click',function(){
    let realId=$('#real_id').val()||'';
    let isView=$('#is_view').val()||0;
    FormEntrys.createForm({
        table_id:'1285_pkz2teyhHCztFrYhoc6F54',
        seqId:'yudeping',
        el:$('body'),
        is_view:isView,
        real_id:realId
    });
});
$('#count').on('click',function(){
    let realId=$('#real_id').val()||'';
    let isView=$('#is_view').val()||0;
    FormEntrys.createForm({
        table_id:'7051_UoWnaxPaVSZhZcxZPbEDpG',
        seqId:'yudeping',
        el:$('body'),
        is_view:isView,
        real_id:realId
    });
});
$('#editRequired').on('click',function(){
    let realId=$('#real_id').val()||'';
    let isView=$('#is_view').val()||0;
    FormEntrys.createForm({
        table_id:'3461_P28RYPGTGGE7DVXH8LBMHe',
        seqId:'yudeping',
        el:$('body'),
        is_view:isView,
        real_id:realId
    });
});
$('#defaultValue').on('click',function(){
    let realId=$('#real_id').val()||'';
    let isView=$('#is_view').val()||0;
    FormEntrys.createForm({
        table_id:'1160_ex7EbDsyoexufF2UbXBmSJ',
        seqId:'yudeping',
        el:$('body'),
        is_view:isView,
        real_id:realId
    });
});
$('#valid').on('click',function(){
    let realId=$('#real_id').val()||'';
    let isView=$('#is_view').val()||0;
    FormEntrys.createForm({
        table_id:'2638_urGGDDp75VvymeqWj3eo6F',
        seqId:'yudeping',
        el:$('body'),
        is_view:isView,
        real_id:realId
    });
});
$('#exp').on('click',function(){
    let realId=$('#real_id').val()||'';
    let isView=$('#is_view').val()||0;
    FormEntrys.createForm({
        seqId:'yudeping',
        el:$('body'),
        is_view:isView,
        real_id:realId,
        table_id:'7336_HkkDT7bQQfqBag4kTiFWoa'
    });

})
$('#workflow').on('click',function(){
    let realId=$('#real_id').val()||'';
    let isView=$('#is_view').val()||0;
    FormEntrys.createForm({
        table_id:'449_6k2VdLn4ArCfgFPuAjFrNQ',
        seqId:'yudeping',
        el:$('body'),
        is_view:isView,
        real_id:realId
    });
})
export default FormEntrys