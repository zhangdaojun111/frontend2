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
import {AutoSelect} from '../../../../components/util/autoSelect/autoSelect';
import '../../../../assets/scss/core/common.scss';
import TreeView from "../../../util/tree/tree";


let config = {
    template:template,
    data:{
        selectedAgent:{},              //记录被选中的代理人
        originData:{},                     //请求到的原始数据
        formatData:[],
        selectedWorkflow:new Set(),        //记录被选中的工作流的id
        isOpen:0,                          //是否开启代理
        atSelect:{},
    },

    actions:{
        /**
         * 获取用户代理设置信息
         */
        initData:function () {
            let that = this;
            UserInfoService.getAgentData().done((result) => {
                this.hideLoading();
                if(result.success === 1){
                    that.data.originData = result;
                    if(result.data.hasOwnProperty('user_id') && result.data.hasOwnProperty('agent_name')){
                        that.data.selectedAgent = {
                            id:result.data.user_id,
                            name:result.data.agent_name
                        };
                    }

                    this.data.isOpen = result.data.is_apply ? 1:0;
                    $.extend(true,this.data.formatData,this.data.originData.data.workflow_list);
                    this.actions.initWorkflow();
                    this.actions.initAgentList();
                    this.actions.initSwitch();
                }else{
                    msgbox.alert("获取数据失败");
                }
            })
        },
        /**
         * 初始化代理流程列表
         */
        initWorkflow:function () {
            this.actions.formatOriginData(this.data.formatData);
            let treeView = new TreeView(this.data.formatData,{
                callback:(event,node) => {
                    this.actions.selectNode(event,node);
                },
                treeType:"MULTI_SELECT",
                treeName:"workflow-tree",
                isSearch:true
            });
            let $container = this.el.find("div.work-tree");
            treeView.render($container);
            this.el.find('.flex-between > .txt').html("流程搜索");
        },
        /**
         * 格式化代理流程数据，使用tree组件进行展示
         * @param nodes
         */
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
                    this.data.selectedWorkflow.add(node.id);
                }
                const children = node.children;
                if ( children && children.length > 0){
                    this.actions.formatOriginData(children);
                }
            }
        },
        /**
         * 初始化代理人列表
         */
        initAgentList:function () {
            let $wrap = this.el.find('.name-list');
            let tempData = [];
            for(let row of this.data.originData.data.user_list){
                if(row.name && row.name.trim() !== '' && row.id && row.id.trim() !== ''){
                    row.py = row.f7_p.join(',');
                    tempData.push(row);
                }
            }
            let that = this;
            let temp = [];
            if( Object.keys(this.data.selectedAgent).length > 0){
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

            this.data.atSelect = autoSelect;
            autoSelect.render($wrap);
        },
        /**
         * 初始化代理开关
         */
        initSwitch:function () {
            if(this.data.isOpen === 1){
                this.el.find('.open-radio').attr("checked",true);
            }else{
                this.el.find('.close-radio').attr("checked",true);
            }
        },
        /**
         * 仅保存被选中的具体工作流（叶子）节点的id，以是否具备group属性判断该节点是否为叶子节点
         * @param event
         * @param node
         */
        selectNode:function (event,node) {
            if(event === 'select'){
                if(node.group && node.nodes && node.nodes.length > 0){
                    this.actions.addNodes(node.nodes);
                }else{
                    this.data.selectedWorkflow.add(node.id);
                }
            }else{
                if(node.group && node.nodes && node.nodes.length > 0){
                    this.actions.removeNodes(node.nodes);
                }else{
                    this.data.selectedWorkflow.delete(node.id);
                }
            }
        },
        /**
         * 节点被勾选时，进行遍历处理
         * @param nodes
         */
        addNodes:function (nodes) {
            for(let i=0; i<nodes.length; i++){
                if(!nodes[i].group){
                    this.data.selectedWorkflow.add(nodes[i].id);
                }else{
                    let children = nodes[i].nodes;
                    if(children && children.length > 0){
                        this.actions.addNodes(children);
                    }
                }
            }
        },
        /**
         * 节点去掉勾选时，进行遍历处理
         * @param nodes
         */
        removeNodes:function (nodes) {
            for(let i=0; i<nodes.length; i++){
                if(!nodes[i].group){
                    this.data.selectedWorkflow.delete(nodes[i].id);
                }else{
                    let children = nodes[i].nodes;
                    if(children && children.length > 0){
                        this.actions.removeNodes(children);
                    }
                }
            }
        },
        /**
         * 设置代理人信息
         * @param agent
         */
        setAgentId:function (agent) {
            if(agent.length > 0){
                this.data.selectedAgent = agent[0];
            }else{
                this.data.selectedAgent = {};
            }
        },
        /**
         * 关闭代理开关
         * @param event
         */
        closeSwitch:function (event) {
            this.data.isOpen = 0;
        },
        /**
         * 打开代理开关
         * @param event
         */
        openSwitch:function (event) {
            this.data.isOpen = 1;
        },
        /**
         * 保存代理设置
         */
        saveAgent:function () {
            //保存代理前进行逻辑判断
            if(Object.keys(this.data.selectedAgent).length === 0 || this.data.selectedAgent.id === ''){
                msgbox.alert("请选择一个代理人");
                return;
            }
            if(this.data.selectedWorkflow.size === 0){
                msgbox.alert("请选择至少一个流程");
                return;
            }
            this.showLoading();
            let workflow_temp = Array.from(this.data.selectedWorkflow);
            let data = {
                workflow_names:workflow_temp,
                agent_id:this.data.selectedAgent.id,
                is_apply:this.data.isOpen
            };

            UserInfoService.saveAgentData(data).done((result) => {
                this.hideLoading();
                if(result.success === 1){
                    if(result.agent_state === 0){
                        msgbox.alert("您所选择的代理人已离职，请重新选择");
                    }else{
                        msgbox.alert(`设置代理成功，目前代理状态为：${this.data.isOpen ? "已开启":"未开启"}`);
                        UserInfoService.getSysConfig().then((result) => {
                            window.config.sysConfig = result;
                        });
                        agentSetting.hide();
                    }
                }else{
                    msgbox.alert("选择代理失败");
                }
            });
        }
    },
    binds:[
        {
            event:'click',
            selector:'.save-proxy',
            callback:_.debounce(function(){
                this.actions.saveAgent();       //保存代理设置
            },500)
        },
        {
            event:'click',
            selector:'.close-radio',
            callback:function (event) {
                this.actions.closeSwitch(event);        //关闭代理
            }
        },
        {
            event:'click',
            selector:'.open-radio',
            callback:function (event) {
                this.actions.openSwitch(event);         //打开代理
            }
        },
    ],
    afterRender:function () {
        this.showLoading();
        this.actions.initData();
    },
    beforeDestory:function () {

    }
};

class SetAgent extends Component{
    constructor(newConfig){
        super($.extend(true,{},config,newConfig));
    }
}

export const agentSetting = {
    el: null,
    show: function() {
        let component = new SetAgent();
        component.dataService = UserInfoService;
        this.el = $('<div class="set-agent-page">').appendTo(document.body);
        component.render(this.el);
        this.el.erdsDialog({
            title: '设置代理',
            width: 915,
            height: 620,
            modal: true,
            close: function() {
                $(this).erdsDialog('destroy');
                component.destroySelf();
            }
        });
    },
    hide: function () {
        this.el.erdsDialog('close');
    }
};



