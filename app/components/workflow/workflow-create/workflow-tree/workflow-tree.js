import Component from "../../../../lib/component";
import template from './workflow-tree.html';
import './workflow-tree.scss';

import Mediator from '../../../../lib/mediator';

let config = {
    template: template,
    data:{
        label:"adssas",
        list:[
            {"flow_icon": "", "id": 1,"label": "内置流程","children":[{   "name_py": "xxtssqlc","table_id": "1586_CcrzabMYLePTkAGDqpTgo2","id": 1,"form_id": 2,"label": "消息推送申请流程"},{   "name_py": "xxtssqlc","table_id": "1586_CcrzabMYLePTkAGDqpTgo2","id": 1,"form_id": 2,"label": "消息推送申请流程26"}]},
            {"flow_icon": "", "id": 1,"label": "内置流程2","children":[{   "name_py": "xxtssqlc","table_id": "1586_CcrzabMYLePTkAGDqpTgo2","id": 1,"form_id": 2,"label": "消息推送申请流程"},{   "name_py": "xxtssqlc","table_id": "1586_CcrzabMYLePTkAGDqpTgo2","id": 1,"form_id": 2,"label": "消息推送申请流程3"}]},
            {"flow_icon": "", "id": 1,"label": "内置流程2","children":[{   "name_py": "xxtssqlc","table_id": "1586_CcrzabMYLePTkAGDqpTgo2","id": 1,"form_id": 2,"label": "消息推送申请流程"},{   "name_py": "xxtssqlc","table_id": "1586_CcrzabMYLePTkAGDqpTgo2","id": 1,"form_id": 2,"label": "23"}]},
            {"flow_icon": "", "id": 1,"label": "内置流程2","children":[{   "name_py": "xxtssqlc","table_id": "1586_CcrzabMYLePTkAGDqpTgo2","id": 1,"form_id": 2,"label": "消息推送申请流程"},{   "name_py": "xxtssqlc","table_id": "1586_CcrzabMYLePTkAGDqpTgo2","id": 1,"form_id": 2,"label": "申4"}]},
            {"flow_icon": "", "id": 1,"label": "内置流程2","children":[{   "name_py": "xxtssqlc","table_id": "1586_CcrzabMYLePTkAGDqpTgo2","id": 1,"form_id": 2,"label": "消息推送申请流程"},{   "name_py": "xxtssqlc","table_id": "1586_CcrzabMYLePTkAGDqpTgo2","id": 1,"form_id": 2,"label": "流程5"}]},
            {"flow_icon": "", "id": 1,"label": "内置流程2","children":[{   "name_py": "xxtssqlc","table_id": "1586_CcrzabMYLePTkAGDqpTgo2","id": 1,"form_id": 2,"label": "消息推送申请流程"},{   "name_py": "xxtssqlc","table_id": "1586_CcrzabMYLePTkAGDqpTgo2","id": 1,"form_id": 2,"label": "消程63"}]},
            {"flow_icon": "", "id": 1,"label": "内置流程2","children":[{   "name_py": "xxtssqlc","table_id": "1586_CcrzabMYLePTkAGDqpTgo2","id": 1,"form_id": 2,"label": "消息推送申请流程"},{   "name_py": "xxtssqlc","table_id": "1586_CcrzabMYLePTkAGDqpTgo2","id": 1,"form_id": 2,"label": "程78"}]},
        ]
    },
    actions: {
        toogleTree:function(){
           
            let tree = this.el.find(".J_tree");
            let tip = tree.hasClass('show');
            if(tip){
                tree.addClass('hide');
                tree.removeClass('show');
            }else{
                tree.addClass('show');
                tree.removeClass('hide');
            }
        },
        toogletip:function(e){
            let childList = $(e.target).siblings(".child-list");
            let root = this.el.find(childList);
            let tip = root.hasClass('child-hide');
            if(tip){
                root.removeClass('child-hide');
            }else{
                root.addClass('child-hide');
            }
        },
        clickChild:function(e){
            let childValue = $(e.target).text();
            let rootNode = this.el.find('.J_select-Workflow');
            let tree = this.el.find(".J_tree");
            rootNode.text(childValue);
            tree.addClass('hide');
            tree.removeClass('show');
            console.log("1111")
        },
        changeTree:function(){
            let keyword = $('.J_search').val();
            let keyList = this.data.list;
            let arrList = [];
           
            keyList.forEach((item,ind)=>{
               item.children.forEach((item,index)=>{
                   if(item.label.indexOf(keyword)!=-1){
                       arrList.push(keyList[ind]);
                       console.log(index);
                   }
                //    console.log(item.label+"..."+ind);
               })
            })
            console.log(arrList);
        }
    },

    afterRender: function() {
    
       this.el.on('click','.J_tip',()=>{
           this.actions.toogleTree();
       });
       this.el.on('click','.J_root',(event)=>{
           this.actions.toogletip(event);
       });
       this.el.on('click','.J_child-item',(event)=>{
            this.actions.clickChild(event);
       })
       this.el.bind("input propertychange",'.J_search',(event)=>{
           console.log(465);
            this.actions.changeTree();
       })
    }  
}

class WorkFlowTree extends Component {
    constructor(data){
        super(config);
        // console.log(config)
    }
}

export default WorkFlowTree;