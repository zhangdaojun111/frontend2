/**
 * Created by Yunxuan Yan on 2017/11/9.
 */
import template from './treeNode.html';
import Component from "../../../../lib/component";
import './treeNode.scss';

let config = {
    template:template,
    data:{
        childNodes:[],
        checked:false
    },
    binds:[{
        event:'click',
        selector:'.icon',
        callback:function () {
            this.actions.toggleExpand();
        }
    },{
        event:'click',
        selector:'.node-check',
        callback:function () {
            this.actions.toggleChecked(!this.data.checked);
        }
    },{
        event:'click',
        selector:'.tree-node',
        callback:function () {
            if(this.data.options.treeType == 'MULTI_SELECT'){
                return;
            }
            this.data.options.callback('select',this.data);
            this.actions.toggleSelected();
        }
    }],
    actions:{
        toggleExpand:function () {
            this.data.childNodes.forEach(nodeEle => {
                nodeEle.actions.toggleDisplayNode();
            })
        },
        toggleChecked:function (check) {
            if(this.data.options.treeType != 'MULTI_SELECT'){
                return;
            }
            if(check != undefined){
                this.data.checked = check;
            } else {
                this.data.checked = !this.data.checked;
            }
            if(this.data.checked){
	            this.el.find('.node-check').removeClass('unchecked_box').addClass('checked_box');
	            this.data.options.callback('select',this.data);
            } else {
                this.el.find('.node-check').removeClass('checked_box').addClass('unchecked_box');
                this.data.options.callback('unselect',this.data);
            }
            this.data.childNodes.forEach(nodeEle => {
                nodeEle.actions.toggleChecked(check);
            });
        },
        toggleSelected:function () {
            if(this.data.options.treeType != 'SINGLE_SELECT'){

            }
            
        },
        toggleDisplayNode:function () {
            this.el.toggle();
            if(this.data.childNodes.length == 0){
                return;
            }
            this.data.childNodes.forEach(nodeEle => {
                nodeEle.actions.toggleDisplayNode();
            })
        },
        isFilteredNode:function (input) {
            return (this.data.text.indexOf(input) != -1);
        },
        filterNode:function (input,isParentFiltered,isSiblingsFiltered) {
            let isFiltered = false;
            if(input == undefined || input.replace(/\s/g, '') == ''){
                this.el.show();
            } else {
                if(this.data.text.indexOf(input)!=-1){
                    this.el.show();
                    isFiltered = true
                } else if(isParentFiltered && !isSiblingsFiltered){
                    this.el.show();
                } else {
                    this.el.hide();
                }
            }
            let isChildFiltered = false;
            this.data.childNodes.forEach(childNode=>{
                isChildFiltered = isChildFiltered || childNode.actions.isFilteredNode(input);
            });
            let isOffspringFiltered = false;
            this.data.childNodes.forEach(childNode=>{
                isOffspringFiltered = childNode.actions.filterNode(input,isFiltered,isChildFiltered)||isOffspringFiltered;
            });
            if(isOffspringFiltered){
                this.el.show();
            }
            return isFiltered || isOffspringFiltered;
        }
    },
    afterRender:function () {
        for(let i = 0;i < this.data.indent;i++){
            this.el.find('.icon').before($('<span class="indent"></span>'));
        }
        this.el.find('.node-text').text(this.data.text);
        if(this.data.options.treeType == 'SINGLE_SELECT'){
            this.el.find('.node-check').removeClass('unchecked_box');
        }
        if(this.data.nodes){
            let childTree = $('<div class="child-tree"></div>');
            this.data.nodes.forEach(node=>{
                let ele = $('<li></li>');
                childTree.append(ele);
                let data=node;
                data['options']=this.data.options;
                data['indent']=this.data.indent+1;
                let com = new TreeNode(data,this.data.options.callback);
                com.render(ele);
                this.data.childNodes.push(com);
            });
            this.el.after(childTree);
            this.el.find('.icon').addClass('expanded_node');
        } else {
            this.el.find('.icon').addClass('leaf_node');
        }
	    if(this.data.state && this.data.state.checked){
		    this.data.checked=this.data.state.checked;
		    this.el.find('.node-check').removeClass('unchecked_box').addClass('checked_box');
	    } else {
		    this.el.find('.node-check').removeClass('checked_box').addClass('unchecked_box');
	    }
    }
};

export default class TreeNode extends Component {
    constructor(data,callback){
    	console.log(data);
        data.callback = callback;
        super(config,data,callback);
    }
}