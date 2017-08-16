import template from './select-template.html';
import Mediator from '../../../lib/mediator';
import TreeView from  '../../../components/util/tree/tree';

let selTemplate = {
    template: template.replace(/\"/g, '\''),
    data: {
    },
    actions:{

    },
    firstAfterRender:function(){
        
        
    },
    afterRender(){
        let tree=JSON.parse(localStorage.getItem('treeNodes'));

        console.log(tree);
            var treeComp2 = new TreeView(tree,{
                callback: function (event,selectedNode) {
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
    }
}
export default selTemplate;