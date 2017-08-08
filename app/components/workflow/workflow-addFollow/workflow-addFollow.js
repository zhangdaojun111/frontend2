import Component from '../../../lib/component';
import template from './workflow-addFollow.html';
import './workflow-addFollow.scss';
import Mediator from '../../../lib/mediator';
import SelectStaff from './select-staff/select-staff';
import SelectedStaff from './selected-staff/selected-staff';

let config={
    template: template,
    data:{},
    action:{

    },
    afterRender(){
        const _this=this;
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

        //注册SelectedStaff组件
        Mediator.subscribe('workflow:pubCheck', (res)=> {
            this.append(new SelectedStaff(res), this.el.find('#selected'));
        });

        //注册SelectedStaff组件
        Mediator.subscribe('workflow:pubCheckSingle', (res)=> {
            this.append(new SelectedStaff(res), this.el.find('#selected'));
        });
        //删除SelectedStaff组件
        Mediator.subscribe('workflow:pubUncheckSingle', (res)=> {
            let domSpan=this.el.find('#selected').find('span');
            for(var i=0;i<domSpan.length;i++){
                if($(domSpan[i]).data('id')===res){
                    $(domSpan[i]).parent().remove();
                }
            }
        });

        //全选，反选btn
        this.el.on('click','#allSelector',function(){
            // var inputs=_this.el.find('#staffMulti').find('input');
            // console.log(inputs);
            // if($(this).prop('checked')){
            //     inputs.each(function(i,item){
            //         console.log(item);
            //         $(item).attr('checked',true);
            //     })
            // }else{
            //     inputs.each(function(i,item){
            //         $(item).removeAttr("checked");
            //     })
            // }
        });

        //saving follower
        this.el.on('click','#saveFollower',()=>{
            let nameArr=[],idArr=[];
            let domSpan=this.el.find('#selected').find('span');
            for(var i=0;i<domSpan.length;i++){
                idArr.push($(domSpan[i]).data('id'));
                nameArr.push($(domSpan[i]).text());
            }
            this.el.find('#follower-select').hide();
            this.el.find('#addFollowerList').text(nameArr);
            Mediator.publish('workflow:focus-users',idArr);
        })

        this.el.on('click','#addFollower',()=>{
            this.el.find('#follower-select').show();
        });
        this.el.on('click','.close',()=>{
            this.el.find('#follower-select').hide();
        });
    }
};
class WorkflowAddFollow extends Component{
    constructor (data){
        super(config,data);
    }
}

let component = new WorkflowAddFollow();
let el = $('#add-follow');
component.render(el);