import Component from '../../../lib/component';
import template from './workflow-catalog.html';
import './workflow-catalog.scss';

import agGrid from '../../dataGrid/agGrid/agGrid';
import Mediator from '../../../lib/mediator';
import {PMAPI,PMENUM} from '../../../lib/postmsg';
import msgBox from '../../../lib/msgbox';


let config={
    template:template,
    data:{
        // "total": 2, "rows": [{"approve_start_time": "2017-08-10 15:10:56", "wf_type": 1, "create_time": "2017-08-08 17:06:10", "record_progress": 0.4, "start_handler": "\u738b\u8fea", "table_name": "\u738b\u8fea\u6d4b\u8bd5\u8868", "flow_name": "\u738b\u8fea\u6d4b1\u8bd5\u6d41\u7a0b2", "temp_ids": ["59897efec3ec2134050ee6a5"], "approve_time_status": "\u672a\u8d85\u65f6", "record_status": 0, "wf_is_delete_type": 0, "id": "59897f02c3ec2134050ee6a7", "flow_id": 32, "table_id": "5318_EHFuJD7Ae76c6GMPtzdiWH", "last_handler_time": "2017-08-10 15:10:56", "wf_result": "", "is_batch": 0, "emergency_degree": "4", "form_id": 181, "edit_status": 0, "current_node": "\u738b\u8fea", "approve_over_time": "-", "name": "\u738b\u8fea \u3010\u738b\u8fea\u6d4b1\u8bd5\u6d41\u7a0b2\u3011\u65b0\u5efa\uff08\u666e\u901a\uff09", "keyword": "", "status": "\u5f85\u738b\u8fea\u5ba1\u6279", "end_time": "-"}, {"approve_start_time": "2017-08-10 14:57:25", "wf_type": 1, "create_time": "2017-08-08 17:03:47", "record_progress": 0.4, "start_handler": "\u738b\u8fea", "table_name": "\u738b\u8fea\u6d4b\u8bd5\u8868", "flow_name": "\u738b\u8fea\u6d4b1\u8bd5\u6d41\u7a0b2", "temp_ids": ["59897e73d8e9e4077b731572", "59897e73d8e9e4077b731573", "59897e73d8e9e4077b731574", "59897e73d8e9e4077b731575", "59897e73d8e9e4077b731576", "59897e73d8e9e4077b731577", "59897e73d8e9e4077b731578", "59897e73d8e9e4077b731579", "59897e73d8e9e4077b73157a"], "approve_time_status": "\u672a\u8d85\u65f6", "record_status": 0, "wf_is_delete_type": 0, "id": "59897e736c88ad8c3adeb223", "flow_id": 32, "table_id": "5318_EHFuJD7Ae76c6GMPtzdiWH", "last_handler_time": "2017-08-10 14:57:25", "wf_result": "", "is_batch": 1, "emergency_degree": "4", "form_id": 181, "edit_status": 0, "current_node": "\u738b\u8fea", "approve_over_time": "-", "name": "\u738b\u8fea \u3010\u738b\u8fea\u6d4b1\u8bd5\u6d41\u7a0b2\u3011\u65b0\u5efa\uff08\u6279\u91cf\uff09", "keyword": "", "status": "\u5f85\u738b\u8fea\u5ba1\u6279", "end_time": "-"}], "field_mapping": {"wf_type": "f17", "wf_approve_time": "f26", "wf_about_mapping": "f20", "create_time": "f1", "record_progress": "f34", "start_handler": "f11", "flow_name": "f6", "wf_pinyin_first_letter": "f15", "wf_is_delete_type": "f14", "wf_data_type": "f23", "wf_status": "f10", "last_handler_time": "f30", "wf_result": "f16", "wf_message": "f12", "the_last_handler_id": "f29", "wf_node": "f8", "wf_unique_check": "f27", "cancel_approve_handlerids": "f31", "wf_mapping": "f19", "wf_current_handlers": "f22", "wf_mongo_id": "f18", "ID": "_id", "wf_version": "f21", "wf_values": "f7", "name": "f5", "keyword": "f28", "wf_create_type": "f33", "end_time": "f9", "is_trigger_record": "f32"}, "error": ""
    },
    actions:{
        init(){
            this.actions.setcurrentTab();
        },
        //操作类型
        setcurrentTab(){
            this.currentTab ={};
            this.currentTab['type'] =  "approve";
        },

        //生成编号
         handleCellRendererNumber (params){
            let data = params["data"];
            return '<span class="J_number" style="text-align: center;" data-tableId="'+data['table_id']+'" data-recordid="'+data['id']+'" data-formid="'+data['form_id']+'">' + (params.rowIndex + 1) + '</span>';
        },
        //生成审批操作
        // approvalActions(e){
        //      console.log(e);
        //     return '<div style="text-align:center;"><a href="javascript:void(0);" class="ui-link" data-type="approve" data-recordid="\'+data[\'id\']+\'" data-fromid="\'+data[\'form_id\']+\'">审批</a></div>';
        // },

        //紧急程度
        handleCellRendererColor_5(params){
            let obj = {
                "1":{color:"#999999",title:"超时"},
                "2":{color:"#FF0000",title:"非常紧急"},
                "3":{color:"#FF9900",title:"紧急"},
                "4":{color:"#00CC00",title:"一般"}
            }
            let data = params.data;
            let color = data.emergency_degree ? obj[data.emergency_degree]["color"] : "";
            let title = data.emergency_degree ? obj[data.emergency_degree]["title"] : "";
            return '<div style="width: 100%; height: 100%; text-align: center; color:'+ color +'">'+ title +'<div/>';
        },
        //对超时状态进行样式渲染
        bodyCellRenderer(param) {
            // console.log(param.data['approve_time_status']);
            let obj = param.data;
            // console.log(obj);
            let html = "";
            let value = obj['approve_time_status'];
            // console.log(value);
            if(value == '已超时') {
                html += `<span style="color:red;">${ value }</span>`;
            }else if(value == '未超时'){
                html += `<span style="color:#000;">${ value }</span>`;
            }else{
                html += `<span style="color:green;">${ value }</span>`;
            }
            return html;
        },
        //操作（申请中的工作）
        handleCellRenderer(param,_this_){
            let data = param["data"];
            let html = '<div style="text-align:center;">';
            let type = _this_.currentTab["type"];
            if(type == 'approve') {
                html += '<a href="javascript:void(0);" class="ui-link J_browse xx">审批</a>';
            }else if(type == 'approving') {
                html += '<a href=javascript:void(0); class="ui-link J_cancel hh" data-type="cancel" >取消</a> ';
                if(data["record_status"] == 0 && data["edit_status"] == 0){
                    html += '<span>|</span><a href=javascript:void(0); class="ui-link J_withdraw" data-type="withdraw">撤回</a>';
                }else if(data["edit_status"] == 1){
                    html += '<span>|</span><a href=javascript:void(0); class="ui-link J_edit" data-type="edit">编辑</a>';
                }
            }
            html += '</div>';
            return html;
        },
        //打开新的工作流
        openWorkFlow(ev){
            console.log(ev);
            let record_id = $(ev).attr('data-recordid');
            let form_id = $(ev).attr('data-formid');
            let table_id = $(ev).attr('data-table_id');
            PMAPI.openDialogByIframe(`/wf/approval/?record_id=${record_id}&form_id=${form_id}&table_id=${table_id}`,{
                width:1500,
                height:1000,
                title:"审批工作流",
                modal:true
            })
        }

    },
    afterRender:function(){
        this.actions.init();
        // (()=>Mediator.publish("workflow:getRecordTotal"))();
        //获取的申请和关注的总数
        Mediator.subscribe("workflow:getRecordTotal",(msg)=>{
            if(msg.success == 1) {
                this.el.find(".process").text(msg.in_process_total);
                this.el.find(".gzsl").text(msg.focus_total);
            }
        });
        Mediator.subscribe("workflow:getRecords",(msg)=>{
            console.log(msg);
            this.data = msg;
            console.log(this.currentTab["type"]);
            if(this.currentTab["type"]=="approve"){
                this.data.columnDefs = this.approveColumnDefs;
            }else if(this.currentTab["type"]=="approving"){
                this.data.columnDefs = this.approvingColumnDefs;
            }else if(this.currentTab["type"]=="focus"){
                this.data.columnDefs = this.focusWorkflowColumnDefs;
            }
            this.data.field_mapping = msg.field_mapping;
            this.data.rowData = msg.rows;
            if(this.el.find('#home-page-workflow').children().length != 0) {
                this.el.find('#home-page-workflow').children().remove();
            }
            console.log(this.data);
            this.append(new agGrid(this.data),$("#home-page-workflow"));
        })
        //切换不同的列头
        //进展中的工作，1已完成的工作，2当前用户申请中的工作，3当前用户已完成的工作，4当前用户审批过的工作,5待审批的工作,6关注的工作
        console.log(this)
        this.el.on('click','.dp',()=>{
            this.currentTab['type'] =  "approve";
            this.el.find(".dp").addClass("selected");
            this.el.find('.sq').removeClass("selected");
            this.el.find('.focus').removeClass("selected");
            Mediator.publish("workflow:Record",{
                "type":5,
                "rows":9999,
                "page":1
            });
        });
        this.el.on('click','.sq',()=>{
            this.currentTab['type'] =  "approving";
            this.el.find(".sq").addClass("selected");
            this.el.find('.dp').removeClass("selected");
            this.el.find('.focus').removeClass("selected");
            Mediator.publish("workflow:Record",{
                "type":2,
                "rows":9999,
                "page":1
            });
        });
        this.el.on('click','.focus',()=>{
            this.currentTab['type'] =  "focus";
            this.el.find(".focus").addClass("selected");
            this.el.find('.sq').removeClass("selected");
            this.el.find('.dp').removeClass("selected");
            Mediator.publish("workflow:Record",{
                "type":6,
                "rows":9999,
                "page":1
            });
        });

        this.el.on('click','.J_browse',(e)=>{
            let ev = $(e.target).parent().parent().parent();
            let event = ev.find('.J_number');
            console.log(event);
            this.actions.openWorkFlow(event);
        });
        this.el.on('dblclick','#myGrid',(e)=>{
            console.log(126546948);
            let clickNode = $(e.target).parent();
            if(this.currentTab['type'] == "approve"){
                clickNode.find('.J_browse').click();
            }else if(this.currentTab['type'] == "approving"){
                let node = clickNode.find('.J_number');
                this.actions.openWorkFlow(node);
            }else if(this.currentTab['type'] == "focus"){
                let node = clickNode.find('.J_number');
                this.actions.openWorkFlow(node);
            }
        })
        this.el.on('click','.J_cancel',(e)=>{
           msgBox.confirm("是否取消").then(res=>{
               if(res) {
                   console.log(1)
                   Mediator.publish("workflow:approve",e);
               }
           })
        }),
        Mediator.subscribe("getApprove",e=>{
            console.log(4)
            if(e.success==1){
                msgBox.alert("取消成功");
            }
        }),
        //待审批的工作列头
        this.approveColumnDefs=[
            {cellRenderer:(params)=>this.actions.handleCellRendererNumber(params),headerName: '序号', colId: "number", hide: false, field: "number", width: 70, suppressSorting: true, suppressResize: true, suppressMovable: true, suppressMenu: true, cellStyle: {'text-align': 'center'}},
            {headerName: '操作',field:'operation', width: 70,suppressSorting: true,suppressMenu: true,suppressMovable: true,suppressResize: true, cellRenderer:(params)=>this.actions.handleCellRenderer(params,this)},
            { headerName: '紧急程度', field: 'emergency_degree', width: 120,suppressMenu: true,suppressResize: true,minWidth: 50,cellRenderer: (params) => {return this.actions.handleCellRendererColor_5(params);} },
            { headerName: '工作名称', field: 'name',suppressMenu: true, width: 220},
            { headerName: '审批开始时间', field: 'approve_start_time',suppressMenu: true, width: 160 },
            { headerName: '审批结束时间', field: 'approve_over_time',suppressMenu: true, width: 160 },
            { headerName: '超时状态', field: 'approve_time_status',suppressMenu: true,width: 150,cellRenderer: ( params ) => {return this.actions.bodyCellRenderer( params )}}

        ];
        //申请中的工作列头
        this.approvingColumnDefs = [
            {cellRenderer:(params)=>this.actions.handleCellRendererNumber(params), headerName: '序号', colId: "number", hide: false, field: "number", width: 70, suppressSorting: true, suppressResize: true, suppressMovable: true, suppressMenu: true, cellStyle: {'text-align': 'center'}},
            { headerName: '操作',field:'operation', width: 100,suppressSorting: true,suppressMenu: true,suppressMovable: true,suppressResize: true, cellRenderer: (params) => {return this.actions.handleCellRenderer(params,this);}},
            { headerName: '工作名称', field: 'name',suppressMenu: true },
            { headerName: '创建时间', field: 'create_time',suppressMenu: true }
        ];
        //关注的工作列头
        this.focusWorkflowColumnDefs = [
            {cellRenderer:(params)=>this.actions.handleCellRendererNumber(params), headerName: '序号', colId: "number", hide: false, field: "number", width: 70, suppressSorting: true, suppressResize: true, suppressMovable: true, suppressMenu: true, cellStyle: {'text-align': 'center'}},
            { headerName: '工作名称', field: 'name',suppressMenu: true },
            { headerName: '创建时间', field: 'create_time',suppressMenu: true },
            { headerName: '操作人', field: 'at_user_info',suppressMenu: true },
            { headerName: '当前状态', field: 'status',suppressMenu: true },
        ];

    }
};
class workflowCatalog extends Component{
    constructor (data){
        super(config,data);
    }
}

export default {
    showCatalog(data){
        let component = new workflowCatalog(data);
        let el = $('#ceshi');
        component.render(el);
    },
};

