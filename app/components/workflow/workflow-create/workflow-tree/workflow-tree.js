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
        //隐藏显示下拉菜单
        toogleTree:function(e){
            let tree = this.el.find(".J_tree");
            let tip = tree.hasClass('show');
            if(tip){
                tree.addClass('hide');
                tree.removeClass('show');
            }else{
                tree.addClass('show');
                tree.removeClass('hide');
            }

            let len = this.el.find(".tree-list").children('li').length;
            for(let i = 0; i < len;i++){
                this.el.find('.tree-list li').eq(i).removeClass('hide xixi');
                let j = this.el.find('.tree-list li').eq(i).find('.child-list').children('.child-item').length;
                for(let a = 0;a < j;a++){
                   this.el.find('.tree-list li').eq(i).find('.child-list').children('.child-item').removeClass('hide xixi');
                }
            }
            this.el.find('.J_search').val("");
        },
        //点击孩子的根节点隐藏子节点
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
        //点击子节点
        clickChild:function(e){
            //get current clicked node info
            let {formid,tableid}=$(e.target)[0].dataset;
            console.log(formid,tableid);


            let childValue = $(e.target).text();
            let rootNode = this.el.find('.J_select-Workflow');
            let tree = this.el.find(".J_tree");
            rootNode.text(childValue);
            tree.addClass('hide');
            tree.removeClass('show');
        },
        //输入搜索改变下拉菜单
        changeTree:function(){
            let keyword = $('.J_search').val();
            var c;
            let arr = {}; 
            let li =  this.el.find('.tree-list li');

            let len = this.el.find(".tree-list").children('li').length;
            for(let i = 0; i < len;i++){
                li.eq(i).removeClass('hide xixi');
                let j = li.eq(i).find('.child-list').children('.child-item').length;
                for(let a = 0;a < j;a++){
                   li.eq(i).find('.child-list').children('.child-item').removeClass('hide xixi');
                }
            }
           
            this.data.treeArr.forEach((el,index)=> {
                let obj = new Array();
                el.children.forEach((al,num)=>{
                    obj.push(al.label);
                    arr[index] = obj; 
                })
               
            });

            for(let i in arr){
                c=i;
                let len = arr[i].length;
                for(let j = 0 ;j<len;j++){
                    if(keyword!=""){
                         if(arr[i][j].indexOf(keyword)!=-1){
                            li.eq(i).addClass('xixi');
                            li.eq(i).find(".root").addClass('xixi');
                            li.eq(i).find('.child-list .child-item').eq(j).addClass("xixi");
                        }else{
                        }
                    }
                }
            }

            for(let i = 0; i<c+1;i++){
                if(!li.eq(i).hasClass('xixi')){
                    li.eq(i).addClass("hide");                 
                }else{
                    let j = li.eq(i).find('.child-list').children('.child-item').length;
                    for(let a =0;a<j;a++){
                        if(!li.eq(i).find('.child-list .child-item').eq(a).hasClass('xixi')){
                            li.eq(i).find('.child-list .child-item').eq(a).addClass('hide');
                        }
                    }
                }
            }

            if(keyword.length ==0){
                let len = this.el.find(".tree-list").children('li').length;
                for(let i = 0; i < len;i++){
                   li.eq(i).removeClass('hide xixi');
                    let j = li.eq(i).find('.child-list').children('.child-item').length;
                    for(let a = 0;a < j;a++){
                    li.eq(i).find('.child-list').children('.child-item').removeClass('hide xixi');
                    }
                }
 
            }
            
        }
    },

    afterRender: function() {

        
       this.data.treeArr=this.data.data;  

       this.el.on('click','.J_tip',(e)=>{
           this.actions.toogleTree(e);

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