import Component from "../../../../lib/component";
import template from './workflow-tree.html';
import './workflow-tree.scss';

import Mediator from '../../../../lib/mediator';

let config = {
    template: template,
    data:{
        treeArr:[],
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
        },
        //输入搜索改变
        changeTree:function(){
            let keyword = $('.J_search').val();
        }
    },

    afterRender: function() {
       this.data.treeArr=this.data.data;
      
       this.data.treeArr.forEach(function(el,index) {
        console.log(el)   
       });
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
           
            this.actions.changeTree();
       })
    }  
}

class WorkFlowTree extends Component {
    constructor(data){
        super(config,data);
    }
}

export default WorkFlowTree;