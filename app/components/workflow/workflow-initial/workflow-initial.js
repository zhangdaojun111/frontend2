/**
 *@author qiumaoyun
 *发起工作流page body
 */
import Component from '../../../lib/component';
import template from './workflow-initial.html';
import './workflow-initial.scss';
import {
    HTTP
} from '../../../lib/http';
import '../../../assets/scss/workflow/workflow-base.scss';
import Mediator from '../../../lib/mediator';
// import WorkflowAddFollow from '../workflow-addFollow/workflow-addFollow/workflow-addFollow';
import WorkFlowCreate from '../workflow-create/workflow-create';
import TreeView from '../../util/tree/tree';
import {
    PMAPI,
    PMENUM
} from '../../../lib/postmsg';
import {
    workflowService
} from '../../../services/workflow/workflow.service';

let config = {
    template: template,
    data: {
        user: [],
        allowagrid: true, //允许agrid只加载一次,
        nameArr: [], //关注人姓名
        idArr: [], //关注人id
        htmlStr: [] // 关注人添加的html代码
    },
    actions: {
        /*
         ***获取所有工作流与常用工作流
         */
        get_workflow_info() {
            let WorkFlowList = workflowService.getWorkfLow({}),
                FavWorkFlowList = workflowService.getWorkfLowFav({});
            Promise.all([WorkFlowList, FavWorkFlowList]).then(res => {
                let obj = {};
                obj.tree = res[0];
                obj.fav = res[1];
                WorkFlowCreate.loadData(obj);
            });
            HTTP.flush();
        }
    },
    afterRender() {

        this.actions.get_workflow_info();
        this.el.on('click', '#workflowClose', () => {
                Mediator.publish("workflow:contentClose");
                this.el.find('.J_select-Workflow').text("选择或输入查找");
                this.el.find("#workflow-box").show();
                this.el.find('#workflow-content').hide();
            }),
            this.el.on('click', '#singleFlow', (e) => {
                let ev = $(e.target);
                ev.addClass("selected");
                this.el.find("#multiFlow").removeClass("selected");
                Mediator.publish('workflow:autoSaveOpen', 1);
                this.el.find('#workflow-form').show();
                this.el.find('#workflow-grid').hide();
            });
        this.el.on('click', '#multiFlow', (e) => {
            let ev = $(e.target);
            ev.addClass("selected");
            this.el.find("#singleFlow").removeClass("selected");
            Mediator.publish('workflow:autoSaveOpen', 0);
            if (this.data.allowagrid) {
                Mediator.publish('workflow:getGridinfo');
                this.data.allowagrid = false;
            }
            this.el.find('#workflow-grid').show();
            this.el.find('#workflow-form').hide();
        });
        this.el.on('click', '#submitWorkflow', () => {
            Mediator.publish('workflow:submit', this.data.user);
        });
        Mediator.subscribe('workflow:choose', (res) => {
            this.data.allowagrid = true;
            //清空关注人列表
            this.data.nameArr = [];
            this.data.htmlStr =  [];
            this.data.idArr = [];
            this.data.user = [];
            this.el.find('#addFollowerList').empty();
        })
        this.el.on('click', '#addFollower', () => {
            PMAPI.openDialogByIframe(`/iframe/addfocus/`, {
                width: 800,
                height: 620,
                title: `添加关注人`,
                modal: true
            },{
                users:this.data.user
            }).then(res => {
                if (!res.onlyclose) {
                    this.data.htmlStr = [];
                    for (let k in res) {
                        this.data.nameArr.push(res[k]);
                        this.data.htmlStr.push(`<span class="selectSpan">${res[k]}</span>`);
                        this.data.idArr.push(k);
                    }
                    this.el.find('#addFollowerList').html(this.data.htmlStr);
                    this.data.user=res;
                }
            })
        });
    }
};
class WorkflowInitial extends Component {
    // constructor(data) {
    //     super(config, data);
    // }
    constructor(data,newConfig){
        super($.extend(true,{},config,newConfig,{data:data||{}}));
    }
}
export default WorkflowInitial;
