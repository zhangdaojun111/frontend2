/**
 * @author hufei
 * 首页中工作流的展示，但是没有首页了，组长喊先留着
 */
import Component from '../../../lib/component';
import template from './workflow-catalog.html';
import './workflow-catalog.scss';

import agGrid from '../../dataGrid/agGrid/agGrid';
import Mediator from '../../../lib/mediator';
import {PMAPI,PMENUM} from '../../../lib/postmsg';
import msgBox from '../../../lib/msgbox';


let config={
    template:template,
    data: {},
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
            return '<span class="J_number" style="text-align: center;" data-flowid="'+data['flow_id']+'" data-tableId="'+data['table_id']+'" data-recordid="'+data['id']+'" data-formid="'+data['form_id']+'">' + (params.rowIndex + 1) + '</span>';
        },
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
            let obj = param.data;
            let html = "";
            let value = obj['approve_time_status'];
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
            let record_id = $(ev).attr('data-recordid');
            let form_id = $(ev).attr('data-formid');
            let table_id = $(ev).attr('data-tableid');
            let flow_id = $(ev).attr('data-flowid');
            PMAPI.openDialogByIframe(`/wf/approval/?record_id=${record_id}&form_id=${form_id}&table_id=${table_id}&flow_id=${flow_id}`,{
                width:1500,
                height:1000,
                title:"审批工作流",
                modal:true
            })
        },
        dpClick(){
            this.currentTab['type'] =  "approve";
            this.el.find(".dp").addClass("selected");
            this.el.find('.sq').removeClass("selected");
            this.el.find('.focus').removeClass("selected");
            Mediator.publish("workflow:Record",{
                "type":5,
                "rows":9999,
                "page":1
            });
        },
        sqClick(){
            this.currentTab['type'] =  "approving";
            this.el.find(".sq").addClass("selected");
            this.el.find('.dp').removeClass("selected");
            this.el.find('.focus').removeClass("selected");
            Mediator.publish("workflow:Record",{
                "type":2,
                "rows":9999,
                "page":1
            });
        },
        foClick(){
            this.currentTab['type'] =  "focus";
            this.el.find(".focus").addClass("selected");
            this.el.find('.sq').removeClass("selected");
            this.el.find('.dp').removeClass("selected");
            Mediator.publish("workflow:Record",{
                "type":6,
                "rows":9999,
                "page":1
            });
        },
        dbclick(e){
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
        },
        draw(e){
            let el = $(e.target).parent().parent().parent().find('.J_number');
            let record_id = el.attr("data-recordid");
            this.code = 5;
            let data = {
                "record_id": record_id,
                "action": this.code
            };
            msgBox.confirm("是否撤回").then(res=>{
                if(res) {
                    console.log(1)
                    Mediator.publish("workflow:approve",data);
                }
            })
        },
        cal(e){
            let el = $(e.target).parent().parent().parent().find('.J_number');
            let record_id = el.attr("data-recordid");
            this.code = 4;
            let data = {
                "record_id": record_id,
                "action": this.code
            };
            msgBox.confirm("是否取消").then(res=>{
                if(res) {
                    console.log(1)
                    Mediator.publish("workflow:approve",data);
                }
            })
        },
        getRecords(msg){
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
        }

    },
    afterRender:function(){
        this.actions.init();
        //获取的申请和关注的总数
        Mediator.subscribe("workflow:getRecordTotal",(msg)=>{
            if(msg.success == 1) {
                this.el.find(".process").text(msg.in_process_total);
                this.el.find(".gzsl").text(msg.focus_total);
            }
        });
        Mediator.subscribe("workflow:getRecords",(msg)=>{
            this.actions.getRecords(msg);
        })
        //切换不同的列头
        //进展中的工作，1已完成的工作，2当前用户申请中的工作，3当前用户已完成的工作，4当前用户审批过的工作,5待审批的工作,6关注的工作
        this.el.on('click','.dp',()=>{
            this.actions.dpClick();
        });
        this.el.on('click','.sq',()=>{
            this.actions.sqClick();
        });
        this.el.on('click','.focus',()=>{
            this.actions.foClick();
        });

        this.el.on('click','.J_browse',(e)=>{
            let ev = $(e.target).parent().parent().parent();
            let event = ev.find('.J_number');
            this.actions.openWorkFlow(event);
        });
        this.el.on('dblclick','#myGrid',(e)=>{
            this.actions.dbclick(e);
        }),
        this.el.on('click','.J_withdraw',(e)=>{
            this.actions.draw(e);
        }),
        this.el.on('click','.J_cancel',(e)=>{
            this.actions.cal(e);
        }),
        this.el.on('click','.J_edit',(e)=>{
            let node = $(e.target).parent().parent().parent();
            let nodecode = node.find(".J_number");
            this.actions.openWorkFlow(nodecode);
        })
        Mediator.subscribe("getApprove",(e)=>{
            if(this.code==4){
                if(e.success==1){
                    msgBox.showTips("取消成功");
                }
            }else if(this.code==5){
                if(e.success==1){
                    msgBox.showTips("撤回成功");
                }
            }
            this.el.find('.sq').click();
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

