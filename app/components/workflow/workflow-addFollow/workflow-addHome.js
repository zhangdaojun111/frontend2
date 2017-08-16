import Component from '../../../lib/component';
import './workflow-addFollow.scss';
import Mediator from '../../../lib/mediator';
import {PMAPI,PMENUM} from '../../../lib/postmsg';

let config={
    template: `<div class="flex flex-column flex-start">
    <div class="workflow-box-l flex">
        <div class="tit">
            <i class="workflow-icon icon-workflow-icon3"></i>
            <span>关注人</span>
        </div>
        <div class="add-follow flex" id="addFollower"><span class="workflow-icon icon-workflow-icon6 add-icon"></span><span>添加关注人</span></div>
    </div>
    <div class="workflow-box-r">
        <div class="content">
            <div class="follow-name-list" id="addFollowerList">
                
            </div>
        </div>
    </div>
   
</div>`,
    data:{},
    action:{

    },
    afterRender(){
        this.el.on('click','#addFollower',()=>{
            PMAPI.openDialogByIframe(`/iframe/addFocus/`,{
                width:1000,
                height:800,
                title:`添加关注人`,
                modal:true
            }).then(res=>{
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
};
class WorkflowAddFollow extends Component{
    constructor (data){
        super(config,data);
    }
}

let component = new WorkflowAddFollow();
let el = $('#add-home');
component.render(el);