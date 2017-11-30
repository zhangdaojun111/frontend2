/**
 * Created by zhaoyan on 2017/11/20.
 */
import {CellBaseComponent} from '../base';
import template from './cell.approval.html';
import './cell.approval.scss'
import {workflowService} from "../../../../../../../services/workflow/workflow.service";
import {dgcService} from "../../../../../../../services/dataGrid/data-table-control.service";
import {PMAPI,PMENUM} from '../../../../../../../lib/postmsg';
import msgBox from '../../../../../../../lib/msgbox';

let config = {
    template: template,
    data: {
        id: 'approval',
        cellChart: {}
    },
    actions: {
        getRecord:function () {
            this.showLoading();
            workflowService.getRecords({"type":5,"rows":5000,"page":1}).then(res=>{
                if(res.success === 1){
                    this.actions.renderHTML(res.rows)
                }else{
                    this.hideLoading();
                    msgBox.showTips("服务器出错")
                }
            })
        },
        renderHTML:function (data) {
            let html = `<ul class="approval-ul">`;
            data.forEach((item,index)=>{
                html += `
                    <li class="approval-li" title="${item.name}" 
                    data-tableId="${item.table_id}" 
                    data-recordId="${item.id}" 
                    data-formId="${item.form_id}"
                    data-flowId="${item.flow_id}">${item.name}</li><br>`
            })
            html += `</ul>`;
            this.el.find('#'+this.data.id).html(html);
            this.hideLoading();
        },
        openApproval:function (data) {
            let obj = {
                form_id: data["form_id"],
                record_id: data["record_id"],
                flow_id: data["flow_id"],
                table_id: data["table_id"]
            };
            let winTitle = '查看工作';
            obj['btnType'] = 'view';
            let url = dgcService.returnIframeUrl( '/wf/approval/',obj );
            this.actions.openSourceDataGrid( url,winTitle );
        },
        openSourceDataGrid: function ( url,title ) {
            let defaultMax = false;
            if( url.indexOf( '/wf/approval/' ) != -1 ){
                defaultMax = true;
            }
            PMAPI.openDialogByIframe( url,{
                width: 1000,
                height: 800,
                title: title,
                modal:true,
                // defaultMax: defaultMax,
                customSize: defaultMax
            } ).then( (data)=>{
                console.log( "工作流操作返回" );
                console.log( data );

                if( data.refresh ){
                    console.log('刷新')
                    this.actions.getRecord();
                }
            } )
        },

    },
    binds:[
        {
            event: 'click',
            selector: '.approval-li',
            callback: function(e){
                let data = {
                    table_id:$(e).attr("data-tableId"),
                    form_id:$(e).attr("data-formId"),
                    flow_id:$(e).attr("data-flowId"),
                    record_id:$(e).attr("data-recordId"),
                };
                this.actions.openApproval(data);
            }
        },
    ],
    afterRender() {},
    firstAfterRender() {
        this.actions.getRecord();
    }
};

export class CellApprovalComponent extends CellBaseComponent {
    constructor(data,event,extendConfig) {
        super($.extend(true,{},config,extendConfig),data,event);
        this.data.id += this.componentId;
    }
}
