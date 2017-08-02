
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
})

Mediator.subscribe('workflow:choose', (msg)=> {
    (async function () {
        let data = await workflowService.getWorkfLowInfo({url: '/get_workflow_info/?seqid=qiumaoyun_1501661055093&record_id=',data:{
            flow_id:msg.id
        }});

        Mediator.publish('workflow:getInfo', data);
    })();
});

//addFav
Mediator.subscribe('workflow:addFav', (msg)=> {
    (async function () {
        let data = await workflowService.addWorkflowFavorite({'id': msg});
        console.log(data);
        // Mediator.publish('workflow:getInfo', data);
    })();
});

//delFav
Mediator.subscribe('workflow:delFav', (msg)=> {
    (async function () {
        let data = await workflowService.delWorkflowFavorite({'id': msg});
        console.log(data);
        // Mediator.publish('workflow:getInfo', data);
    })();
});



HTTP.flush();



