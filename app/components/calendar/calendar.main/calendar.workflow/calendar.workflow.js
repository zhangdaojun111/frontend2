/**
 * Created by zj on 2017/8/13.
 */

import {CalendarService} from '../../../../services/calendar/calendar.service';
import Mediator from '../../../../lib/mediator'

export const CalendarWorkflowData = {
    //现在显示的状态
    currentType: '',
    //待审批工作
    workflow_approve_data: [],
    is_approve_workflow: false,
    //申请中工作
    workflow_approving_data: [],
    is_approving_workflow: false,
    //关注工作
    workflow_focus_data: [],
    is_focus_workflow: false,

    // 审批完成的
    workflowFinishedData: [],

    // 全部工作
    allWorkflow: [],

    /**
     * 获取工作流数据
     * @param from_date
     * @param to_date
     */
    getWorkflowData: function(from_date, to_date){
        this.is_approve_workflow = false;
        this.is_approving_workflow = false;
        this.is_focus_workflow = false;

        let workData = CalendarService.getWorkflowRecords({'from_date':from_date,'to_date':to_date});

        // 待审批
        workData[0].then(res => {
            if(res) {
                this.workflow_approve_data = res['rows'];
                this.is_approve_workflow = true;
                this.getWorkflowDataTogether();
            }
        });

        // 审批中
        workData[1].then(res => {
            if(res) {
                this.workflow_approving_data = res['rows'];
                this.is_approving_workflow = true;
                this.getWorkflowDataTogether();
            }
        });

        // 我关注的
        workData[2].then(res => {
            if(res) {
                this.workflow_focus_data = res['rows'];
                this.is_focus_workflow = true;
                this.getWorkflowDataTogether();
            }
        });

        // 我发起并完成的
        workData[3].then(res => {
            if(res) {
                this.workflowFinishedData = res['rows'];
                Mediator.emit('CalendarFinishedWorkflowData: workflowData', this.workflowFinishedData);
            }
        });
    },

    /**
     * 整合工作流数据
     * @returns {Array}
     */
    getWorkflowDataTogether: function(){
        if( this.is_approve_workflow && this.is_approving_workflow && this.is_focus_workflow ){
            let arr = [];
            try{
                arr = this.workflow_approve_data.concat( this.workflow_approving_data );
                arr = arr.concat( this.workflow_focus_data );
            }catch(e){}
            this.allWorkflow = arr;
            Mediator.emit('CalendarWorkflowData: workflowData', arr);
            return arr;
        }
    },

    searchWorkflow: function (keyWord) {
        if(keyWord !== '') {
            let searchResult = this.allWorkflow.filter(item => {
                return item.name.indexOf(keyWord)>= 0;
            });
            Mediator.emit('CalendarWorkflowData: workflowData', searchResult);
        } else {
            Mediator.emit('CalendarWorkflowData: workflowData', this.allWorkflow);
        }
    },

    getAllWorkflow: function () {
        return this.allWorkflow;
    }
};