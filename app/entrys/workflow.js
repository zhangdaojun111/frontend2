
import '../assets/scss/main.scss';

import 'jquery-ui/ui/widgets/button.js';
import 'jquery-ui/ui/widgets/dialog.js';

import {HTTP} from '../lib/http';
import {workflowService} from '../services/workflow/workflow.service';
import WorkFlowCreate from '../components/workflow/workflow-create/workflow-create';
import Mediator from '../lib/mediator';

let WorkFlowList=workflowService.getWorkfLow({}),
    FavWorkFlowList=workflowService.getWorkfLowFav({});


Promise.all([WorkFlowList,FavWorkFlowList]).then(res=>{
    WorkFlowCreate.loadData(res);
});

HTTP.flush();

//订阅workflow choose事件，获取工作流info并发布getInfo,获取草稿
Mediator.subscribe('workflow:choose', (msg)=> {
    let formData={};
    formData.form_id=msg.formid;
    console.log(formData);
    (async function () {
        return workflowService.getWorkflowInfo({url: '/get_workflow_info/?seqid=qiumaoyun_1501661055093&record_id=',data:{
            flow_id:msg.id
        }});
    })().then(res=>{
            Mediator.publish('workflow:gotWorkflowInfo', res);
            return workflowService.validateDraftData({form_id:msg.formid});
        })
        .then(res=>{
            if(res.the_last_draft!=''){
                $( "#dialog-confirm" ).dialog({
                    title:'提示',
                    resizable: false,
                    height: "auto",
                    width: 400,
                    modal: true,
                    buttons: {
                        "确认": function() {
                            $( this ).dialog( "close" );
                            //todo get draft info
                            $("#dialog-confirm").html('');
                        },
                        "取消": function() {
                            $( this ).dialog( "close" );
                            $("#dialog-confirm").html('');
                        }
                    }
                });
                $("#dialog-confirm").append(`<p><span class="ui-icon ui-icon-alert"></span>
                    您于${res.the_last_draft}时填写该工作表单尚未保存，是否继续编辑？
                </p>`);
            }else{
                alert('there is no draft');
            }
        })

});

//订阅收藏常用workflow
Mediator.subscribe('workflow:addFav', (msg)=> {
    (async function () {
        let data = await workflowService.addWorkflowFavorite({'id': msg});
    })();
});

//订阅删除常用workflow
Mediator.subscribe('workflow:delFav', (msg)=> {
    (async function () {
        let data = await workflowService.delWorkflowFavorite({'id': msg});
    })();
});

$("#draw").on('click',function () {
    location.reload();
});
