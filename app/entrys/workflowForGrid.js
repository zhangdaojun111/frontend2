
import '../assets/scss/main.scss';
import 'jquery-ui/ui/widgets/button.js';
import 'jquery-ui/ui/widgets/dialog.js';

import {
    HTTP
} from '../lib/http';
import Mediator from '../lib/mediator';
import {
    workflowService
} from '../services/workflow/workflow.service';
import WorkFlowCreate from '../components/workflow/workflow-create/workflow-create';
import WorkflowRecord from '../components/workflow/approval-record/approval-record';
import WorkFlowForm from '../components/workflow/workflow-form/workflow-form';
import WorkFlowGrid from '../components/workflow/workflow-grid/workflow-grid';
import ApprovalHeader from '../components/workflow/approval-header/approval-header';
import ApprovalWorkflow from '../components/workflow/approval-workflow/approval-workflow';
import WorkflowAddFollow from '../components/workflow/workflow-addFollow/workflow-addFollow/workflow-addFollow';
import WorkflowAddSigner from '../components/workflow/workflow-addFollow/workflow-addSigner/workflow-addSigner';
import FormEntrys from './form';
import TreeView from '../components/util/tree/tree';
import msgBox from '../lib/msgbox';
import WorkFlow from '../components/workflow/workflow-drawflow/workflow';
import Grid from '../components/dataGrid/data-table-page/data-table-page';
import {PMAPI,PMENUM} from '../lib/postmsg';
import jsplumb from 'jsplumb';

let obj={};
const workflowForGrid={
    init(para){
        obj.record_id=para.record_id;
        obj.table_id=para.table_id;
        obj.form_id=para.form_id;
        obj.flow_id=para.flow_id;
        ApprovalWorkflow.create(para.el);
        this.create();
    },
    create(){
        WorkflowAddFollow.showAdd();
        WorkFlowForm.showForm();
        
        let nameArr=[],focus=[],is_view,tree=[],staff=[];
        is_view=obj.btnType==='view'?1:0;
        //订阅form data
        Mediator.subscribe('workFlow:record_info', (res) => {
            ApprovalHeader.showheader(res.record_info);
            WorkflowRecord.showRecord(res.record_info);
            if(res.record_info.current_node!=window.config.name){
                $('#approval-workflow').find('.for-hide').hide();
            };
            if(res.record_info.status==="已驳回到发起人"&&res.record_info.start_handler===window.config.name){
                $('#approval-workflow').find('.for-hide').hide();
                $('#approval-workflow').find('#re-app').show();
            };
            //审批工作流
            (async function () {
                return workflowService.getWorkflowInfo({
                    url: '/get_workflow_info/',
                    data: {
                        flow_id: obj.flow_id,
                        record_id: obj.record_id
                    }
                });
            })().then(result => {
                Mediator.publish('workflow:getImgInfo', result);
                Mediator.publish('workflow:gotWorkflowInfo', result);
                let a=result.data[0].updateuser2focususer;
                for(var i in a){
                    for(var j in a[i]){
                        focus.push(a[i][j]);
                    }
                }
                if(focus.length>0){
                    let dept=[];
                    (async function () {
                        return workflowService.getWorkflowInfo({url: '/get_all_users/'});
                    })().then(users => {
                        let idArr=[];
                        for(var i in focus){
                            idArr.push(users.rows[focus[i]].id);
                            dept.push(users.rows[focus[i]].department);
                        }
                        Mediator.publish('workflow:idArr', idArr);
                        dept=_.uniq(dept);
                    }).then(()=>{
                        (async function () {
                            return workflowService.getStuffInfo({url: '/get_department_tree/'});
                        })().then(res=>{
                            tree=res.data.department_tree;
                            staff=res.data.department2user;
                            function recur(data) {
                                for (let item of data){
                                    item.nodes=item.children;
                                    for(let i in dept){
                                        if(item.text.indexOf(dept[i])!==-1){
                                            item.state={};
                                            item.state.checked=true;
                                            item.state.selected=true;
                                            for(var k in staff){
                                                if(k==item.id){
                                                    Mediator.publish('workflow:checkDeptAlready', staff[k]);
                                                }
                                            }
                                        }
                                    }
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
                    })
                }else{
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
                }
            
                (async function () {
                    return workflowService.getWorkflowInfo({url: '/get_all_users/'});
                })().then(users => {
                    for(var i in focus){
                        nameArr.push(`<span class="selectSpan">${users.rows[focus[i]].name}</span>`);
                    }
                    $('#add-home #addFollowerList').html(nameArr);
                    if(nameArr.indexOf(window.config.name)>-1&&window.config.name!=res.record_info.current_node){
                        $('#approval-workflow').find('.for-hide').hide();
                        $('#approval-workflow').find('#re-app').hide();
                    };
                });
            });
            
        });
        
        Mediator.subscribe("workflow:loaded",(e)=>{
            if(e===1){
                if(obj.is_focus==1||obj.btnType==='view'){
                    $('#approval-workflow').find('.for-hide').hide();
                }
            }
        });
        
        FormEntrys.createForm({
            el: '#place-form',
            form_id: obj.form_id,
            record_id: obj.record_id,
            is_view: is_view,
            from_approve: 1,
            from_focus: 0,
            btnType:'none',
            table_id: obj.table_id
        });
        
        let focusArr=[];
        Mediator.subscribe('workflow:focus-users', (res)=> {
            focusArr=res;
        });
    }
};

export default workflowForGrid ;