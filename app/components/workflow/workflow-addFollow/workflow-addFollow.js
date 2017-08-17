import Component from '../../../lib/component';
import template from './workflow-addFollow.html';
import './workflow-addFollow.scss';
import Mediator from '../../../lib/mediator';
import SelectStaff from './select-staff/select-staff';
import SelectStaffNoDel from './select-staff-no-del/select-staff-no-del';
import SelectedStaff from './selected-staff/selected-staff';
import SelectedStaffNoDel from './selected-staff-no-del/selected-staff-no-del';
import {PMAPI,PMENUM} from '../../../lib/postmsg';
import selTemplate from './select-template';

let config={
    template: template,
    data:{},
    action:{

    },
    afterRender(){
        const _this=this;
        this.el.find('#staffMulti').html('');
        Mediator.subscribe('workflow:idArr', (res)=> {
            this.data.idArr=res;
        });
        //部门选择
        Mediator.subscribe('workflow:checkDept', (res)=> {
            $.each(res,(i,val)=>{
                val.id=i;
                this.append(new SelectStaff(val), this.el.find('#staffMulti'));
            });
        });
        Mediator.subscribe('workflow:checkDeptAlready', (res)=> {
            $.each(res,(i,val)=>{
                val.id=i;
                for(var a in this.data.idArr){
                    if(val.id==this.data.idArr[a]){
                        this.append(new SelectStaffNoDel(val), this.el.find('#staffMulti'));
                    }
                }
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
            let domSpan=this.el.find('#selected').find('span.removeble');
            for(var i=0;i<domSpan.length;i++){
                for(var j=0;j<userArr.length;j++){
                    if($(domSpan[i]).data('id')===userArr[j]){
                        $(domSpan[i]).parent().remove();
                    }
                }
            }
        });

        //注册SelectedStaff组件
        Mediator.subscribe('workflow:pubCheck', (res)=> {
            this.append(new SelectedStaff(res), this.el.find('#selected'));
        });

        Mediator.subscribe('workflow:pubCheckNoDel', (res)=> {
            this.append(new SelectedStaffNoDel(res), this.el.find('#selected'));
        });

        //注册SelectedStaff组件
        Mediator.subscribe('workflow:pubCheckSingle', (res)=> {
            this.append(new SelectedStaff(res), this.el.find('#selected'));
        });
        //删除SelectedStaff组件
        Mediator.subscribe('workflow:pubUncheckSingle', (res)=> {
            let domSpan=this.el.find('#selected').find('span.removeble');
            for(var i=0;i<domSpan.length;i++){
                if($(domSpan[i]).data('id')===res){
                    $(domSpan[i]).parent().remove();
                }
            }
        });

        //全选，反选btn
        this.el.on('click','#allSelector',function(){
            var inputs=_this.el.find('#staffMulti').find('.remove');
            if($(this).prop('checked')){
                inputs.each(function(i,item){
                    $(item).addClass('checked');
                    Mediator.publish('workflow:pubCheckSingle',{
                        id:$(item).attr('value'),
                        name:$(item).attr('name')
                    });
                })
            }else{
                inputs.each(function(i,item){
                    $(item).removeClass("checked");
                    Mediator.publish('workflow:pubUncheckSingle',$(item).attr('value'));
                })
            }
        });

        //saving follower
        this.el.on('click','#saveFollower',()=>{
            let o={};
            let domSpan=this.el.find('#selected').find('span');
            for(var i=0;i<domSpan.length;i++){
                o[$(domSpan[i]).data('id')]=$(domSpan[i]).text();
            }
            PMAPI.sendToParent({
                type: PMENUM.close_dialog,
                key:this.data.key,
                data:o
            })
        })
    }
};
class WorkflowAddFollow extends Component{
    constructor (data){
        super(config,data);
    }
}



export default {
    showAdd(data) {
        let component = new WorkflowAddFollow(data);
        let el = $('#add-follow');
        component.render(el);
    }
};