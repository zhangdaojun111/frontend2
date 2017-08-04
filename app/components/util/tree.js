/**
 * Created by Yunxuan Yan on 2017/8/2.
 */
import 'bootstrap-treeview/dist/bootstrap-treeview.min';
import Component from '../../lib/component';
import template from './tree.html';
import './tree.scss';

const TREETYPE = {
    'MENU':{
        collapsed:true,
        multiSelect:false,
        foldIcon: 'menu_node',
        unfoldIcon: 'menu_node',
        leafIcon: '',
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
        treeType:'SINGLE_SELECT',
        divId: 'tree',
        selectedCallback: function () {}
    },
    actions:{
        _uncheckAllAncestors:function(node){
            let parent = $('#tree').treeview('getParent',node);
            if(parent != undefined && parent.nodeId != undefined && parent.state.selected == true){
                $('#tree').treeview('uncheckNode',[parent.nodeId,{silent:true}]);
                $('#tree').treeview('unselectNode',[parent.nodeId,{silent:true}]);
                this.actions._uncheckAllAncestors(parent);
            }
        },
        _checkAllChildren:function(node){
            if(node.nodes){
                node.nodes.forEach(child=>{
                    $('#tree').treeview('checkNode',[child.nodeId,{silent:true}]);
                    $('#tree').treeview('selectNode',[child.nodeId,{silent:true}]);
                    this.actions._checkAllChildren(child);
                })
            }
        },
        _uncheckAllChildren:function(node) {
            if(node.nodes){
                node.nodes.forEach(child=>{
                    $('#tree').treeview('uncheckNode',[child.nodeId,{silent:true}]);
                    $('#tree').treeview('unselectNode',[child.nodeId,{silent:true}]);
                    this.actions._uncheckAllChildren(child);
                })
            }
        },
        _expandAllParents:function(node){
            let parent = $('#tree').treeview('getParent',node);
            if(parent != undefined && parent.nodeId != undefined){
                $('#tree').treeview('expandNode', [parent.nodeId,{silent:true}]);
                this.actions._expandAllParents(parent);
            }
        }
    },
    afterRender:function() {
        $('#tree').attr('id',this.data.divId);
        let tree = $('#'+this.data.divId);
        let treeview = this;
        let treeType = TREETYPE[this.data.treeType];
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
                    treeview.actions._checkAllChildren(data);
                    // if(data.nodes){
                    //     data.nodes.forEach(child=>{
                    //         $('#tree').treeview('checkNode',[child.nodeId,{silent:false}]);
                    //     });
                    // }
                    treeview.data.selectedCallback('select',data);
                },
                onNodeUnchecked: function (event, data) {
                    tree.treeview('unselectNode',[data.nodeId,{silent:false}]);
                    treeview.actions._uncheckAllChildren(data);
                    // if(data.nodes){
                    //     data.nodes.forEach(child=>{
                    //         $('#tree').treeview('uncheckNode',[child.nodeId,{silent:false}]);
                    //     })
                    // }
                    treeview.actions._uncheckAllAncestors(data);
                    treeview.data.selectedCallback('unselect',data);
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
                        treeview.data.selectedCallback('select',node);
                    }
                    treeview.actions._expandAllParents(node);
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
        if(TREETYPE[this.data.treeType].collapsed){
            tree.treeview('collapseAll', { silent: true });
        }
    }
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
 *  treeName: 必填，用于修改树的id，避免与其他树混淆
 *  callback：必填，选择节点和取消选择时的回调方法，包括event（‘select’，‘unselect’），node（涉及事件的节点）
 *  treeType：可选，默认值'SINGLE_SELECT'，可填'MENU', 'SINGLE_SELECT','MULTI_SELECT'三种类型，树会根据配置出对应的行为。
 *
 *  风格化方法：定义scss文件，在调用本树的组件中import，参照示例的tree1写法
 */
class TreeView extends Component{
    constructor(treeNodes,treeName, callback,treeType){
        config.data.treeNodes = treeNodes;
        config.data.divId = treeName;
        config.data.selectedCallback = callback;
        if(treeType){
            config.data.treeType = treeType;
        }
        super(config);
    }
}

export default TreeView;
