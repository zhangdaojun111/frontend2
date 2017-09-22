/**
 * @author qiumaoyun、 luyang
 * 驳回节点操作
 */
import template from './approval-dialog.html';
import Component from '../../../lib/component';
import Mediator from '../../../lib/mediator';
import '../../../assets/scss/core/common.scss'
import WorkFlow from '../workflow-drawflow/workflow';
import {PMAPI,PMENUM} from "../../../lib/postmsg";
import '../../../assets/scss/workflow/workflow-base.scss';
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

    },
    actions: {
        approveWorkflow(para){
            let key=obj.key;
            let formData=FormEntrys.getFormValue(obj.table_id),
                comment=$('#comment').val();
            para.data=JSON.stringify(formData);
            para.comment=comment;
            para.focus_users=JSON.stringify(focusArr);
            (async function () {
                return workflowService.approveWorkflowRecord({
                    url: '/approve_workflow_record/',
                    data: para
                });
            })().then(res => {
                if(res.success===1){
                    msgBox.alert(`操作成功`);
                }else{
                    msgBox.alert(`失败：${res.error}`);
                }
                PMAPI.sendToParent({
                    type: PMENUM.close_dialog,
                    key:key,
                    data:{refresh:true}
                })
            })
        }
    },
    afterRender: function() {
        Mediator.subscribe('approval:rejToAny', (id) => {
            if(id.length === 21){
                id=id.slice(5);
            }else if(id.length === 19){
                id=id.slice(3);
            }
            PMAPI.sendToParent({
                type: PMENUM.close_dialog,
                key:this.data.key,
                data:id
            })
        });

        PMAPI.getIframeParams(this.data.key).then(res=>{
            WorkFlow.createFlow({flow_id:res.data.flow_id,record_id:res.data.record_id,el:"#approvalDialog-box"});
        });
        this.el.on('click','.draged-item',function(){
            WorkFlow.rejectNode(this);
        });
    },
    beforeDestory: function () {
        Mediator.removeAll('approval:rejToAny');
    }
};
class ApprovalDialog extends Component{
    constructor (data){
        super(config,data);

    }

}

export default ApprovalDialog

