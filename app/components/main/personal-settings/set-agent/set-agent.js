import Component from '../../../../lib/component';
import 'jquery-ui/themes/base/base.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/ui/widgets/dialog.js';
import './set-agent.scss';
import template from './set-agent.html';
import {UserInfoService} from "../../../../services/main/userInfoService"
import msgbox from "../../../../lib/msgbox";

import treeView from "../../../../components/util/tree/tree"


let config = {
    template:template,
    data:{},

    originData:null,            //请求到的原始数据
    workflowList:null,          //工作流数据
    agentList:null,             //代理人数据

    selectWorkflow:null,        //记录被选中的工作流
    selectAgent:null,           //记录被选中的代理人
    isOpen:false,               //是否开启代理，默认否

    actions:{
        initData:function () {
            UserInfoService.getAgentData()
                .done((result) => {
                    console.log(result);
                    if(result.success === 1){
                        this.originData = result;
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
            let iframe

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
            width: 920,
            height: 620,
            close: function() {
                component.destroySelf();
            }
        });
    }
}