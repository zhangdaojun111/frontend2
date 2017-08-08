/**
 * Created by Yunxuan Yan on 2017/8/2.
 */
import 'bootstrap-treeview/dist/bootstrap-treeview.min.js';
import Component from '../../../lib/component';
import template from './tree.html';
import './tree.scss';
const TREETYPE = {
    'MENU':{
        collapsed:true,
        multiSelect:false,
        foldIcon: 'menu_node',
        unfoldIcon: 'menu_node',
        leafIcon: 'menu_leaf_node',
        backColor: 'green'
    },
    'MULTI_SELECT':{
        collapsed:false,
        multiSelect:true,
        checkedIcon:'checked_box',
        uncheckedIcon:'unchecked_box',
        foldIcon: 'collapsed_node',
        unfoldIcon: 'expanded_node',
        leafIcon: 'leaf_node',
        backColor: 'white'
    },
    'SINGLE_SELECT':{
        collapsed:false,
        multiSelect:false,
        foldIcon: 'collapsed_node',
        unfoldIcon: 'expanded_node',
        leafIcon: 'leaf_node',
        backColor: 'white'
    }
};
let config = {
    template:template,
    data:{
        treeNodes:{},
        options: {
            callback: function (event,data) {},
            treeType: 'SINGLE_SELECT',
            isSearch: false,
            treeName: ''
        }
    },
    actions:{
        searchTreeNode:function(inputComp,tree){
            var keyword = inputComp.val();
            tree.treeview('clearSearch');
            if(keyword && keyword != '' && keyword != ' '){
                tree.treeview('search',[keyword,{
                    ignoreCase:true,
                    exactMatch:false,
                    revealResults:true
                }])
            }
        },
        _delay:function (callback,ms) {
            var timer = 0;
            return function (callback,ms) {
                clearTimeout(timer);
                timer = setTimeout(callback,ms);
            };
        },
        _uncheckAllAncestors:function(node,treeEle){
            let parent = treeEle.treeview('getParent',node);
            if(parent != undefined && parent.nodeId != undefined && parent.state.selected == true){
                treeEle.treeview('uncheckNode',[parent.nodeId,{silent:true}]);
                treeEle.treeview('unselectNode',[parent.nodeId,{silent:true}]);
                this.actions._uncheckAllAncestors(parent,treeEle);
            }
        },
        _checkAllChildren:function(node,treeEle){
            if(node.nodes){
                node.nodes.forEach(child=>{
                    treeEle.treeview('checkNode',[child.nodeId,{silent:true}]);
                    treeEle.treeview('selectNode',[child.nodeId,{silent:true}]);
                    this.actions._checkAllChildren(child,treeEle);
                })
            }
        },
        _uncheckAllChildren:function(node,treeEle) {
            if(node.nodes){
                node.nodes.forEach(child=>{
                    treeEle.treeview('uncheckNode',[child.nodeId,{silent:true}]);
                    treeEle.treeview('unselectNode',[child.nodeId,{silent:true}]);
                    this.actions._uncheckAllChildren(child,treeEle);
                })
            }
        },
        _expandAllParents:function(node,treeEle){
            let parent = treeEle.treeview('getParent',node);
            if(parent != undefined && parent.nodeId != undefined){
                treeEle.treeview('expandNode', [parent.nodeId,{silent:true}]);
                this.actions._expandAllParents(parent,treeEle);
            }
        }
    },
    afterRender:function() {
        //树
        let tree = this.el.find('#tree');
        if(this.data.options.treeName){
            this.el.addClass(this.data.options.treeName);
        }
        let treeview = this;
        let treeType = TREETYPE[this.data.options.treeType];
        let collapseIcon = treeType.foldIcon;
        let expandIcon = treeType.unfoldIcon;
        let emptyIcon = treeType.leafIcon;
        let backColor = treeType.backColor;
        if(treeType.multiSelect){
            tree.treeview({data:this.data.treeNodes,
                checkedIcon:treeType.checkedIcon,
                uncheckedIcon:treeType.uncheckedIcon,
                showCheckbox:true,
                multiSelect:true,
                selectedBackColor: 'grey',
                collapseIcon: collapseIcon,
                expandIcon: expandIcon,
                emptyIcon: emptyIcon,
                onNodeChecked: function (event, data) {
                    tree.treeview('selectNode',[data.nodeId,{silent:false}]);
                    //没有采用silent：false的方法在树的上下级传递checked状态是为了减少事件发生
                    treeview.actions._checkAllChildren(data,tree);
                    // if(data.nodes){
                    //     data.nodes.forEach(child=>{
                    //         $('#tree').treeview('checkNode',[child.nodeId,{silent:false}]);
                    //     });
                    // }
                    treeview.data.options.callback('select',data);
                },
                onNodeUnchecked: function (event, data) {
                    tree.treeview('unselectNode',[data.nodeId,{silent:false}]);
                    treeview.actions._uncheckAllChildren(data,tree);
                    // if(data.nodes){
                    //     data.nodes.forEach(child=>{
                    //         $('#tree').treeview('uncheckNode',[child.nodeId,{silent:false}]);
                    //     })
                    // }
                    treeview.actions._uncheckAllAncestors(data,tree);
                    treeview.data.options.callback('unselect',data);
                },
            });
        } else {
            tree.treeview({data:this.data.treeNodes,
                collapseIcon: collapseIcon,
                expandIcon: expandIcon,
                emptyIcon: emptyIcon,
                backColor: backColor,
                onNodeSelected: function (event, node) {
                    tree.treeview('getSelected').forEach(selected=>{
                        if(selected.nodeId === node.nodeId){
                            return;
                        }
                        tree.treeview('unselectNode', [selected.nodeId, { silent: true }]);
                    });
                    if(!node.nodes){
                        treeview.data.options.callback('select',node);
                    }
                    treeview.actions._expandAllParents(node,tree);
                    tree.treeview('toggleNodeExpanded',[node.nodeId]);
                },
                onNodeUnselected: function (event, node) {
                    tree.treeview('selectNode', [node.nodeId, { silent: true }]);
                    tree.treeview('toggleNodeExpanded',[node.nodeId]);
                },
                onNodeExpanded: function (event, node) {
                    let siblings = tree.treeview('getSiblings',node);
                    if(siblings){
                        siblings.forEach(sibling=>{
                            if(sibling.state.expanded){
                                tree.treeview('collapseNode',[sibling, { silent: true, ignoreChildren: false }]);
                            }
                        })
                    }
                }
            });
        }
        if(treeType.collapsed){
            tree.treeview('collapseAll', { silent: true });
        } else {
            tree.treeview('expandAll', { level: 2, silent: true });
        }
        //搜索框
        if(!this.data.options.isSearch){
            this.el.find("#search-in-tree").hide();
        } else {
            var timeout = null;
            var inputComp = this.el.find('#search-in-tree');
            this.el.on('keyup','#search-in-tree',_.debounce(()=>{
                treeview.actions.searchTreeNode(inputComp,tree)
            },500));//500ms的延迟，减少事件处理
        }
    }
}
let defaultOptions = {
    callback: function (event,data) {},
    treeType: 'SINGLE_SELECT',
    isSearch: false,
    treeName: ''
}
/**
 * treeNode:必填，节点树的对象
 *      形如：
 *           {
 *                text: "Node 1",
 *                icon: "glyphicon glyphicon-stop",
 *                selectedIcon: "glyphicon glyphicon-stop",
 *                color: "#000000",
 *                backColor: "#FFFFFF",
 *                href: "#node-1",
 *                selectable: true,
 *                state: {
 *                  checked: true,
 *                  disabled: true,
 *                  expanded: true,
 *                  selected: true
 *                },
 *                tags: ['available'],
 *                nodes: [
 *                  {},
 *                  ...
 *                ]
 *            }
 *      可添加其他属性，text为必填参数，其他为可选参数，不写则适用默认值
 *  Options：包含一下四个属性：
 *      callback：必填，选择节点和取消选择时的回调方法，包括event（‘select’，‘unselect’），node（涉及事件的节点）
 *      treeType：可选，默认值'SINGLE_SELECT'，可填'MENU', 'SINGLE_SELECT','MULTI_SELECT'三种类型，树会根据配置出对应的行为。
 *      isSearch：可选，是否显示输入框
 *      treeName: 可选，用于添加树的class，添加样式
 *
 *  风格化方法：定义scss文件，在调用本树的组件中import，参照示例的tree1写法
 */
class TreeView extends Component{
    constructor(treeNodes, options){
        config.data.treeNodes = treeNodes;
        options = _.defaultsDeep(options,defaultOptions);
        // console.dir(options);
        config.data.options = options;
        super(config);
    }
}
export default TreeView;