import '../../assets/scss/main.scss';
import '../../assets/scss/workflow/workflow-base.scss'
import {HTTP} from '../../lib/http';
import Mediator from '../../lib/mediator';
import {workflowService} from '../../services/workflow/workflow.service';
import WorkflowAddFollow from '../../components/workflow/workflow-addFollow/workflow-addFollow/workflow-addFollow';
import TreeView from "../../components/util/tree/tree";

//请求部门员工信息，加载树
let tree=[];
let staff=[];
function recursion(arr,slnds,pubInfo){
    if(slnds.nodes.length!==0){
        for(let j in arr){
            slnds.nodes.forEach(child=>{
                if(j==child.id){
                    Mediator.publish(`workflow:${pubInfo}`, arr[j]);
                    recursion(arr,child,pubInfo)
                }
            });
        }
    }
}
let focus=location.search.slice(1).split('&')[0].split(',');

if(focus.length>=1&&focus[0].indexOf('key')===-1){
    let dept=[],idArr=[];
    (async function () {
        return workflowService.getWorkflowInfo({url: '/get_all_users/'});
    })().then(users => {
        for(let i in focus){
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
                            for(let k in staff){
                                if(k==item.id){
                                    let o={};
                                    for(let j in idArr){
                                        o[idArr[j]]=staff[k][idArr[j]];
                                    }
                                    Mediator.publish('workflow:checkDeptAlready', o);
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
            let treeComp2 = new TreeView(tree,{
                callback: function (event,selectedNode) {
                    if(event==='select'){
                        for(let k in staff){
                            if(k==selectedNode.id){
                                Mediator.publish('workflow:checkDept', staff[k]);
                                // recursion(staff,selectedNode,'checkDept');
                            }
                        }
                    }else{
                        for(let k in staff){
                            if(k==selectedNode.id){
                                Mediator.publish('workflow:unCheckDept', staff[k]);
                                // recursion(staff,selectedNode,'unCheckDept');
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
        Mediator.publish('workflow:checkDeptAlready',0);
        function recur(data) {
            for (let item of data){
                item.nodes=item.children;
                if(item.children.length!==0){
                    recur(item.children);
                }
            }
        }
        recur(tree);
        let treeComp2 = new TreeView(tree,{
            callback: function (event,selectedNode) {
                if(event==='select'){
                    for(let k in staff){
                        if(k==selectedNode.id){
                            Mediator.publish('workflow:checkDept', staff[k]);
                            // recursion(staff,selectedNode,'checkDept');
                        }
                    }
                }else{
                    for(let k in staff){
                        if(k==selectedNode.id){
                            Mediator.publish('workflow:unCheckDept', staff[k]);
                            // recursion(staff,selectedNode,'unCheckDept');
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

Mediator.subscribe('workflow:addusers', (res) => {
	let arr=res.users;
	let defaultFocus=[];
	for (let key in res.defaultFocus){
		defaultFocus.push(key);
	}
    if(!arr||arr.length<1)return;
    let dept=[],idArr=[];
    (async function () {
        return workflowService.getWorkflowInfo({url: '/get_all_users/'});
    })().then(users => {
        for(let i in arr){
            idArr.push(users.rows[i].id);
            dept.push(users.rows[i].department);
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
                            for(let k in staff){
                                if(k==item.id){
                                    let o={};
                                    for(let j in idArr){
                                        o[idArr[j]]=staff[k][idArr[j]];
                                    }
                                    Mediator.publish('workflow:checkDept', o);
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
            let treeComp2 = new TreeView(tree,{
                callback: function (event,selectedNode) {
                    if(event==='select'){
                        for(let k in staff){
                            if(k==selectedNode.id){
                                Mediator.publish('workflow:checkDept', staff[k]);
                            }
                        }
                    }else{
                        for(let k in staff){
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
});
function GetQueryString(name)
{
    let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}

let key=GetQueryString('key');
WorkflowAddFollow.showAdd({key:key});