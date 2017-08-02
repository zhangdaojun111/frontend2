import Component from '../../../lib/component';
import template from './workflow-create.html';
import './workflow-create.scss';
import WorkFlowBtn from './workflow-btn/workflow-btn';
import WorkFlowTree from './workflow-tree/workflow-tree';
import Mediator from '../../../lib/mediator';
import WorkFlow from '../workflow-drawflow/workflow';

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
       //向后台发送数据，删除该常用工作流,现在没有接口，只是在dom中删除这个
       deloperate:function(arg){   
            arg.remove();
       }
    },
    afterRender: function() {
        //添加常用工作流组件
        // this.data.favList=this.data[1].rows;
        console.log(this.data);

        this.data[1].rows.forEach((row)=>{
            this.append(new WorkFlowBtn(row), this.el.find('.J_workflow-content'));
        });
        //添加流程下来菜单
        this.append(new WorkFlowTree(this.data[0]), this.el.find('.J_select-container'));

        this.el.on('click','.J_operate',()=>{
            this.actions.operate();
        }).on('click','.J_del',(ev)=>{
            let target = ev.target;
            let parent = $(target).parent().parent().parent();
            this.actions.deloperate(parent);  
        })

        //订阅btn click

        //订阅 select list click
        Mediator.subscribe('workflow:getInfo', (msg)=> {
            console.log(msg);
            WorkFlow.show(this.data.data[0]);
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
    
    //获取常用工作流和下拉工作流名称
    loadData(data,flowData){
        let workFlowData = _.defaultsDeep({}, data, flowData);
        let component = new WorkFlowCreate(workFlowData);
        let el = $('#workflow-header');
        component.render(el);
    },
};