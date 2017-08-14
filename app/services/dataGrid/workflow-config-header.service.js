
//pageType{0:'进展中的工作',1:'已完成的工作',2:'我的工作申请中的工作',3:'我的工作已完成的工作',4:'我的工作审批过的工作',5:'工作审批',6:'我的工作已关注的工作'}
export const wchService = {
    //公共的头
    ordinaryHeader: [
        { headerName: '工作名称', field: 'name' },
        { headerName: '关键字', field: 'keyword' },
        { headerName: '所属流程名称', field: 'flow_name' },
        { headerName: '当前状态', field: 'status' },
        { headerName: '发起人', field: 'start_handler' },
        { headerName: '当前节点', field: 'current_node' },
        { headerName: '创建时间', field: 'create_time',dinput_type:'5' },
        { headerName: '执行结果', field: 'wf_result' }
    ],
    //操作列
    headerFor0: [
        { headerName: '操作', width: 120,field:'operation', suppressSorting: true,suppressMenu: true,suppressMovable: true,suppressResize: true, cellRenderer: this.handleCellRenderer_0,minWidth: 50}
    ],
    headerFor1: [
        { headerName: '操作', width: 120,field:'operation', suppressSorting: true,suppressMenu: true,suppressMovable: true,suppressResize: true, cellRenderer: this.handleCellRenderer_1,minWidth: 50},
        { headerName: '完成时间', field: 'end_time',dinput_type:'5' }
    ],
    headerFor2: [
        { headerName: '操作', width: 120,field:'operation', suppressSorting: true,suppressMenu: true,suppressMovable: true,suppressResize: true, cellRenderer: this.handleCellRenderer_2,minWidth: 50},
        { headerName: '最后审批时间', field: 'last_handler_time',dinput_type:'5' }
    ],
    headerFor3: [
        { headerName: '操作', width: 120,field:'operation', suppressSorting: true,suppressMenu: true,suppressMovable: true,suppressResize: true, cellRenderer: this.handleCellRenderer_3,minWidth: 50},
        { headerName: '完成时间', field: 'end_time',dinput_type:'5' },
        { headerName: '最后审批时间', field: 'last_handler_time',dinput_type:'5' }
    ],
    headerFor4: [
        { headerName: '操作', width: 120,field:'operation', suppressSorting: true,suppressMenu: true,suppressMovable: true,suppressResize: true, cellRenderer: this.handleCellRenderer_4,minWidth: 50},
        { headerName: '完成时间', field: 'end_time',dinput_type:'5' },
        { headerName: '最后审批时间', field: 'last_handler_time',dinput_type:'5' }
    ],
    headerFor5: [
        { headerName: '操作', width: 120,field:'operation', suppressSorting: true,suppressMenu: true,suppressMovable: true,suppressResize: true, cellRenderer: this.handleCellRenderer_5,minWidth: 50},
        { headerName: '紧急程度', field: 'emergency_degree', width: 120,suppressMenu: true,suppressResize: true, cellRenderer: (params) => {return this.handleCellRendererColor_5(params);},minWidth: 50 },
        { headerName: '审批开始时间', field: 'approve_start_time',dinput_type:'5' },
        { headerName: '审批结束时间', field: 'approve_over_time',dinput_type:'5' },
        { headerName: '超时状态', field: 'approve_time_status' }
    ],
    headerFor6: [
        { headerName: '操作', width: 120,field:'operation', suppressSorting: true,suppressMenu: true,suppressMovable: true,suppressResize: true, cellRenderer: this.handleCellRenderer_6,minWidth: 50},
        { headerName: '最后审批时间', field: 'last_handler_time',dinput_type:'5' }
    ],
    handleCellRenderer_0: function (){
        return `
            <div style="text-align:center;">
                <a href=javascript:void(0); class="ui-link" data-type="view">查看</a>
                <span>|</span>
                <a href=javascript:void(0); class="ui-link" data-type="cancel">取消</a>
            <div>
       `;
    },
    handleCellRenderer_1: function (){
        return `
            <div style="text-align:center;">
                <a href=javascript:void(0); class="ui-link" data-type="view">查看</a>
            <div>
       `;
    },
    //操作（申请中的工作）
    handleCellRenderer_2: function (param){
        let data = param["data"];
        let html = '<div style="text-align:center;">' +
            '<a href=javascript:void(0); class="ui-link" data-type="view">查看</a>' +
            '<span>|</span>' +
            '<a href=javascript:void(0); class="ui-link" data-type="cancel">取消</a> ';
        if(data["record_status"] == 0 && data["edit_status"] == 0){
            html += '<span>|</span><a href=javascript:void(0); class="ui-link" data-type="withdraw">撤回</a>';
        }else if(data["edit_status"] == 1){
            html += '<span>|</span><a href=javascript:void(0); class="ui-link" data-type="edit">编辑</a>';
        }
        html += '</div>';
        return html;
    },
    //操作（已完成的工作，审批过的工作）
    handleCellRenderer_3: function (param){
        let data = param["data"];
        let html = `
            <div style="text-align:center;">
            <a href=javascript:void(0); class="ui-link" data-type="view">查看</a>`;
        if( data.cancel_approve ){
            html += '<span>|</span><a href=javascript:void(0); class="ui-link" data-type="drawApproval">撤回审批</a>'
        }
        html += '</div>';
        return html;
    },
    //操作（已完成的工作，审批过的工作）
    handleCellRenderer_4: function (param){
        let data = param["data"];
        let html = `
            <div style="text-align:center;">
            <a href=javascript:void(0); class="ui-link" data-type="view">查看</a>`;
        if( data.cancel_approve ){
            html += '<span>|</span><a href=javascript:void(0); class="ui-link" data-type="drawApproval">撤回审批</a>'
        }
        html += '</div>';
        return html;
    },
    //操作
    handleCellRenderer_5: function (){
        return `
            <div style="text-align:center;">
            <a href=javascript:void(0); class="ui-link" data-type="view">查看</a>
            <span>|</span>
            <a href=javascript:void(0); class="ui-link" data-type="approve">审批</a>
            <div>
       `;
    },
    handleCellRenderer_6: function (param){
        return '<div style="text-align:center;"></span><a href=javascript:void(0); class="ui-link" data-type="focusWorkflow">查看</a></div>';
    },
    //紧急程度
    handleCellRendererColor_5: function(params){
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
    }
}