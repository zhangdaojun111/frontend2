/**
 * @author zhaoyan
 * 打开代理设置界面
 */

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
    data:{
        selectedAgent:{},           //记录被选中的代理人
    },

    originData:{},            //请求到的原始数据
    formatData:[],
    workflowTree:{},          //工作流数据
    agentList:{},             //代理人数据

    selectedWorkflow:new Set(),        //记录被选中的工作流的id

    isOpen:0,               //是否开启代理
    atSelect:{},

    actions:{
        initData:function () {
            let that = this;
            UserInfoService.getAgentData().done((result) => {
                if(result.success === 1){
                    that.originData = result;
                    if(result.data.hasOwnProperty('user_id') && result.data.hasOwnProperty('agent_name')){
                        that.data.selectedAgent = {
                            id:result.data.user_id,
                            name:result.data.agent_name
                        };
                    }

                    this.isOpen = result.data.is_apply ? 1:0;
                    $.extend(true,this.formatData,this.originData.data.workflow_list);
                    this.actions.initWorkflow();
                    this.actions.initAgentList();
                    this.actions.initSwitch();
                }else{
                    msgbox.alert("获取数据失败");
                }
                // this.hideLoading();
            })
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
                node.text = node.label;
                node.icon = '';
                node.selectedIcon = '';
                node.backColor = "#FFFFFF";
                node.selectable = false;
                node.state = {
                    checked: node.isSelect,
                    disabled: false,
                    expanded: true,
                    selected: false,
                };
                node.tags = ['available'];
                node.nodes = node.children;
                if(node.isSelect === true && (!node.hasOwnProperty("group"))){
                    this.selectedWorkflow.add(node.id);
                }
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
                if(row.name && row.name.trim() !== '' && row.id && row.id.trim() !== ''){
                    row.py = row.f7_p.join(',');
                    tempData.push(row);
                }
            }
            let that = this;
            let temp = [];
            if(Object.keys(this.data.selectedAgent).length > 0){
                temp.push(this.data.selectedAgent);
            }
            let autoSelect = new AutoSelect({
                list: tempData,
                multiSelect: false,
                editable: true,
                choosed:temp
            }, {
                onSelect: function (choosed) {
                    that.actions.setAgentId(choosed);
                }
            });

            this.atSelect = autoSelect;
            autoSelect.render($wrap);
        },
        initSwitch:function () {
            if(this.isOpen === 1){
                this.el.find('.open-radio').attr("checked",true);
            }else{
                this.el.find('.close-radio').attr("checked",true);
            }
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
        setAgentId:function (agent) {
            if(agent.length > 0){
                this.data.selectedAgent = agent[0];
            }else{
                this.data.selectedAgent = {};
            }
        },
        closeSwitch:function (event) {
            this.isOpen = 0;
        },
        openSwitch:function (event) {
            this.isOpen = 1;
        },
        saveAgent:function () {
            //保存代理前进行逻辑判断
            if(Object.keys(this.data.selectedAgent).length === 0 || this.data.selectedAgent.id === ''){
                msgbox.alert("请选择一个代理人");
                return;
            }
            if(this.selectedWorkflow.size === 0){
                msgbox.alert("请选择至少一个流程");
                return;
            }
            this.showLoading();
            let workflow_temp = Array.from(this.selectedWorkflow);
            let data = {
                workflow_names:workflow_temp,
                agent_id:this.data.selectedAgent.id,
                is_apply:this.isOpen
            };

            UserInfoService.saveAgentData(data).done((result) => {
                this.hideLoading();
                if(result.success === 1){
                    if(result.agent_state === 0){
                        msgbox.alert("您所选择的代理人已离职，请重新选择");
                    }else{
                        msgbox.alert(`设置代理成功，目前代理状态为：${this.isOpen ? "已开启":"未开启"}`);
                        UserInfoService.getSysConfig().then((result) => {
                            window.config.sysConfig = result;
                        });
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
        let that = this;
        this.el.on("click","span.save-proxy",_.debounce(() => {
                that.actions.saveAgent();
        },500)).on("click","input.close-radio",(event) => {
            that.actions.closeSwitch(event);
        }).on("click","input.open-radio",(event) => {
            that.actions.openSwitch(event);
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

// agentSetting.show();


