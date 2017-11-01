/**
 * Created by Yunxuan Yan on 2017/8/2.
 */
import 'bootstrap-treeview/src/js/bootstrap-treeview';
import Component from '../../../lib/component';
import template from './tree.html';
import './tree.scss';

const TREETYPE = {
    'MENU': {
        collapsed: true,
        multiSelect: false,
        collapseIcon: 'menu_node',
        expandIcon: 'menu_node',
        emptyIcon: 'menu_leaf_node',
        backColor: 'green'
    },
    'MULTI_SELECT': {
        collapsed: false,
        multiSelect: true,
        checkedIcon: 'checked_box',
        uncheckedIcon: 'unchecked_box',
        collapseIcon: 'expanded_node',
        expandIcon: 'expanded_node',
        emptyIcon: 'leaf_node',
        backColor: 'white',
        showBorder: true,
        showIcon: false,
        showCheckbox: true,
        color: '#666',
        selectedBackColor: '#f5f5f5',
        selectedColor: '#666',
        onhoverColor: '#ddd'

    },
    'SINGLE_SELECT': {
        collapsed: false,
        multiSelect: false,
        collapseIcon: 'collapsed_node',
        expandIcon: 'expanded_node',
        emptyIcon: 'leaf_node',
        backColor: 'white'
    }
};

