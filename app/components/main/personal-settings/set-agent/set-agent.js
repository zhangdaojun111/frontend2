import Component from '../../../../lib/component';
import 'jquery-ui/themes/base/base.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/ui/widgets/dialog.js';
import './set-agent.scss';
import template from './set-agent.html';
import {UserInfoService} from "../../../../services/main/userInfoService"
import msgbox from "../../../../lib/msgbox";
import TreeView from "../../../../components/util/tree/tree"


let config = {
    template:template,
    data:{},

    originData:null,            //请求到的原始数据
    formatData:null,
    workflowTree:null,          //工作流数据
    agentList:null,             //代理人数据

    selectWorkflow:null,        //记录被选中的工作流
    selectAgent:null,           //记录被选中的代理人
    isOpen:false,               //是否开启代理，默认否



    actions:{
        initData:function () {
            UserInfoService.getAgentData()
                .done((result) => {
                    if(result.success === 1){
                        this.originData = result;
                        this.formatData = [];
                        $.extend(true,this.formatData,this.originData.data.workflow_list);
                    }else{
                        msgbox.alert("数据加载失败");
                        throw error("数据加载失败");
                    }
                }).done(() => {
                    this.actions.initWorkflow();
                    this.actions.initAgentList();
                }).catch((err) => {
                    msgbox.alert("数据加载失败");
                    return false;
                });
        },
        initWorkflow:function () {
            this.actions.formatOriginData(this.formatData);
            console.log(this.formatData);
            let treeView = new TreeView(this.formatData,{
                callback:this.actions.selectNode,
                treeType:"MULTI_SELECT",
                treeName:"workflow-tree"
            });
            let $container = this.el.find("div.work-tree");
            treeView.render($container);
        },
        formatOriginData:function (nodes) {
            for(let i = 0; i < nodes.length; i++){
                const node = nodes[i];
                node.text = node.label;
                node.icon = '';
                node.selectedIcon = '';
                node.backColor = "#FFFFFF";
                node.selectable = false;
                node.state = {
                    checked: false,
                    disabled: false,
                    expanded: true,
                    selected: false,
                };
                node.tags = ['available'];
                node.nodes = node.children;
                // console.log(node);
                const children = node.children;
                if ( children && children.length > 0){
                    this.actions.formatOriginData(children);
                }
            }
        },
        selectNode:function () {

        },
        initAgentList:function () {
            this.agentList = this.originData.data.user_list;
            let $nameList = this.el.find("#name_list");
            for(let agent of this.agentList){
                let newAgent = $("<option class='agentRow'>");
                newAgent.agentData = agent;
                newAgent.html(agent.name);
                $nameList.append(newAgent);
            }
        }
    },
    afterRender:function () {
        this.actions.initData();

    },
    beforeDestory:function () {

    }
};

class SetAgent extends Component{
    constructor(){
        super(config);
    }
}

export default {
    show: function() {
        let component = new SetAgent();
        component.dataService = UserInfoService;
        let el = $('<div id="set-agent-page">').appendTo(document.body);
        component.render(el);
        el.dialog({
            title: '设置代理',
            width: 893,
            height: 620,
            close: function() {
                component.destroySelf();
            }
        });
    }
}