import FormBase from '../components/form/base-form/base-form'
import Mediator from '../lib/mediator';
import {FormService} from "../services/formService/formService";
import '../assets/scss/form.scss'
import '../assets/scss/core/print.scss'
import {CreateForm} from "../components/form/createFormVersionTable/createForm"

let FormEntrys = {
    childForm:{},
    isloadCustomTableForm:false,
    isloadWorkflow:false,
    init(config={}){
        this.tableId='';
        this.parentRealId='';
        this.parentTempId='';
        this.realId='';
        this.parentTableId='';
        this.parentRecordId='';
        this.isView= 0;
        this.isBatch= 0;
        this.recordId='';
        this.action='';
        this.el='';
        this.reloadDraftData=0;
        this.formId='';
        this.fromWorkFlow=0;
        this.flowId='';
        this.fieldId='';
        this.key='';
        this.fromApprove='';
        this.formFocus='';
        this.isAddBuild=0;
        this.buildId='';
        this.btnType='new';

        this.tableId=config.table_id||'';
        this.parentRealId=config.parent_real_id||'';
        this.parentTempId=config.parent_temp_id||'';
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
        this.formFocus=config.from_focus||'';
        this.isAddBuild=config.isAddBuild || 0;
        this.buildId=config.buildId || '';
        this.btnType=config.btnType||'new';
    },
    //静态数据里是否有这个key
    hasKeyInFormDataStatic(key,staticData){
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
    //非工作流请求json
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
    //merge static和dynamic数据
    mergeFormData(staticData,dynamicData){
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
        // staticData['parentRealId']=staticData["real_id"]["value"]||'';
        // staticData['parentTableId']=staticData["table_id"]["value"]||'';
        // staticData['parentTempId']=staticData["temp_id"]["value"]||'';
        staticData.parentTableId=this.parentTableId;
        staticData.parentRealId=this.parentRealId;
        staticData.parentTempId=this.parentTempId;
        staticData.tableId=staticData['table_id'] || this.tableId;
        staticData.formId=this.formId;
        staticData.realId=this.realId;
        staticData.flowId=this.flowId;
        staticData.isBatch=this.isBatch;
        staticData.key=this.key;
        staticData.btnType=this.btnType;
        return staticData;
    },
    //处理字段数据
    parseRes (res){
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
                res.recordId = res['record_info']['id'];
                for(let d of res.data){
                    if(d['type'] == 'songrid'){
                        d['recordId']=recordId;
                    }
                }
            }
        }
        }
    },
    //创建默认表单
    formDefaultVersion(data){
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
    //创建人员信息表
    formVersionUser(data){
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
    //清除所有已建form
    destoryAll(){
        for(let key in this.childForm){
            this.childForm[key].destroySelf();
            delete this.childForm[key];
        }
    },
    //销毁单个form实例
    destoryForm(tableID){
        if(this.childForm[tableID]){
            this.childForm[tableID].destroySelf();
            delete this.childForm[tableID];
        }
    },
    async checkFormType(data,res){
        //获取公司名称
        let company = data["company_name"];
        //获取是否加载定制表单
        let isloadCustom = data["custom_form_exists"] == 1;
        //获取是否加载各个公司定制的系统表
        let companyCustomTableFormExists = data["company_custom_table_form_exists"] == '1';
        //是否加载系统自带的系统表
        let customTableFormExists = data["custom_table_form_exists"] == '1';
        //是否有其他字段
        data.hasOtherFields = data["show_other_fields"];
        //sys_type
        let sys_type = data["sys_type"];
        //如果有其他字段，则请求其他字段的数据
        if(data.hasOtherFields == 1){
            //如果是其他字段，temp_id用上一个表单的
            for(let obj of data["data"]){
                if(obj["dfield"] == "temp_id") {
                    data.jsonOfOtherFields["temp_id"] = obj["value"];
                }
            }
            data.jsonOfOtherFields["is_extra"] = 1;
        }
        //审批中的提示信息
        let record_tip = data["record_tip"];

        let html='';
        //加载表单
        if(companyCustomTableFormExists){
            try {
                //加载各个公司定制的系统表
                cosnole.log('加载公司定制系统表');
            }catch (e){
                console.error(`加载${ company }定制的系统表，table_id为：${ this.tableId }的表单失败`);
                console.error(e);
            }
        }else if(customTableFormExists){
            try{
                //加载系统定制的系统表
                console.log('加载系统定制表');
                sys_type == "normal"?sys_type = this.tableId:sys_type;
                html=await CreateForm.creatSysTable(sys_type,data);
            }catch (e){
                console.error(`加载系统表，table_id为${ this.tableId }的表单失败`);
                console.error(e);
            }
        } else if(this.formId !== ""){
            if(isloadCustom){
                try{
                    //加载定制表单
                    console.log('加载定制表单')
                }catch (e){
                    console.error(`加载${ company }的定制表单，form_id为：${ this.formId }的表单失败`);
                    console.error(e);
                }
            }else if(this.isloadCustomTableForm || this.isloadWorkflow){
                try{
                    //加载个人制作的表单
                    console.log('加载个人制作表单');
                    html=res[2]['data']['content'];
                }catch (e){
                    console.error(`加载${ company }的个人制作的表单，form_id为：${ this.formId }的表单失败`);
                    console.error(e);
                }
            }else {
                try{
                    console.log('加载默认表单')
                    html= CreateForm.formDefaultVersion(res[0].data);
                }catch (e){
                    console.error(`加载系统自带的默认表单失败`);
                    console.error(e);
                }
            }
        }else{
            try{
                console.log('加载默认表单')
                html=CreateForm.formDefaultVersion(res[0].data);
            }catch (e){
                console.error(`加载系统自带的默认表单失败`);
                console.error(e);
            }
        }
        return html;
    },
    //创建表单入口
    async createForm(config={}){
        this.init(config);
        let html=$(`<div id="detail-form" data-id="form-${this.tableId}" style="" class="table-wrap wrap">`).prependTo(this.el);
        let res=await  FormService.getPrepareParmas({table_id:this.tableId});
        this.findFormIdAndFlowId(res);
        let json=this.createPostJson();
        res =await FormService.getFormData(json);
        //处理数据
        let data=this.mergeFormData(res[0],res[1]);
        //检查表单类型
        let template=await this.checkFormType(data,res);
        //发送审批记录
        if(this.fromApprove){
            if(res[1]['record_info']){
                Mediator.publish('workFlow:record_info',res[1]['record_info']);
            }
        }
        let formData={
            template:template,
            data:data,
        }
        let formBase=new FormBase(formData);
        this.childForm[this.tableId]=formBase;
        formBase.render(html);
        console.timeEnd('form创建时间');
    },

    //审批删除时重置表单可编辑性
    editDelWorkFlow(tableId,formId){
        this.childForm[tableId].actions.editDelWork(formId);
    },

    //接收关注人信息
    setUserIdList(tableId,data){
        if(!this.childForm[tableId]){
            return;
        }
        this.childForm[tableId].data.focus_users=data;
    },

    //获取表单数据
    getFormValue(tableId){
        if(!this.childForm[tableId]){
            return;
        }
        return this.childForm[tableId].actions.getFormValue();
    }
}
export default FormEntrys