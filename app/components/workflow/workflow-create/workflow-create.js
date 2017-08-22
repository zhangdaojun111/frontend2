/**
 * @author hufei
 * 创建工作流初始页面
 */
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
        favList:[]
    },
    actions: {
        operate:function(){
            let oper = this.el.find('.J_operate');
            let del = this.el.find('.J_del');
            if(this.favoDel){
                del.hide();
                oper.text("");
                 oper.addClass("workflow-icon");
                this.favoDel = false;
            }else{
                oper.text("取消");
                oper.removeClass("workflow-icon");
                del.show();
                this.favoDel = true;
            }
        },
        //向后台发送数据，删除该常用工作流,现在没有接口，只是在dom中删除这个
        delBtn:function(e){
            let el = $(e.target);
            let id = el.attr('data-id');
            for(let i=0;i<this.data[1].rows.length;i++){
                if(this.data[1].rows[i].id == id){
                    this.data[1].rows.splice(i,i+1);
                }
            }
            let target = e.target;
            let parent = $(target).parent().parent().parent();
            parent.remove();
            this.actions.init();
        },
        init(){
            $('#addFav').hide();
            this.data.favList=this.data[1].rows;
            if(this.data.id!==undefined){
                let flag=true;
                for (let {id} of this.data.favList) {
                    if(parseInt(this.data.id)===id){
                        return flag=false;
                    }
                    flag=true;
                }
                flag?$('#addFav').show():$('#addFav').hide();
            }
        }
    },
    afterRender: function() {
        this.favoDel = false;
        this.actions.init();
        //添加流程下来菜单
        this.append(new WorkFlowTree(this.data[0]), this.el.find('.J_select-container'));
        //添加常用工作流组件
        this.data[1].rows.forEach((row)=>{
            this.append(new WorkFlowBtn(row), this.el.find('.J_workflow-content'));
        });
        this.el.on('click','.J_operate',()=>{
            this.actions.operate();
        });
        this.el.on('click','.J_del',(e)=>{
            this.actions.delBtn(e);
        });
        //addFav
        this.el.on('click','#addFav',(e)=>{
            Mediator.publish('workflow:addFav', this.data.id);
            for(let i = 0;i<this.data[0].data.length;i++){
                for(let j = 0;j<this.data[0].data[i].children.length;j++){
                    if(this.data[0].data[i].children[j].id == this.data.id){
                        this.data[1].rows.push(this.data[0].data[i].children[j]);
                    };
                }
            }
            this.actions.init();
            $('#addFav').hide();
        });

        //订阅btn click
        Mediator.subscribe('workflow:choose', (msg)=> {
            this.data.id=msg.id;
            this.actions.init();
            this.el.find("#workflow-box").hide();
            $("#workflow-content").show();
        })
        //订阅 select list click
        Mediator.subscribe('workflow:gotWorkflowInfo', (msg)=> {
            WorkFlow.show(msg.data[0],'#drawflow');
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
    loadData(data){
        let component = new WorkFlowCreate(data);
        let el = $('#workflow-header');
        component.render(el);
    },
};