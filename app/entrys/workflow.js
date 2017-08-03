
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
            alert('the_last_draft time is:'+res.the_last_draft);
        }else{
            alert('there is no draft');
        }
    });
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
})