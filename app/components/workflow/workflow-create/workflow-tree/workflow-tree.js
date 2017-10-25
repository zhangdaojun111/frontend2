/**
 * @author hufei
 * 生成工作流名称的下拉菜单
 */
import Component from "../../../../lib/component";
import template from './workflow-tree.html';
import './workflow-tree.scss';

import Mediator from '../../../../lib/mediator';

let config = {
    template: template,
    data:{
        treeArr:[],
        showTree:true //显示下拉菜单
    },
    actions: {
        /**
         * 隐藏显示下拉菜单
         */
        toogleTree:function(){
            let tree = this.el.find(".J_tree");
            tree.toggle();
            let len = this.el.find(".tree-list").children('li').length;
            for(let i = 0; i < len;i++){
                this.el.find('.tree-list li').eq(i).removeClass('hide xixi');
                let j = this.el.find('.tree-list li').eq(i).find('.child-list').children('.child-item').length;
                for(let a = 0;a < j;a++){
                   this.el.find('.tree-list li').eq(i).find('.child-list').children('.child-item').removeClass('hide xixi');
                }
            }
            this.el.find('.J_search').val("");
            this.data.showTree = !this.data.showTree;
        },
        //
        /**
         * 点击树的根节点隐藏子节点
         * @param e 点击的dom节点
         */
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
        /**
         * 点击下来菜单中的子菜单，显示工作流
         * @param e点击的dom节点
         */
        clickChild:function(e){
            //get current clicked node info
            let {formid,tableid}=$(e.target)[0].dataset;
            Mediator.publish('workflow:choose', $(e.target)[0].dataset);
            let childValue = $(e.target).text();
            let rootNode = this.el.find('.J_select-Workflow');
            let tree = this.el.find(".J_tree");
            rootNode.text(childValue);
            tree.hide();
            this.data.showTree = true;
        },

        /**
         * 输入搜索改变下拉菜单
         */
        changeTree:function(){
            let keyword = $('.J_search').val();
            let c;
            let arr = {};
            let str = {}; 
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

            this.data.treeArr.forEach((el,index)=>{
                let obj = new Array();
                el.children.forEach((al,num)=>{
                    obj.push(al.name_py);
                    str[index] = obj; 
                })
            })

            for(let i in arr){
                c=i;
                let len = arr[i].length;
                for(let j = 0 ;j<len;j++){
                    if(keyword!=""){
                         if( arr[i][j].indexOf(keyword)!=-1 || str[i][j].indexOf(keyword)!=-1 ){
                            li.eq(i).addClass('xixi');
                            li.eq(i).find(".root").addClass('xixi');
                            li.eq(i).find('.child-list .child-item').eq(j).addClass("xixi");
                        }
                    }
                }
            }
            //判断是否拥有标记对dom进行操作
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
            //如果输入信息置空，显示所有的菜单
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
    binds:[

    ],
    afterRender: function() {
        Mediator.subscribe('workflow:choose', (msg)=> {
            let rootNode = this.el.find('.J_select-Workflow');
            rootNode.text(msg.name);
        });

        $(document.body).on('click',()=> {
            let tree = this.el.find(".J_tree");
            if(!this.data.showTree){
                tree.hide();
                this.data.showTree = true;
            }
        });
       this.data.treeArr=this.data.data;
       this.data.showTree = true;

       this.el.on('click','.J_tip',(e)=>{
           this.actions.toogleTree(e);
           e.stopPropagation();
       });

       this.el.on('click','.J_root',(e)=>{
           this.actions.toogletip(e);
           e.stopPropagation(e);
       });
       this.el.on('click','.J_child-item',(e)=>{
            this.actions.clickChild(e);
       })
        this.el.on("click",'.J_search',(e)=>{
            e.stopPropagation();
        })
       this.el.bind("input propertychange",'.J_search',(event)=>{
            this.actions.changeTree();
       })
    }
}

class WorkFlowTree extends Component {
    // constructor(data){
    //     super(config,data);
    // }
    constructor(data,newConfig){
        super($.extend(true,{},config,newConfig,{data:data||{}}));
    }
}

export default WorkFlowTree;