let config = {
    template: template,
    data: {
        treeNodes: {},
        options: {
            callback: function (event, data) {
            },
            treeType: 'SINGLE_SELECT',
            isSearch: false,
            withButtons:false, //此按钮只有在多选时有效
            treeName: ''
        }
    },
    actions: {
        searchTreeNode: function (inputComp, tree) {
            var keyword = inputComp.val();
            tree.treeview('clearSearch');
            tree.treeview('enableAll');
            // if (keyword && keyword != '' && keyword != ' ') {
            //     tree.treeview('search', [keyword, {
            //         ignoreCase: true,
            //         exactMatch: false,
            //         revealResults: true
            //     }]);
            // }
            if(keyword == undefined || keyword == '' || keyword == ' '){
                tree.treeview('expandAll', {level: 10, silent: true});
                return;
            }
            tree.treeview('collapseAll');
            let filteredNodes = tree.treeview('search', [keyword, {
                        ignoreCase: true,
                        exactMatch: false,
                        revealResults: true
                    }]);
            //隐藏不相关节点
            let siblings = tree.treeview('getSiblings',tree.treeview('getNode',0));
            siblings = siblings||[];
            siblings.push(tree.treeview('getNode',0));
            let unrelatedNodes = this.actions._getUnrelatedNodes(siblings,filteredNodes);
            tree.treeview('disableNode',[unrelatedNodes,{silent:true}]);
            //展开筛选出的节点
            filteredNodes.forEach(node=>{
                tree.treeview('expandNode',[node, { levels: 2, silent: true } ]);
            });
        },
        selectAll:function(tree){
            setTimeout(() => { //保证树初始化完毕后才能进行操作，解决二次选择的时候报错问题
                this.actions._cruiseWholeTree(tree, (node, tree) => {
                    this.actions._cruiseSelectNode(node, tree);
                })
            },0);
        },
        _getUnrelatedNodes:function (nodes,filteredNodes) {
            let unrelatedNodes = [];
            nodes.forEach(node=>{
                if(!(filteredNodes.includes(node)||node.state.expanded)){
                    unrelatedNodes.push(node);
                }
                if(node.nodes){
                    unrelatedNodes = unrelatedNodes.concat(this.actions._getUnrelatedNodes(node.nodes,filteredNodes));
                }
            });
            return unrelatedNodes;
        },
        _cruiseSelectNode:function(node,tree){
            if(node){
                tree.treeview('checkNode',[node,{silent:false}]);
                if(node.nodes){
                    node.nodes.forEach(child=>{
                        this.actions._cruiseSelectNode(child,tree);
                    })
                }
            }
        },
        reverseAll:function (tree) {
            setTimeout(() => {
                this.actions._cruiseWholeTree(tree, (node, tree) => {
                    this.actions._toggleCheckNode(node, tree);
                });
            },0);
        },
        _cruiseWholeTree: function (tree,func) {
            let start = tree.treeview('getNode',0);
            func(start,tree);
            let siblings = tree.treeview('getSiblings',start);
            if(siblings){
                siblings.forEach(sibling=>{
                    if(!sibling.state.disabled){
                        func(sibling,tree);
                    }
                })
            }
        },
        _toggleCheckNode:function (node, tree) {
            if(node){
                tree.treeview('toggleNodeChecked',[node,{silent:true}]);
                tree.treeview('toggleNodeSelected',[node,{silent:true}]);
                let event = node.state.selected?'select':'unselect';
                this.data.options.callback(event,node);
                if(node.nodes){
                    node.nodes.forEach(child=>{
                        this.actions._toggleCheckNode(child,tree);
                    })
                }
            }
        },
        reset:function (tree) {
            tree.treeview('uncheckAll');
        },
        _checkAllChildren:function(node,treeEle){
            if(node.nodes){
                node.nodes.forEach(child=>{
                    treeEle.treeview('checkNode',[child.nodeId,{silent:true}]);
                    treeEle.treeview('selectNode',[child.nodeId,{silent:true}]);
                    this.data.options.callback('select',child);
                    this.actions._checkAllChildren(child,treeEle);
                })
            }
        },
        _uncheckAllChildren:function(node,treeEle) {
            if(node.nodes){
                node.nodes.forEach(child=>{
                    treeEle.treeview('uncheckNode',[child.nodeId,{silent:true}]);
                    treeEle.treeview('unselectNode',[child.nodeId,{silent:true}]);
                    this.data.options.callback('unselect',child);
                    this.actions._uncheckAllChildren(child,treeEle);
                })
            }
        },
        _expandAllParents: function (node, treeEle) {
            let parent = treeEle.treeview('getParent', node);
            if (parent != undefined && parent.nodeId != undefined) {
                treeEle.treeview('expandNode', [parent.nodeId, {silent: true}]);
                this.actions._expandAllParents(parent, treeEle);
            }
        }
    },
    afterRender: function () {
        //树
        let tree = this.el.find('#tree');
        if (this.data.options.treeName) {
            this.el.addClass(this.data.options.treeName);
        }
        let treeview = this;
        let treeType = TREETYPE[this.data.options.treeType];
        if (treeType.multiSelect) {

            let options = _.defaultsDeep({}, TREETYPE.MULTI_SELECT, {
                data: this.data.treeNodes,
                onNodeChecked: function (event, data) {
                    tree.treeview('selectNode', [data.nodeId, {silent: false}]);
                    treeview.actions._checkAllChildren(data, tree);
                    treeview.data.options.callback('select', data);
                },
                onNodeUnchecked: function (event, data) {
                    tree.treeview('unselectNode',[data.nodeId,{silent:false}]);
                    treeview.actions._uncheckAllChildren(data,tree);
                    treeview.data.options.callback('unselect',data);
                },
            });
            tree.treeview(options);
            if(!this.data.options.withButtons){
                this.el.find('.buttons-in-tree').hide();
            } else {
                this.el.on('click','.select-all-nodes',()=>{
                    this.actions.selectAll(tree);
                }).on('click','.reverse-all-nodes',()=>{
                    this.actions.reverseAll(tree);
                }).on('click','.reset',()=>{
                    this.actions.reset(tree);
                })
            }
        } else {
            this.el.find('.buttons-in-tree').hide();
            let options = _.defaultsDeep({}, TREETYPE[this.data.options.treeType], {
                data: this.data.treeNodes,
                onNodeSelected: function (event, node) {
                    if(treeview.data.options.selectParentMode == 'Expand'){
                        console.log('expand');
                        tree.treeview('getSelected').forEach(selected => {
                            if (selected.nodeId === node.nodeId) {
                                return;
                            }
                            tree.treeview('unselectNode', [selected.nodeId, {silent: true}]);
                        });
                        if (!node.nodes) {
                            treeview.data.options.callback('select', node);
                        }
                        treeview.actions._expandAllParents(node, tree);
                        tree.treeview('toggleNodeExpanded', [node.nodeId]);
                    } else if (treeview.data.options.selectParentMode == 'Select'){
                        console.log('select');
                        treeview.data.options.callback('select', node);
                    }
                },
                onNodeUnselected: function (event, node) {
                    if(treeview.data.options.selectParentMode == 'Expand') {
                        tree.treeview('selectNode', [node.nodeId, {silent: true}]);
                        tree.treeview('toggleNodeExpanded', [node.nodeId]);
                    }
                },
                onNodeExpanded: function (event, node) {
                    if(treeview.data.options.selectParentMode == 'Expand') {
                        let siblings = tree.treeview('getSiblings', node);
                        if (siblings) {
                            siblings.forEach(sibling => {
                                if (sibling.state.expanded) {
                                    tree.treeview('collapseNode', [sibling, {silent: true, ignoreChildren: false}]);
                                }
                            })
                        }
                    }
                }
            })
            tree.treeview(options);
        }
        if (treeType.collapsed) {
            tree.treeview('collapseAll', {silent: true});
        } else {
            tree.treeview('expandAll', {level: 10, silent: true});
        }

        //搜索框
        if (!this.data.options.isSearch) {
            this.el.find("#search-in-tree").hide();
        } else {
            var inputComp = this.el.find('#search-in-tree');
            this.el.on('input', '#search-in-tree', _.debounce(() => {
                treeview.actions.searchTreeNode(inputComp, tree)
            }, 500));//500ms的延迟，减少事件处理
        }

    }
}

let defaultOptions = {
    callback: function (event, data) {
    },
    treeType: 'SINGLE_SELECT',
    selectParentMode:'Expand',
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
class TreeView extends Component {
    constructor(treeNodes, options) {
        config.data.treeNodes = treeNodes;
        options = _.defaultsDeep(options, defaultOptions);
        config.data.options = options;
        super(config);
    }
}

export default TreeView;
