/**
 * Created by Yunxuan Yan on 2017/11/9.
 */
import Component from "../../../lib/component";
import template from './tree.html';
import './tree.scss';
import TreeNode from './treeNode/treeNode';

let config = {
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
    actions:{},
    afterRender:function () {
        if(!this.data.options.isSearch){
            this.el.find('.search-in-tree-box').hide();
        } else {
            this.el.find('.search-in-tree-box').show();
        }
        if(!this.data.options.withButtons){
            this.el.find('.buttons-in-tree').hide();
        } else {
            this.el.find('.buttons-in-tree').show();
        }
        if(this.data.options.treeName){
            this.el.addClass(this.data.options.treeName);
        }
        this.data.treeNodes.forEach(node => {
            let data = node;
            data['options']=this.data.options;
            data['indent']=this.data.indent;
            let comp = new TreeNode(data,this.data.options.callback);
            let ele = $('<li></li>');
            this.el.find('#tree1').append(ele);
            comp.render(ele);
            this.data.trees.push(comp);
        });
    }
}

export default class TreeView extends Component {
    constructor(treeNode,options){
        let data = {
            treeNodes:treeNode,
            options:options,
            indent:0
        }
        super(config,data,options.callback);
    }
}