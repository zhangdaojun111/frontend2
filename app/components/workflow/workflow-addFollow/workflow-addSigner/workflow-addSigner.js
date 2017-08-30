/**
 *@author qiumaoyun
 *添加加签人page body
 */
import Component from '../../../../lib/component';
import template from './workflow-addSigner.html';
import '../workflow-addFollow/workflow-addFollow.scss';
import './workflow-addSigner.scss';
import Mediator from '../../../../lib/mediator';
import SelectStaff from '../select-staff/select-staff';
import {PMAPI,PMENUM} from '../../../../lib/postmsg';
import AddSigner from '../add-signer/add-signer';

let config={
    template: template,
    data:{},
    action:{
        search(){
            let keyword = this.el.find(".signer-search").val();
            let node = this.el.find('#addUsercheck').find('.w33');
            let par = this.el.find("#addUsercheck").children();
            let arr = _.chunk(node,3);
            let len = arr.length;
            for(let i =0;i<len;i++){
                if(arr[i][1].innerText.indexOf(keyword)!=-1 || arr[i][2].innerText.indexOf(keyword)!=-1){
                    par[i].style.display = "block";
                }else{
                    par[i].style.display = "none";
                }
            }
        },
    },
    afterRender(){
        this.el.on("input propertychange",".signer-search",()=>{
            this.action.search();
        })

        const __this=this;
        this.el.find('#staffMulti').html('');
        //部门选择
        Mediator.subscribe('workflow:checkDept', (res)=> {
            $.each(res,(i,val)=>{
                val.id=i;
                this.append(new SelectStaff(val), this.el.find('#staffMulti'));
            });
        });
        //部门反选，删除SelectedStaff组件
        Mediator.subscribe('workflow:unCheckDept', (res)=> {
            let userArr=[];
            for(var id in res){
                userArr.push(id);
            }
            let domDiv=this.el.find('#staffMulti').find('.flex');
            for(var i=0;i<domDiv.length;i++){
                for(var j=0;j<userArr.length;j++){
                    if($(domDiv[i]).data('id')===userArr[j]){
                        $(domDiv[i]).parent().remove();
                    }
                }
            }
            let domSpan=this.el.find('#selected').find('span');
            for(var i=0;i<domSpan.length;i++){
                for(var j=0;j<userArr.length;j++){
                    if($(domSpan[i]).data('id')===userArr[j]){
                        $(domSpan[i]).parent().remove();
                    }
                }
            }
        });


        Mediator.subscribe('workflow:checkAdder', (res)=> {
            $.each(res,(i,val)=>{
                val.id=i;
                this.append(new AddSigner(val), this.el.find('#addUsercheck'));
            });
        });

        Mediator.subscribe('workflow:unCheckAdder', (res)=> {
            let userArr=[];
            for(var id in res){
                userArr.push(id);
            }
            let domDiv=this.el.find('#addUsercheck').find('.flex');
            for(var i=0;i<domDiv.length;i++){
                for(var j=0;j<userArr.length;j++){
                    if($(domDiv[i]).data('id')===userArr[j]){
                        $(domDiv[i]).parent().remove();
                    }
                }
            }
        });

        //saving follower
        this.el.on('click','#saveFollower',()=>{
            let o={};
            let domSpan=this.el.find('#selected').find('span');
            for(var i=0;i<domSpan.length;i++){
                o[$(domSpan[i]).data('id')]=$(domSpan[i]).text();
            }
            
        })
        this.el.on('click','[name="addUser"]',function(){
            __this.data.sigh_user_id=this.value;
            __this.el.find('#subAdder').removeAttr('disabled');
        });
        this.el.on('click','#subAdder',function(){
            let o={};
            o.sigh_type=__this.el.find('[name="addHandlerType"]:checked').val();
            o.sigh_user_id=__this.data.sigh_user_id;
            PMAPI.sendToParent({
                type: PMENUM.close_dialog,
                key:__this.data.key,
                data:o
            })
        });
    }
};
class WorkflowAddSigner extends Component{
    constructor (data){
        super(config,data);
    }
}

export default {
    showAddSigner(data) {
        let component = new WorkflowAddSigner(data);
        let el = $('#add-signer');
        component.render(el);
    }
};