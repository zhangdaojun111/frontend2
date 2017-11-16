/*
 * Created by qmy on 2017/8/10.
 */
import '../../assets/scss/main.scss';
import {HTTP} from '../../lib/http';
import Mediator from '../../lib/mediator';
import {workflowService} from '../../services/workflow/workflow.service';
import TreeView from '../../components/util/tree/tree';
import WorkflowAddSigner from '../../components/workflow/workflow-addFollow/workflow-addSigner/workflow-addSigner';
import '../../assets/scss/workflow/workflow-base.scss';
import msgBox from '../../lib/msgbox';

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
    let treeComp3 = new TreeView(tree, {
        callback: function (event, selectedNode) {
            msgBox.showLoadingSelf();
            if (event === 'select') {
                for (let k in staff) {
                    if (k == selectedNode.id) {
                        Mediator.publish('workflow:checkAdder', staff[k]);
                        recursion(staff, selectedNode, 'checkAdder');
                    }
                }
            } else {
                for (let k in staff) {
                    if (k == selectedNode.id) {
                        Mediator.publish('workflow:unCheckAdder', staff[k]);
                        recursion(staff, selectedNode, 'unCheckAdder');
                    }
                }
            }
            setTimeout(() => {
                msgBox.hideLoadingSelf();
            },800);
        },
        treeType: 'MULTI_SELECT',
        isSearch: true,
        withButtons: true
    });
    treeComp3.render($('#addUser'));
});

function GetQueryString(name)
{
    let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}


let key=GetQueryString('key');
WorkflowAddSigner.showAddSigner({key:key});
