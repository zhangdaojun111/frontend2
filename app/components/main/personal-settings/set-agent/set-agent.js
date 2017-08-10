import Component from '../../../../lib/component';
import 'jquery-ui/themes/base/base.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/ui/widgets/dialog.js';
import './set-agent.scss';
import template from './set-agent.html';
import {UserInfoService} from "../../../../services/main/userInfoService"
import msgbox from "../../../../lib/msgbox";
import TreeView from "../../../../components/util/tree/tree";
import {AutoSelect} from '../../../../components/util/autoSelect/autoSelect';


let config = {
    template:template,
    data:{},

    originData:null,            //请求到的原始数据
    formatData:null,
    workflowTree:null,          //工作流数据
    agentList:null,             //代理人数据

    selectedWorkflow:null,        //记录被选中的工作流的id
    selectedAgent:'',           //记录被选中的代理人
    isOpen:0,               //是否开启代理，默认否    1是开，0是关
    atSelect:null,

    actions:{
        initData:function () {
            UserInfoService.getAgentData()
                .done((result) => {
                    if(result.success === 1){
                        this.originData = result;
                        this.formatData = [];
                        this.selectedWorkflow = new Set();
                        this.selectedAgent = '';
                        this.isOpen = 0;
                        this.atSelect = null;
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
                const children = node.children;
                if ( children && children.length > 0){
                    this.actions.formatOriginData(children);
                }
            }
        },
        initAgentList:function () {
            let $wrap = this.el.find('.name-list');
            let tempData = [];
            for(let row of this.originData.data.user_list){
                if(row.name && row.name.trim() !== ''){
                    tempData.push(row);
                }
            }
            let autoSelect = new AutoSelect({
                list: tempData
            });
            this.atSelect = autoSelect;
            autoSelect.render($wrap);
            // this.agentList = this.originData.data.user_list;
            // let $nameList = this.el.find("#name_list");
            // for(let agent of this.agentList){
            //     let newAgent = $("<option class='agentRow'>");
            //     newAgent.agentData = agent;
            //     newAgent.html(agent.name);
            //     $nameList.append(newAgent);
            // }
            // this.agentList = this.originData.data.user_list;
            // let $nameList = this.el.find("#name_list");
            // for(let agent of this.agentList){
            //     let newAgent = $("<option class='agentRow'>");
            //     newAgent.agentData = agent;
            //     newAgent.html(agent.name);
            //     $nameList.append(newAgent);
            // }
        },
        //仅保存被选中的具体工作流（叶子）节点的id，以是否具备group属性判断该节点是否为叶子节点
        selectNode:function (event,node) {
            if(event === 'select'){
                if(node.group && node.nodes && node.nodes.length > 0){
                    this.actions.addNodes(node.nodes);
                }else{
                    this.selectedWorkflow.add(node.id);
                }
            }else{
                if(node.group && node.nodes && node.nodes.length > 0){
                    this.actions.removeNodes(node.nodes);
                }else{
                    this.selectedWorkflow.delete(node.id);
                }
            }
        },
        addNodes:function (nodes) {
            for(let i=0; i<nodes.length; i++){
                if(!nodes[i].group){
                    this.selectedWorkflow.add(nodes[i].id);
                }else{
                    let children = nodes[i].nodes;
                    if(children && children.length > 0){
                        this.actions.addNodes(children);
                    }
                }
            }
        },
        removeNodes:function (nodes) {
            for(let i=0; i<nodes.length; i++){
                if(!nodes[i].group){
                    this.selectedWorkflow.delete(nodes[i].id);
                }else{
                    let children = nodes[i].nodes;
                    if(children && children.length > 0){
                        this.actions.removeNodes(children);
                    }
                }
            }
        },
        // setAgentId:function (event) {
        //     this.selectedAgent = '';
        //     let user_name = this.el.find("input[name=name_input]").val();
        //     console.log(user_name);
        //     if(user_name !== ''){
        //         for (let agent of this.originData.data.user_list) {
        //             if ( user_name === agent.name){
        //                 this.selectedAgent = agent.id;
        //             }
        //         }
        //     }
        //     console.log(this.selectedAgent);
        // },
        closeSwitch:function (event) {
            this.isOpen = 0;
        },
        openSwitch:function (event) {
            this.isOpen = 1;
        },
        saveAgent:function () {
            this.selectedAgent = this.atSelect.actions.getId();
            //保存代理前进行逻辑判断
            if(this.isOpen === 1 && this.selectedAgent === ''){
                msgbox.alert("请选择一个代理人");
                return;
            }
            if(this.isOpen === 1 && this.selectedWorkflow.size === 0){
                msgbox.alert("请选择至少一个流程");
                return;
            }
            let workflow_temp = Array.from(this.selectedWorkflow);
            let data = {
                workflow_names:workflow_temp,
                agent_id:this.selectedAgent,
                is_apply:this.isOpen
            };

            UserInfoService.saveAgentData(data)
                .done((result) => {
                    if(result.success === 1){
                        if(result.agent_state === 0){
                            msgbox.alert("您所选择的代理人已离职，请重新选择");
                        }else{
                            msgbox.alert("选择代理成功");
                            UserInfoService.getSysConfig();
                            agentSetting.hide();
                        }
                    }else{
                        msgbox.alert("选择代理失败")
                    }
                });
        }
    },
    afterRender:function () {
        this.actions.initData();
        this.el.on("click","span.save-proxy",() => {
            this.actions.saveAgent();
        // }).on("input","input[name=name_input]",(event) => {
        //     this.actions.setAgentId(event);
        }).on("click","input.close-radio",(event) => {
            this.actions.closeSwitch(event);
        }).on("click","input.open-radio",(event) => {
            this.actions.openSwitch(event);
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


export const agentSetting = {
    el: null,
    show: function() {
        let component = new SetAgent();
        component.dataService = UserInfoService;
        this.el = $('<div id="set-agent-page">').appendTo(document.body);
        component.render(this.el);
        this.el.dialog({
            title: '设置代理',
            width: 915,
            height: 620,
            modal: true,
            close: function() {
                $(this).dialog('destroy');
                component.destroySelf();
            }
        });
    },
    hide: function () {
        this.el.dialog('close');
    }
}