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

    selectWorkflow:null,        //记录被选中的工作流的id
    selectedAgent:'',           //记录被选中的代理人
    isOpen:false,               //是否开启代理，默认否

    actions:{
        initData:function () {
            UserInfoService.getAgentData()
                .done((result) => {
                    if(result.success === 1){
                        this.originData = result;
                        this.formatData = [];
                        this.selectWorkflow = new Set();
                        this.selectedAgent = '';
                        this.isOpen = false;
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
            let treeView = new TreeView(this.formatData,{
                callback:(event,node) => {
                    this.actions.selectNode(event,node);
                },
                treeType:"MULTI_SELECT",
                treeName:"workflow-tree"
            });
            let $container = this.el.find("div.work-tree");
            treeView.render($container);
        },
        formatOriginData:function (nodes) {
            for(let i = 0; i < nodes.length; i++){
                const node = nodes[i];
                console.log(node.id);
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
        initAgentList:function () {
            this.agentList = this.originData.data.user_list;
            let $nameList = this.el.find("#name_list");
            for(let agent of this.agentList){
                let newAgent = $("<option class='agentRow'>");
                newAgent.agentData = agent;
                newAgent.html(agent.name);
                $nameList.append(newAgent);
            }
        },
        //仅保存被选中的具体工作流（叶子）节点的id，以是否具备group属性判断该节点是否为叶子节点
        selectNode:function (event,node) {
            console.log(event,node);
            if(event === 'select'){
                if(node.group && node.nodes && node.nodes.length > 0){
                    this.actions.addNodes(node.nodes);
                }else{
                    this.selectWorkflow.add(node.id);
                }
            }else{
                if(node.group && node.nodes && node.nodes.length > 0){
                    this.actions.removeNodes(node.nodes);
                }else{
                    this.selectWorkflow.delete(node.id);
                }
            }
        },
        addNodes:function (nodes) {
            for(let i=0; i<nodes.length; i++){
                if(!nodes[i].group){
                    this.selectWorkflow.add(nodes[i].id);
                }else{
                    let children = nodes[i].nodes;
                    if(children && children.length > 0){
                        this.actions.addNodes(children);
                    }
                }
            }
        },
        removeNodes:function () {
            for(let i=0; i<nodes.length; i++){
                if(!nodes[i].group){
                    this.selectWorkflow.delete(nodes[i].id);
                }else{
                    let children = nodes[i].nodes;
                    if(children && children.length > 0){
                        this.actions.removeNodes(children);
                    }
                }
            }
        },
        setAgentId:function (event) {
            console.log(this.originData);
            let user_name = this.el.find("input[name=name_input]").val();
            for (let agent of this.originData.data.user_list) {
                if ( user_name === agent.name){
                    this.selectedAgent = agent.id;
                }
            }
        },
        setSwitch:function (event) {

        },
        saveAgent:function (event) {
            // console.log(this.selectWorkflow);
            console.log(this.selectedAgent);

        }
    },
    afterRender:function () {
        this.actions.initData();
        this.el.on("click","span.save-proxy",(event) => {
            this.actions.saveAgent(event);
        }).on("input","input[name=name_input]",(event) => {
            this.actions.setAgentId(event);
        }).on("click","input.close-radio",(event) => {
            this.actions.setSwitch(event);
        }).on("click","input.open-radio",(event) => {
            this.actions.setSwitch(event);
        });
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
            modal: true,
            close: function() {
                component.destroySelf();
            }
        });
    }
}