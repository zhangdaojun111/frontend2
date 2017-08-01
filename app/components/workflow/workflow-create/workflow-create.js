import Component from '../../../lib/component';
import template from './workflow-create.html';
import './workflow-create.scss';
import WorkFlowBtn from './workflow-btn/workflow-btn';
import WorkFlowTree from './workflow-tree/workflow-tree'

let config = {
    template: template,
    data: {
        error:"",
        success:1,
        rows:[
            {wf_name:"产品要素管理流程1",id:3},
            {wf_name:"产品要素管理流程3",id:4},
            {wf_name:"产品要素管理流程4",id:5},
            {wf_name:"产品要素管理流程5",id:6},
            {wf_name:"产品要素管理流程6",id:7}
        ],
        list:[
            {"flow_icon": "", "id": 1,"label": "内置流程","children":[{   "name_py": "xxtssqlc","table_id": "1586_CcrzabMYLePTkAGDqpTgo2","id": 1,"form_id": 2,"label": "消息推送申请流程"},{   "name_py": "xxtssqlc","table_id": "1586_CcrzabMYLePTkAGDqpTgo2","id": 1,"form_id": 2,"label": "消息推送申请流程"}]}
        ]
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
    constructor (res,data){
        super(config);
    }

}

export default WorkFlowCreate;