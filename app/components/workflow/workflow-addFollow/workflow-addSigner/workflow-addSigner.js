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
import msgBox from '../../../../lib/msgbox';

let config={
    template: template,
    data:{

    },
    action:{
        search(){
            let keyword = this.el.find(".signer-search").val();
            let node = this.el.find('#addUsercheck').find('.J_name');
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
            for(let id in res){
                userArr.push(id);
            }
            let domDiv=this.el.find('#staffMulti').find('.flex');
            for(let i=0;i<domDiv.length;i++){
                for(let j=0;j<userArr.length;j++){
                    if($(domDiv[i]).data('id')===userArr[j]){
                        $(domDiv[i]).parent().remove();
                    }
                    if(userArr[j]===__this.data.sigh_user_id){
                        __this.data.sigh_user_id = null;
                    }
                }
            }
            let domSpan=this.el.find('#selected').find('span');
            for(let i=0;i<domSpan.length;i++){
                for(let j=0;j<userArr.length;j++){
                    if($(domSpan[i]).data('id')===userArr[j]){
                        $(domSpan[i]).parent().remove();
                    }
                    if(userArr[j]===__this.data.sigh_user_id){
                        __this.data.sigh_user_id = null;
                    }
                }
            }
        });


        Mediator.subscribe('workflow:checkAdder', (res)=> {
            let arr = [];
            let checked=this.el.find('#addUsercheck .search-check-row');
            let len = checked.length;
            for(let i =0;i<len; i++){
                arr.push($(checked[i]).data('id'))
            }
            $.each(res,(i,val)=>{
                val.id=i;
                if(checked.length===0){
                    this.append(new AddSigner(val), this.el.find('#addUsercheck'));
                }else if(arr.indexOf(i)===-1){
                    this.append(new AddSigner(val), this.el.find('#addUsercheck'));
                }
            });
        });

        Mediator.subscribe('workflow:unCheckAdder', (res)=> {
            let userArr=[];
            for(let id in res){
                userArr.push(id);
            }
            let domDiv=this.el.find('#addUsercheck').find('.flex');
            for(let i=0;i<domDiv.length;i++){
                for(let j=0;j<userArr.length;j++){
                    if($(domDiv[i]).data('id')===userArr[j]){
                        $(domDiv[i]).parent().remove();
                    }
                    if(userArr[j]===__this.data.sigh_user_id){
                        __this.data.sigh_user_id = null;
                    }
                }
            }
        });

        //saving follower
        this.el.on('click','#saveFollower',()=>{
            let o={};
            let domSpan=this.el.find('#selected').find('span');
            for(let i=0;i<domSpan.length;i++){
                o[$(domSpan[i]).data('id')]=$(domSpan[i]).text();
            }
            
        })
        this.el.on('click','[name="addUser"]',function(){
            __this.data.sigh_user_id=this.value;
            // __this.el.find('#subAdder').removeAttr('disabled');
        });
        this.el.on('click','#subAdder',function(){
            let o={};
            o.sigh_type=__this.el.find('[name="addHandlerType"]:checked').val();
            o.sigh_user_id=__this.data.sigh_user_id;
            if(o.sigh_user_id){
                PMAPI.sendToParent({
                    type: PMENUM.close_dialog,
                    key:__this.data.key,
                    data:o
                })
            }else{
                msgBox.alert("请选择一名加签人员");
            }

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
