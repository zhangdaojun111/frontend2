/**
 *@author qiumaoyun
 *添加关注人page body
 */
import Component from '../../../../lib/component';
import template from './workflow-addFollow.html';
import './workflow-addFollow.scss';
import Mediator from '../../../../lib/mediator';
import SelectStaff from '../select-staff/select-staff';
import SelectStaffNoDel from '../select-staff-no-del/select-staff-no-del';
import SelectedStaff from '../selected-staff/selected-staff';
import SelectedStaffNoDel from '../selected-staff-no-del/selected-staff-no-del';
import {PMAPI,PMENUM} from '../../../../lib/postmsg';
import msgBox from '../../../../lib/msgbox';

let config={
    template: template,
    data:{
        total: 0,
        flag:true
    },
    action:{
        search(){
            let keyword = this.el.find(".follower-search").val();
            let node = this.el.find('#staffMulti').find('.search-check-item');
            let par = this.el.find("#staffMulti").children();
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
        addtotal(num){
            this.el.find('.total').text(num);
        }
    },
    afterRender(){
        this.showLoading();
        PMAPI.getIframeParams(this.data.key).then((res) => {
            Mediator.publish('workflow:addusers', res.data.users);
        })
        this.el.on("input propertychange",".follower-search",()=>{
            this.action.search();
        })
        const _this=this;
        this.check = {};
        this.el.find('#staffMulti').html('');
        Mediator.subscribe('workflow:idArr', (res)=> {
            this.data.idArr=res;
        });
        //部门选择
        Mediator.subscribe('workflow:checkDept', (res)=> {
           // msgBox.showLoadingSelf();
            let arr = [];
            let checked=this.el.find('#staffMulti .search-check-row');
            let len = checked.length;
            for(let i =0;i<len; i++){
                arr.push($(checked[i]).data('id'))
            }
            $.each(res,(i,val)=>{
                if(val){
                    val.id=i;
                    if(checked.length===0){
                        this.append(new SelectStaff(val), this.el.find('#staffMulti'));
                    }else if(arr.indexOf(i)===-1){
                        this.append(new SelectStaff(val), this.el.find('#staffMulti'));
                    }
                }
            });
            // setTimeout(() => {
            //     msgBox.hideLoadingSelf();
            // },800);

        });
        Mediator.subscribe('workflow:checkDeptAlready', (res)=> {
            if(res){
                let arr = [];
                let checked=this.el.find('#staffMulti .flexNoDel');
                let len = checked.length;
                for(let i =0;i<len; i++){
                    arr.push($(checked[i]).data('id'));
                }
                $.each(res,(i,val)=>{
                    if(val){
                        val.id=i;
                        if(checked.length===0){
                            this.append(new SelectStaffNoDel(val), this.el.find('#staffMulti'));
                        }else if(arr.indexOf(i)===-1){
                            this.append(new SelectStaffNoDel(val), this.el.find('#staffMulti'));
                        }
                    }
                });
            }
            if(this.data.flag===true){
                setTimeout(() => {
                    this.hideLoading();
                },800);
                this.data.flag=false;
            }
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
                }
            }
            let domSpan=this.el.find('#selected').find('span.removeble');
            for(let i=0;i<domSpan.length;i++){
                for(let j=0;j<userArr.length;j++){
                    if($(domSpan[i]).data('id')===userArr[j]){
                        this.data.total--;
                        $(domSpan[i]).parent().remove();
                    }
                }
            }
            this.action.addtotal(this.data.total);
        });
        //注册SelectedStaff组件
        Mediator.subscribe('workflow:pubCheck', (res)=> {
            this.append(new SelectedStaff(res), this.el.find('#selected'));
            this.data.total++;
            this.action.addtotal(this.data.total);
        });
        Mediator.subscribe('workflow:pubCheckNoDel', (res)=> {
            this.append(new SelectedStaffNoDel(res), this.el.find('#selected'));
            this.data.total++;
            this.action.addtotal(this.data.total);
        });
        //注册SelectedStaff组件
        Mediator.subscribe('workflow:pubCheckSingle', (res)=> {
            this.append(new SelectedStaff(res), this.el.find('#selected'));
            this.data.total++;
            this.action.addtotal(this.data.total);
        });
        //删除SelectedStaff组件
        Mediator.subscribe('workflow:pubUncheckSingle', (res)=> {
            let domSpan=this.el.find('#selected').find('span.removeble');
            for(let i=0;i<domSpan.length;i++){
                if($(domSpan[i]).data('id')===res){
                    $(domSpan[i]).parent().remove();
                    this.data.total--;
                }
            }
            this.action.addtotal(this.data.total);
        });
        //全选，反选btn
        this.el.on('click','#allSelector',function(){
            let inputs=_this.el.find('#staffMulti').find('.remove');
            if($(this).prop('checked')){
                for (let i = 0;i<inputs.length;i++){
                    if($(inputs[i]).hasClass('checked')){
                        inputs.splice(i,1);
                        i--;
                    }
                }
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
        });
    },

    beforeDestory: function () {
        Mediator.removeAll('workflow:idArr');
        Mediator.removeAll('workflow:checkDept');
        Mediator.removeAll('workflow:checkDeptAlready');
        Mediator.removeAll('workflow:unCheckDept');
        Mediator.removeAll('workflow:pubCheck');
        Mediator.removeAll('workflow:pubCheckNoDel');
        Mediator.removeAll('workflow:pubCheckSingle');
        Mediator.removeAll('workflow:pubUncheckSingle');
    }
};
class WorkflowAddFollow extends Component{
    // constructor (data){
    //     super(config,data);
    // }

    constructor(data,newConfig){
        super($.extend(true,{},config,newConfig,{data:data||{}}));
    }
}
export default {
    showAdd(data) {
        let component = new WorkflowAddFollow(data);
        let el = $('#add-follow');
        component.render(el);
    }
};