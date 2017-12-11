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
import {workflowService} from '../../../services/workflow/workflow.service';

let config = {
    template: template,
    data: {
        favList:[],
        tree:[],
        fav:[],
        favoDel:false, //常用工作流是否显示删除按钮
        boxshow:true, //是否隐藏常用工作流按钮
    },
    actions: {
        /**
         * 显示隐藏删除常用工作流按钮
         */
        operate:function(){
            let oper = this.el.find('.J_operate');
            let del = this.el.find('.J_del');
            if(this.data.favoDel){
                del.hide();
                oper.text("");
                oper.addClass("workflow-icon-edit");
                this.data.favoDel = false;
            }else{
                oper.text("取消");
                oper.removeClass("workflow-icon-edit");
                del.show();
                this.data.favoDel = true;
            }
        },
        /**
         * 删除常用工作流
         * @param temp 当前dom节点
         */
        delBtn:function(temp){
            let el = $(temp).find('.delFav');
            let id = el.attr('data-id');
            for(let i=0;i<this.data.fav.rows.length;i++){
                if(this.data.fav.rows[i].id == id){
                    this.data.fav.rows.splice(i,1);
                }
            }
            let parents = el.parents('div')[0];
            parents.remove();
            this.actions.init();
        },
        /**
         * 初始化添加常用工作流按钮
         * @returns {boolean}
         */
        init(){
            $('#addFav').hide();
            this.data.favList=this.data.fav.rows;
            if(this.data.id!==undefined){
                let flag=true;
                for (let {id} of this.data.favList) {
                    if(parseInt(this.data.id)===id){
                        return flag=false;
                    }
                    flag=true;
                }
                if(!this.data.boxshow){
                    flag?$('#addFav').show():$('#addFav').hide();
                }
            }
        },
        /**
         * 添加常用工作流按钮
         */
        addFav(){
	        workflowService.addWorkflowFavorite({'id': this.data.id})
            let len = this.data.fav.rows.length;
            for(let i = 0;i<this.data.tree.data.length;i++){
                for(let j = 0;j<this.data.tree.data[i].children.length;j++){
                    if(this.data.tree.data[i].children[j].id == this.data.id){
                        this.data.fav.rows[len] = {
                            id : this.data.tree.data[i].children[j].id,
                            wf_form_id : this.data.tree.data[i].children[j].form_id,
                            wf_name : this.data.tree.data[i].children[j].label,
                            wf_table_id : this.data.tree.data[i].children[j].table_id
                        };
                    }
                }
            }
            this.el.find('.J_workflow-content').children().remove();
	        let actions={
		        chooseCb(msg){
			        this.events.chooseCb(msg);
		        }
	        }
            this.data.fav.rows.forEach((row)=>{
	            this.append(new WorkFlowBtn({data:row,events:actions}), this.el.find('.J_workflow-content'));
            });
            this.actions.init();
        },
        /**
         * 点击关闭的时候显示常用工作流
         */
        contentClose(){
            this.data.boxshow = true;
            this.actions.init();
            this.data.favoDel = true;
            this.actions.operate();
        },
	    chooseCb(msg){
		    this.data.id=msg.id;
		    this.data.boxshow = false;
		    this.actions.init();
		    this.el.find("#workflow-box").hide();
		    this.events.contentShow();
		    this.data.workTree.actions.chooseCb(msg);
	    }
    },
    binds:[
        {
            event:'click',
            selector: '.J_operate',
            callback: function(){
                this.actions.operate();
            }
        },
        {
            event:'click',
            selector:'.J_del',
            callback:function(temp = this){
                this.actions.delBtn(temp);
            }
        },
        {
            event:'click',
            selector:'#addFav',
            callback:function(){
                this.actions.addFav();
            }
        }
    ],
    afterRender: function() {
        this.data.favoDel = false;
        this.actions.init();
        this.data.boxshow = true;
        //添加流程下来菜单
	    let _this=this;
	    let actions={
		    chooseCb(msg){
			    _this.events.chooseCb(msg);
		    }
	    }
	    this.data.workTree=new WorkFlowTree({data:this.data.tree,events:actions})
	    this.append(this.data.workTree, this.el.find('.J_select-container'));
        //添加常用工作流组件
        this.data.fav.rows.forEach((row)=>{
            this.append(new WorkFlowBtn({data:row,events:actions}), this.el.find('.J_workflow-content'));
        });
        //订阅 select list click
        Mediator.subscribe('workflow:gotWorkflowInfo', (msg)=> {
            WorkFlow.show(msg.data[0],'#drawflow');
        });
    },
    beforeDestory: function(){
       
    }
};

let WorkFlowCreate = Component.extend(config);
export default WorkFlowCreate