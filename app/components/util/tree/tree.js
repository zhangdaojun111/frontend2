/**
 * Created by Yunxuan Yan on 2017/11/9.
 */
import Component from "../../../lib/component";
import template from './tree.html';
import './tree.scss';
import TreeNode from './treeNode/treeNode';

let TreeView = Component.extend({
    template:template,
    data:{
        trees:[]
    },
    binds:[{
        event:'click',
        selector:'.select-all-nodes',
        callback:_.debounce(function () {
            this.data.trees.forEach(treeComp=>{
                treeComp.actions.toggleChecked(true);
            })
        },0)
    },{
        event:'click',
        selector:'.reverse-all-nodes',
        callback:_.debounce(function () {
            this.data.trees.forEach(treeComp=>{
                treeComp.actions.toggleChecked();
            })
        },0)
    },{
        event:'click',
        selector:'.reset',
        callback:_.debounce(function () {
            this.data.trees.forEach(treeComp=>{
                treeComp.actions.toggleChecked(false);
            })
        },0)
    },{
        event: 'input',
        selector: '.search-in-tree',
        callback: _.debounce(function(context){
                let input = context.value;
                this.data.trees.forEach(treeComp=>{
                    treeComp.actions.filterNode(input);
                })
            },500)
    }],
    actions:{
        _showOrHide(flag,selector){
            if(!flag){
                this.el.find(selector).hide();
            } else {
                this.el.find(selector).show();
            }
        }
    },
    afterRender:function () {
        this.actions._showOrHide(this.data.options.isSearch,'.search-in-tree-box');
        this.actions._showOrHide(this.data.options.withButtons,'.buttons-in-tree');
        if(this.data.options.treeName){
            this.el.addClass(this.data.options.treeName);
        }
        this.data.treeNodes.forEach(node => {
            let data = node;
            data['options']=this.data.options;
            data['indent']=this.data.indent;
            data['options']['callback']=this.data.options.callback
            let comp = new TreeNode({data:data});
            let ele = $('<li></li>');
            this.el.find('#tree1').append(ele);
            comp.render(ele);
            this.data.trees.push(comp);
        });
    }
});

export default TreeView;