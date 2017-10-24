/**
 *@author qiumaoyun
 *批量审批
 */
import Component from '../../../lib/component';
import template from './multi-app.html';
import '../../../assets/scss/workflow/workflow-base.scss';
import './multi-app.scss'
import Mediator from '../../../lib/mediator';
import msgBox from '../../../lib/msgbox';
import {PMAPI,PMENUM} from "../../../lib/postmsg";
import {workflowService} from '../../../services/workflow/workflow.service';

let config={
    template: template,
    data:{
        checkIds:[]
    },
    actions:{
        approve(e){
            msgBox.confirm(`确认审批`)
            .then(res=>{
                if(res===true){
                    let postData={};
                    postData.action=e;
                    postData.comment=$('#comment').val();
                    postData.checkIds=this.data.checkIds;
                    (async function () {
                        return workflowService.approveManyWorkflow(postData);
                    })().then((res)=>{
                        if(res.success===1){
                            msgBox.alert(`操作成功：${res.error}`);
                        }else{
                            msgBox.alert(`操作失败：${res.error}`);
                        }
                        PMAPI.sendToParent({
                            type: PMENUM.close_dialog,
                            key:this.data.key,
                            data:{refresh:true}
                        })
                    })
                }
            })
            
        }
    },
    binds:[
        {
            event:'click',
            selector:'.pass',
            callback:function(){
                this.actions.approve(0);
            }
        },{
            event:'click',
            selector:'.rej-upper',
            callback:function(){
                this.actions.approve(1);
            }
        },{
            event:'click',
            selector:'.rej-start',
            callback:function(){
                this.actions.approve(2);
            }
        },
    ],
    afterRender(){
        PMAPI.getIframeParams(this.data.key).then((res) => {
            Mediator.publish('workflow:addusers', res.data);
            this.data.checkIds=res.data;
        })
    }
};
class MultiApp extends Component{
    // constructor (data){
    //     super(config,data);
    // }

    constructor(data,newConfig){
        super($.extend(true,{},config,newConfig,{data:data||{}}));
    }
}

export default MultiApp;