import '../../assets/scss/main.scss';
import {HTTP} from '../../lib/http';
import Mediator from '../../lib/mediator';
import {workflowService} from '../../services/workflow/workflow.service';
import TreeView from  '../../components/util/tree/tree';
import WorkflowAddFollow from '../../components/workflow/workflow-addFollow/workflow-addFollow';

//请求部门员工信息，加载树
let tree=[];
let staff=[];
function recursion(arr,slnds,pubInfo){
    if(slnds.nodes.length!==0){
        for(var j in arr){
            slnds.nodes.forEach(child=>{
                if(j==child.id){
                    Mediator.publish(`workflow:${pubInfo}`, arr[j]);
                    recursion(arr,child,pubInfo)
                }
            });
        }
    }
}
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
            console.log(selectedNode);
            if(event==='select'){
                for(var k in staff){
                    if(k==selectedNode.id){
                        Mediator.publish('workflow:checkDept', staff[k]);
                        // recursion(staff,selectedNode,'checkDept');
                    }
                }
            }else{
                for(var k in staff){
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

function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}


(async function () {
    return workflowService.getWorkflowInfo({url: '/get_all_users/'});
})().then(users => {
    let nameArr=[];
    let dept=[];
    for(var i in focus){
        nameArr.push(users.rows[focus[i]].name);
        dept.push(users.rows[focus[i]].department);
    }
    console.log(nameArr);
    console.log(_.uniq(dept));
})

let focus=location.search.slice(1).split('&')[0].split(',');
let key=GetQueryString('key');
WorkflowAddFollow.showAdd({key:key});
