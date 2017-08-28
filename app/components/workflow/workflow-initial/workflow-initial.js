/**
 *@author qiumaoyun
 *发起工作流page body
 */
import Component from '../../../lib/component';
import template from './workflow-initial.html';
import './workflow-initial.scss';
import {HTTP} from '../../../lib/http';
import '../../../assets/scss/workflow/workflow-base.scss';
import Mediator from '../../../lib/mediator';
import WorkflowAddFollow from '../workflow-addFollow/workflow-addFollow/workflow-addFollow';
import WorkFlowCreate from '../workflow-create/workflow-create';
import TreeView from  '../../util/tree/tree';
import {workflowService} from '../../../services/workflow/workflow.service';

let config={
    template: template,
    data:{
        user:[]
    },
    actions:{
        /*
        ***部门，人员树的initial与render
        */
        getTree(){
            let tree=[],staff=[];
            (async function () {
                return workflowService.getStuffInfo({url: '/get_department_tree/'});
            })().then(res=>{
                tree=res.data.department_tree;
                staff=res.data.department2user;
                function recur(data) {
                    for (let item of data){
                        item.nodes=item.children;
                        if(item.children.length!==0){
                            recur(item.children);
                        }
                    }
                }
                recur(tree);
                var treeComp2 = new TreeView(tree,{
                    callback: function (event,selectedNode) {
                        if(event==='select'){
                            for(var k in staff){
                                if(k==selectedNode.id){
                                    Mediator.publish('workflow:checkDept', staff[k]);
                                }
                            }
                        }else{
                            for(var k in staff){
                                if(k==selectedNode.id){
                                    Mediator.publish('workflow:unCheckDept', staff[k]);
                                }
                            }
                        }
                    },
                    treeType:'MULTI_SELECT',
                    isSearch: true,
                    withButtons:true
                    });
                treeComp2.render($('#treeMulti'));
            });
        },
        /*
        ***获取所有工作流与常用工作流
        */
        get_workflow_info(){
            let WorkFlowList=workflowService.getWorkfLow({}),
                FavWorkFlowList=workflowService.getWorkfLowFav({});
            Promise.all([WorkFlowList,FavWorkFlowList]).then(res=>{
                WorkFlowCreate.loadData(res);
            });
            HTTP.flush();
        }
    },
    afterRender(){
        this.actions.getTree();
        this.actions.get_workflow_info();
        this.el.on('click','#workflowClose',()=>{
            Mediator.publish("workflow:contentClose");
            this.el.find('.J_select-Workflow').text("选择或输入查找");
            this.el.find("#workflow-box").show();
            this.el.find('#workflow-content').hide();
        }),
        this.el.on('click','#singleFlow',(e)=>{
            let ev =$(e.target);
            ev.addClass("selected");
            this.el.find("#multiFlow").removeClass("selected");
            Mediator.publish('workflow:autoSaveOpen', 1);
            this.el.find('#workflow-form').show();
            this.el.find('#workflow-grid').hide();
        });
        this.el.on('click','#multiFlow',(e)=>{
            let ev =$(e.target);
            ev.addClass("selected");
            this.el.find("#singleFlow").removeClass("selected");
            Mediator.publish('workflow:autoSaveOpen', 0);
            this.el.find('#workflow-grid').show();
            this.el.find('#workflow-form').hide();
        });
        this.el.on('click','#submitWorkflow',()=>{
            let user=[];
            Mediator.subscribe('workflow:focus-users', (res)=> {
                this.data.user=res;
            })
            Mediator.publish('workflow:submit',this.data.user);
        });

    }
};
class WorkflowInitial extends Component{
    constructor (data){
        super(config,data);
    }
}

let component = new WorkflowInitial();
let el = $('#WorkflowInitial');
component.render(el);

// WorkFlowCatalog.showCatalog();