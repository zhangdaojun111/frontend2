import Component from '../../../lib/component';
import './workflow-addFollow.scss';
import Mediator from '../../../lib/mediator';
import {PMAPI,PMENUM} from '../../../lib/postmsg';

let config={
    template: `<div class="flex flex-start">
    <div class="workflow-box-l">
        <div class="tit">
            <span>关注人</span>
            <i></i>
        </div>
    </div>
    <div class="workflow-box-r">
        <div class="content">
            <div class="add-follow" id="addFollower">添加关注人</div>
            <div class="follow-name-list" id="addFollowerList">
                
            </div>
        </div>
    </div>
   
</div>`,
    data:{},
    action:{

    },
    afterRender(){
        
        Mediator.subscribe("workflow:focused", (res) => {
            if(res.length>0){
                this.el.on('click','#addFollower',()=>{
                    PMAPI.openDialogByIframe(`/iframe/addFocus/?${res}`,{
                        width:1000,
                        height:800,
                        title:`添加关注人`,
                        modal:true
                    }).then(res=>{
                        Mediator.publish('workflow:offEvent',1);
                        if(!res.onlyclose){
                            let nameArr=[],idArr=[];
                            for(var k in res){
                                nameArr.push(res[k]);
                                idArr.push(k);
                            }
                            this.el.find('#addFollowerList').text(nameArr);
                            Mediator.publish('workflow:focus-users',idArr);
                        }
                    })
                });
            }else{
                this.el.on('click','#addFollower',()=>{
                    PMAPI.openDialogByIframe(`/iframe/addFocus/`,{
                        width:1000,
                        height:800,
                        title:`添加关注人`,
                        modal:true
                    }).then(res=>{
                        Mediator.publish('workflow:offEvent',1);
                        if(!res.onlyclose){
                            let nameArr=[],idArr=[];
                            for(var k in res){
                                nameArr.push(res[k]);
                                idArr.push(k);
                            }
                            this.el.find('#addFollowerList').text(nameArr);
                            Mediator.publish('workflow:focus-users',idArr);
                        }
                    })
                });
            }
        });
   
    }
};
class WorkflowAddFollow extends Component{
    constructor (data){
        super(config,data);
    }
}

let component = new WorkflowAddFollow();
let el = $('#add-home');
component.render(el);