/**
* @author yangxiaochuan
* 导入数据
*/

import Component from "../../../../lib/component";
import template from './data-table-import.html';
import './data-table-import.scss';
import msgBox from '../../../../lib/msgbox';
import {PMAPI,PMENUM} from '../../../../lib/postmsg';
import {Uploader} from "../../../../lib/uploader";
import {FormService} from "../../../../services/formService/formService";
import WorkFlow from "../../../../components/workflow/workflow-drawflow/workflow";

let config = {
    template: template,
    data: {
        tableId: '',
        isAdmin: '',
        parentTableId: '',
        parentRealId: '',
        parentTempId: '',
        isBatch: 0,
        flowId: '',
        workflowList: [],
        formId: '',
        fileData: {},
        //是否更多
        needMore: false,
        warning_msg: '',
        viewMode: 'normal',
        formData: '',
    },
    actions: {
        prepareWorkflowData: function () {
            FormService.getPrepareParmas({table_id: this.data.tableId}).then( res=>{
                let workflow = this.el.find( '.workflow' );
                if( res.data.flow_data.length != 0 ){
                    this.data.formId = res.data.form_id;
                    this.data.workflowList = res.data.flow_data;
                    let html = '';
                    try{this.data.flowId = this.data.workflowList[0]['flow_id'] || '';}catch(e){}
                    for( let d of this.data.workflowList ){
                        html+= '<option value='+ d.flow_id + '>' + d.flow_name + '</option>';
                        if( d.selected == 1 ){
                            this.data.flowId = d.flow_id;
                        }
                    }
                    let choose = this.el.find( '.chooseFlow' )
                    choose[0].innerHTML = html;
                    choose.eq(0).val(this.data.flowId);
                    workflow[0].style.display = 'block';
                    workflow[1].style.display = 'block';
                    workflow[2].style.display = 'block';
                    this.actions.drawFlowChart();
                }else {
                    workflow[0].outerHTML = '';
                    workflow[1].outerHTML = '';
                    workflow[2].outerHTML = '';
                }
                //执行脚本
                if( res["data"]["upload_exec_file_remark"] ){
                    this.el.find( '.uploadRemark' ).show();
                    this.el.find( '.uploadRemark-con' )[0].innerHTML = res["data"]["upload_exec_file_remark"];
                }
                this.el.find( '.chooseFlow' ).on( 'change',()=>{
                    this.actions.drawFlowChart();
                } )
                this.hideLoading();
            } )
        },
        //设置流程图
        //执行导入
        drawFlowChart: function () {
            let obj = {
                flow_id: this.el.find( '.chooseFlow' )[0].value,
                el: this.el.find( '.flow-chart' )
            }
            this.data.flowId = obj['flow_id'];
            let flowchart = WorkFlow.createFlow( obj );
            this.el.find( '.flowCharCon' )[0].style.width = '95%';
        },
        import: function () {
            let i = 0;
            for( let f in this.data.fileData ){
                i++;
            }
            if( i == 0 ){
                msgBox.alert( '请选择导入文件！' );
                return;
            }
            //只保留最新选择的附件
            let num = 0;
            for( let code in this.data.fileData ){
                num++;
            }
            let newFile = {}
            let n = 0;
            let currentCode ='';
            for( let code in this.data.fileData ){
                n++;
                if( n==num ){
                    newFile[code] = this.data.fileData[code];
                    currentCode = code;
                }else {
                    this.uploader.deleteFileByCode( code,'/upload_data/' );
                }
            }
            this.data.fileData = newFile;
            let json = {
                file:'upload_file',
                table_id: this.data.tableId,
                parent_table_id: this.data.parentTableId,
                parent_real_id: this.data.parentRealId,
                parent_temp_id: this.data.parentTempId,
                is_batch: this.data.isBatch,
                flow_id: this.data.flowId
            }
            if( this.data.viewMode == 'EditChild' ){
                json['parent_data'] = this.data.formData
            }
            if( this.data.needMore ){
                json['has_create_user'] = this.el.find( '.has_create_user' ).parent('td').attr('name');
                json['unique_check'] = this.el.find( '.unique_check' ).parent('td').attr('name');
                json['use_increment_data'] = this.el.find( '.use_increment_data' ).parent('td').attr('name');
                json['use_default_value'] = this.el.find( '.use_default_value' ).parent('td').attr('name');
            }
            if( this.data.warning_msg ){
                json['warning_msg'] = JSON.stringify( this.data.warning_msg );
            }
            this.uploader.appendData( json )
            let That = this;
            let toolbox = {
                update:function () {},
                finish:function (res) {},
                showError:function () {}
            }
            //只有在文件大小大于1MB的时候才会显示进度条
            // if(Object.values(this.data.fileData)[0].file.size >= 1000000){
                let progressParams = this.uploader.getProgressParams(this.data.key);
                toolbox = msgBox.showProgress(progressParams);
            // }
            this.uploader.upload('/upload_data/',{}, toolbox.update,(res)=>{
                if( res.success ){
                    toolbox.finish(res);
                    msgBox.showTips( res.error );
                    if( this.data.isBatch ){
                        let ids = res.ids || [];
                        PMAPI.sendToParent({
                            type: PMENUM.close_dialog,
                            key: That.data.key,
                            data: {
                                type: 'batch',
                                ids: ids
                            }
                        })
                    }else {
                        PMAPI.sendToParent({
                            type: PMENUM.close_dialog,
                            key: That.data.key,
                            data: {
                                type: 'export'
                            }
                        })
                    }
                }else {
                    this.data.warning_msg = '';
                    if( res.warning_msg ){
                        let warning_msg = res.warning_msg || {};
                        let warning_list = res.warning_list || [];
                        msgBox.confirm( res.error ).then( r=>{
                            if( r ){
                                for( let w of warning_list ){
                                    if( warning_msg[w] == 0 ){
                                        warning_msg[w] = 1
                                        break;
                                    }
                                }
                                this.data.warning_msg = warning_msg;
                                this.actions.import();
                            } else {
                                this.uploader.deleteFileByCode( currentCode,'/upload_data/' );
                            }
                        } )
                    }else {
                        msgBox.alert( res.error );
                        this.data.fileData = {};
                    }
                }
                this.actions.fileTip();
            },toolbox.showError);
        },
        //改变文件提示
        fileTip: function () {
            let name = '请选择文件';
            for( let k in this.data.fileData ){
                name = this.data.fileData[k].filename;
            }
            this.el.find( '.file-name' )[0].innerHTML = name;
        },
        //加载更多
        addMore: function () {
            this.data.needMore = !this.data.needMore;
            let more = this.el.find( '.need-more' );
            for( let m of more ){
                m.style.display = this.data.needMore?'block':'none';
            }
            this.el.find( '.more-btn .text' )[0].innerHTML = this.data.needMore?'收起':'展开更多';
            if(this.data.needMore) {
                this.el.find('.more-btn .img').addClass('active')
            } else {
                this.el.find('.more-btn .img').removeClass('active')
            }
        }
    },
    afterRender: function (){
        PMAPI.getIframeParams(window.config.key).then((res) => {
            this.data.formData = res.data.formData || '';
        })
        if( this.data.isBatch == '0' && this.data.viewMode != 'EditChild' ){
            this.showLoading();
            this.actions.prepareWorkflowData();
        }
        //上传初始化
        let obj = {
            selectMode:'single',
            file_filter:'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.wwzip'
        }
        this.uploader = new Uploader(obj);
        this.el.on( 'click','.uploader-button',()=>{
            //上传文件
            this.uploader.addFile( this.data.key ).then(res=>{
                this.data.fileData = res;
                this.actions.fileTip();
            });
        } )
        this.el.on('click','.radio-container', function(){
            if(!$(this).find('.radio-in').hasClass('active')){
                if($(this).parent('td').attr('name') == 1){
                    $(this).parent('td').attr('name', 0)
                } else {
                    $(this).parent('td').attr('name', 1)
                }
            }
            $(this).parent().find('.radio-in').removeClass('active');
            $(this).find('.radio-in').addClass('active');
        })
        this.el.on( 'click','.import-submit-btn',()=>{
            this.actions.import();
        } )
        if( this.data.isSuperUser == 1 ){
            this.el.on( 'click','.more-btn',()=>{
                this.actions.addMore();
            } )
        }else {
            this.el.find( '.more-btn' )[0].outerHTML = '';
        }
    }
}

class dataTableImport extends Component {
    constructor(data,newConfig){
        super($.extend(true,{},config,newConfig,{data:data||{}}));
    }
}

export default dataTableImport;