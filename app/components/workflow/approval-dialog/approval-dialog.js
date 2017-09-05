import template from './approval-dialog.html';
import Component from '../../../lib/component';
import Mediator from '../../../lib/mediator';
import WorkFlow from '../workflow-drawflow/workflow';
import {PMAPI} from "../../../lib/postmsg";
let serchStr = location.search.slice(1),nameArr=[],obj = {},focus=[],is_view,tree=[],staff=[];;
serchStr.split('&').forEach(res => {
    let arr = res.split('=');
    obj[arr[0]] = arr[1];
});

let config = {
    // template: template.replace(/(\")/g, '\''),
    template: template,
    data: {
        workflowData:null,
        key:obj.key
        // flow_id:obj.flow_id,

    },
    actions: {

    },
    afterRender: function() {
       PMAPI.getIframeParams(this.data.key).then(res=>{
            WorkFlow.createFlow({flow_id:res.data.flow_id,record_id:res.data.record_id,el:"#drawflow"});
       })

    },
};
class ApprovalDialog extends Component{
    constructor (data){
        super(config,data);

    }

}

export default ApprovalDialog

