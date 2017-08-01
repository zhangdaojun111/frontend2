import Component from '../../../lib/component';
import template from './workflow-create.html';
import './workflow-create.scss';
import WorkFlowBtn from './workflow-btn/workflow-btn';
import WorkFlowTree from './workflow-tree/workflow-tree'

let config = {
    template: template,
    data: {

    },
    actions: {
       operate:function(){
            let oper = this.el.find('.J_operate'),
                del = this.el.find('.J_del'),
                operVal =  oper.val();
            if(operVal == '取消'){
               oper.val("编辑");
                del.hide();   
            }else{
                oper.val("取消");
                del.show();
            }
       },
       deloperate:function(arg){
            //向后台发送数据，删除该常用工作流,现在没有接口，只是在dom中删除这个
            arg.remove();
       }
    },
    afterRender: function() {
        console.log(this.data);
        this.data.rows.forEach((row)=>{
            this.append(new WorkFlowBtn(row), this.el.find('.J_workflow-content'));
        })
        this.append(new WorkFlowTree(), this.el.find('.J_select-container'));
        this.el.on('click','.J_operate',()=>{
            this.actions.operate();
        }).on('click','.J_del',(ev)=>{
            var target = ev.target;
            var parent = $(target).parent().parent().parent();
            this.actions.deloperate(parent);  
        })
    },
    beforeDestory: function(){
       
    }
}

class WorkFlowCreate extends Component{
    constructor (data){
        super(config,data);
    }

}

export default {
    loadData(data){
        let component = new WorkFlowCreate(data);
        let el = $('#workflow-create');
        component.render(el);
    }
};