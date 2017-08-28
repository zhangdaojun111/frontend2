/**
 * @author qiumaoyun
 * 新增、查看、编辑工作流
 */

import Component from '../../../lib/component';
import template from './add-workflow.html';
import '../approval-workflow/approval-workflow.scss';
import './add-workflow.scss';
import Mediator from '../../../lib/mediator';
import WorkFlow from '../workflow-drawflow/workflow';
import {workflowService} from '../../../services/workflow/workflow.service';
import {FormService} from "../../../services/formService/formService"
import msgBox from '../../../lib/msgbox';
import {PMAPI,PMENUM} from '../../../lib/postmsg';
import SettingPrint from '../../form/setting-print/setting-print'

let config={
    template: template,
    data:{

    },
    actions:{
        async printSetting(){
            let res = await FormService.getPrintSetting()
            // if(res.succ == 1){
            SettingPrint.data['key'] = this.data.key;
            if (res.data && res.data.length && res.data.length != 0) {
                SettingPrint.data['printTitles'] = res['data'];
                SettingPrint.data['myContent'] = res['data'][0]['content'] || '';
                SettingPrint.data['selectNum'] = parseInt(res['data']['index']) || 1;
            }
            PMAPI.openDialogByComponent(SettingPrint, {
                width: 500,
                height: 300,
                title: '自定义页眉',
                modal: true
            })
        }
    },
    afterRender(){
        let _this=this;
        Mediator.subscribe('workflow:getKey', (msg)=> {
            this.data.key=msg;
        });
        Mediator.subscribe('workflow:gotWorkflowInfo', (msg)=> {
            this.data.workflowData=msg.data[0];
            WorkFlow.show(msg.data[0],'#drawflow');
        });
        Mediator.subscribe('workflow:getParams', (res)=> {
            let htmlStr=``;
            for(var i in res){
                htmlStr+=`<option data-default=${res[i].selected} data-flow_id=${res[i].flow_id} data-form_id=${res[i].form_id}>${res[i].flow_name}</option>`;
            }
            this.el.find('#wf-select').html(htmlStr);
            this.el.find('#wf-select').on('change',()=>{
                let o={};
                o.flow_id=this.el.find('#wf-select option:selected').data('flow_id');
                o.form_id=this.el.find('#wf-select option:selected').data('form_id');
                Mediator.publish('workflow:getflows', o);
            }).trigger('change');
        });
        this.el.find('#subAddworkflow').on('click',()=>{
            Mediator.publish('workflow:submit', 1);
        });
        this.el.find('#subAddworkflow').on('click',()=>{
            Mediator.publish('workflow:submit', 1);
        });
        this.el.on('click','#toEdit',()=>{
            location.href=location.href.replace(/=view/,'=edit').replace(/is_view=1/,'is_view=0');
        });
    }
};
class AddWorkflow extends Component{
    constructor (data){
        super(config,data);
    }
}

let component = new AddWorkflow();
let el = $('#add-wf');
component.render(el);
