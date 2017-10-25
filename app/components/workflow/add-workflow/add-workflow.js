/**
 * @author qiumaoyun
 * 新增、查看、编辑工作流
 */
import Component from '../../../lib/component';
import template from './add-workflow.html';
import '../approval-workflow/approval-workflow.scss';
import './add-workflow.scss';
import '../../../assets/scss/workflow/workflow-base.scss'
import Mediator from '../../../lib/mediator';
import WorkFlow from '../workflow-drawflow/workflow';
import {workflowService} from '../../../services/workflow/workflow.service';
import {FormService} from "../../../services/formService/formService"
import msgBox from '../../../lib/msgbox';
import {PMAPI,PMENUM} from '../../../lib/postmsg';
import SettingPrint from '../../form/setting-print/setting-print'
import FormEntrys from "../../../entrys/form";
let config={
    template: template,
    data:{
        obj: {},
        is_view: 0,
        action: 0,
        cache_old: {},
        focusArr: []
    },
    actions:{
        /**
         * @method 自定义页眉
         */
        async printSetting(){
            let res = await FormService.getPrintSetting()
            // if(res.succ == 1){
            SettingPrint.data['key'] = this.data.key;
            if (res.data && res.data.length && res.data.length != 0) {
                SettingPrint.data['printTitles'] = res['data'];
                SettingPrint.data['myContent'] = res['data'][0]['content'] || '';
                SettingPrint.data['selectNum'] = parseInt(res['data']['index']) || 1;
            }
            PMAPI.openDialogByComponent(SettingPrint, {
                width: 400,
                height: 210,
                title: '自定义页眉',
                modal: true
            })
        },
        openAddFollower() {
            PMAPI.openDialogByIframe(`/iframe/addfocus/`, {
                width: 800,
                height: 620,
                title: `添加关注人`,
                modal: true
            },{
                users:this.data.user
            }).then(res => {
                if (!res.onlyclose) {
                    let nameArr = [],
                        idArr = [],
                        htmlStr = [];
                    for (let k in res) {
                        nameArr.push(res[k]);
                        htmlStr.push(`<span class="selectSpan">${res[k]}</span>`);
                        idArr.push(k);
                    }
                    this.el.find('#addFollowerList').html(htmlStr);
                    this.data.focusArr = idArr;
                    // Mediator.publish('workflow:focus-users', idArr);
                    this.data.user=res;
                }
            })
        },

        getWorkflowFromData() {
            let _this = this;
            let obj = this.data.obj;
            (async function () {
                return workflowService.getPrepareParams({table_id: _this.data.obj.table_id});
            })().then(res => {
                if (res.data.flow_data.length === 0) {
                    this.el.find('.workflow-foot').hide();
                    this.el.find('.workflow-flex').hide();
                    $('#place-form').html('');
                    FormEntrys.createForm({
                        el: $('#place-form'),
                        is_view: this.data.is_view,
                        from_focus: 0,
                        table_id: obj.table_id,
                        parent_table_id: obj.parent_table_id,
                        parent_real_id: obj.parent_real_id,
                        parent_temp_id: obj.parent_temp_id,
                        parent_record_id: obj.parent_record_id,
                        btnType: obj.btnType,
                        real_id: obj.real_id,
                        temp_id: obj.temp_id,
                        isAddBuild: obj.isAddBuild,
                        id: obj.id,
                        key: obj.key,
                        action: this.data.action
                    });
                    setTimeout(()=>{
                        _this.data.cache_old= FormEntrys.getFormValue(_this.data.obj.table_id,true);
                    },1000)
                } else {
                    // Mediator.publish('workflow:getParams', res.data.flow_data);
                    _this.actions.handleParams(res['data']['flow_data']);
                }
            });
        },
        handleParams(res) {
            let _this = this;
            let htmlStr = ``;
            for(let i in res){
                htmlStr += `<option data-default=${res[i].selected} data-flow_id=${res[i].flow_id} data-form_id=${res[i].form_id}>${res[i].flow_name}</option>`;
            }
            this.el.find('#wf-select').html(htmlStr);
            let o={};
            if(_this.el.find('#wf-select option[data-default="1"]').length===0){
                o.flow_id=_this.el.find('#wf-select option:first').data('flow_id');
                o.form_id=_this.el.find('#wf-select option:first').data('form_id');
                this.el.find('#wf-select option:first').attr("selected",true);
                // Mediator.publish('workflow:getflows', o);
                this.actions.getFlows(o);
            }else{
                o.flow_id=_this.el.find('#wf-select option[data-default="1"]').data('flow_id');
                o.form_id=_this.el.find('#wf-select option[data-default="1"]').data('form_id');
                this.el.find('#wf-select option[data-default="1"]').attr("selected",true);
                // Mediator.publish('workflow:getflows', o);
                this.actions.getFlows(o);
            }
            this.el.find('#wf-select').on('change',()=>{
                let o={};
                o.flow_id=this.el.find('#wf-select option:selected').data('flow_id');
                o.form_id=this.el.find('#wf-select option:selected').data('form_id');
                // Mediator.publish('workflow:getflows', o);
                this.actions.getFlows(o);
            });
        },
        getFlows(res) {
            console.log(this.data.obj);
            let obj = this.data.obj;
            if (obj.btnType === 'view' && this.data.is_view !== 0) {
                $('#toEdit').show();
                $('#addFollower').hide();
            }else if(obj.btnType==='none'){
                $('#toEdit').hide();
                $('#addFollower').hide();
            }
            if(obj.in_process === '1'){
                WorkFlow.createFlow({
                    flow_id: this.data.obj.flow_id,
                    el: "#flow-node",
                    record_id: this.data.obj.record_id,
                });
                // Mediator.publish("workflow:hideselect", this.data.obj.flow_id);
                this.actions.hideWorkflowSelect(this.data.obj.flow_id);
            }else{
                WorkFlow.createFlow({
                    flow_id: res.flow_id,
                    el: "#flow-node",
                    record_id:obj.record_id,
                });
                obj.flow_id = res.flow_id;
                obj.form_id = res.form_id;
            }
            $('#place-form').html('');
            FormEntrys.initForm({
                el: $('#place-form'),
                form_id: res.form_id,
                flow_id: res.flow_id,
                is_view: this.data.is_view,
                from_workflow: 1,
                from_focus: 0,
                btnType: 'none',
                table_id: obj.table_id,
                parent_table_id: obj.parent_table_id,
                parent_real_id: obj.parent_real_id,
                parent_temp_id: obj.parent_temp_id,
                parent_record_id: obj.parent_record_id,
                real_id: obj.real_id,
                temp_id: obj.temp_id,
                in_process: obj.in_process,
                record_id: obj.record_id,
                isAddBuild: obj.isAddBuild,
                id: obj.id,
                key: obj.key,
                action: this.data.action,
                is_batch: obj.is_batch
            });
            setTimeout(()=>{
                this.data.cache_old = FormEntrys.getFormValue(obj.table_id,true);
            },1000)
        },
        hideWorkflowSelect(res) {
            let sel = this.el.find('#wf-select option');
            let sellen = sel.length;
            for(let i=0;i<sellen;i++){
                if($(sel[i]).attr('data-flow_id') === res){
                    $(sel[i]).attr("selected",true);
                }
            }
            this.el.find('#wf-select').attr('disabled','disabled');
        },

        /**
         * 提交当前工作流
         */
        submitAddWorkflow() {
            let obj = this.data.obj;
            let formData = FormEntrys.getFormValue(obj.table_id,true);
            if (formData.error) {
                msgBox.alert(`${formData.errorMessage}`);
            } else {
                msgBox.showLoadingSelf();
                let postData = {
                    flow_id: obj.flow_id,
                    focus_users: JSON.stringify(this.data.focusArr) || [],
                    data: JSON.stringify(formData),
                    cache_new:JSON.stringify(formData),
                    cache_old:JSON.stringify(this.data.cache_old),
                    table_id:obj.table_id,
                    parent_table_id:obj.parent_table_id,
                    parent_real_id:obj.parent_real_id,
                    parent_temp_id:obj.parent_temp_id,
                    parent_record_id:obj.parent_record_id
                };
                //半触发操作用
                if( obj.data_from_row_id ){
                    postData = {
                        data: JSON.stringify(formData),
                        flow_id: obj.flow_id,
                        operation_table_id: obj.operation_table_id,
                        operation_real_id: obj.data_from_row_id
                    }
                }
                (async function () {
                    //半触发操作用
                    if( obj.data_from_row_id ){
                        return workflowService.createWorkflowRecord(postData);
                    }else {
                        return workflowService.addUpdateTableData(postData);
                    }
                })().then(res => {
                    msgBox.hideLoadingSelf();
                    if (res.success === 1) {
                        msgBox.showTips(`保存成功`);
                        PMAPI.sendToRealParent({
                            type: PMENUM.close_dialog,
                            key: obj.key,
                            data: {
                                table_id: obj.table_id,
                                type: 'closeAddition',
                                refresh: true
                            }
                        });
                    } else {
                        msgBox.alert(`${res.error}`);
                    }
                })
            }
        },

        /**
         * 转到编辑模式
         * @param res
         */
        changeToEdit(res) {
            if(this.data.obj.is_batch !== '1') {
                $("#add-wf").find('.J_hide').removeClass('hide');
                $("#add-wf").find('#print').removeClass('addPrint');
            }
            this.data.is_view = 0;
            FormEntrys.changeToEdit(res);
        }
    },
    afterRender(){
        let _this=this;
        _this.showLoading();
        console.log(this.data.obj);
        this.data.key = this.data.obj.key;

        if (this.data.obj.btnType === 'view'||this.data.obj.btnType ==="none") {
            this.el.find('#subAddworkflow').hide();
            this.data.is_view = 1;
        }
        //判断工作流是否处于在途状态或者在批量工作流中打开forn
        if(this.data.obj.in_process === 1 || this.data.obj.is_batch === 1){
            // $("#add-wf").find('.J_hide').addClass('hide');
            this.data.action = 1;
        }
        //批量工作流隐藏多余div
        if(this.data.obj.is_batch === "1"){
            // $("#add-wf").find('#print').addClass('addPrint');
            // $("#add-wf").find('.J_hide').addClass('hide');
            this.el.find('#print').addClass('addPrint');
            this.el.find('.J_hide').addClass('hide');
        }

        if(this.data.obj.is_view === "1" && this.data.obj.in_process === "0"){
            // $("#add-wf").find('.J_hide').addClass('hide');
            // $("#add-wf").find('#print').addClass('addPrint');
            this.el.find('.J_hide').addClass('hide');
            this.el.find('#print').addClass('addPrint');
        }

        this.actions.getWorkflowFromData();

        Mediator.subscribe('workflow:gotWorkflowInfo', (msg)=> {
            this.data.workflowData=msg.data[0];
            WorkFlow.show(msg.data[0],'#drawflow');
        });

        this.el.find('#subAddworkflow').on('click',()=>{
            // Mediator.publish('workflow:submit', 1);
            this.actions.submitAddWorkflow();
        });
        this.el.on('click','#toEdit',(el)=>{
            let table_id =　location.href.split('=')[1].split('&')[0];
            // Mediator.publish('workflow:changeToEdit',table_id);
            this.actions.changeToEdit(table_id);
            $(el.target).hide();
            this.el.find("#subAddworkflow").show();
            this.el.find("#addFollower").show();
        }).on('click', '#print', () => {
            this.actions.printSetting();
        }).on('click', '#addFollower', () => {
            this.actions.openAddFollower();
        });
    },
    beforeDestory: function () {
        Mediator.removeAll('workflow:getKey');
        Mediator.removeAll('workflow:gotWorkflowInfo');
        Mediator.removeAll('workflow:getParams');
    }
};
class AddWorkflow extends Component{
    // constructor (data){
    //     super(config,data);
    // }
    constructor(data,newConfig){
        config.data.obj = data;
        super($.extend(true,{},config,newConfig,{data:data||{}}));
    }
}
export default {
    showDom(data){
        return new Promise(function(resolve, reject){
            let component = new AddWorkflow(data);
            let el = $('#add-wf');
            component.render(el);
            resolve(component);
        })

    }
}
