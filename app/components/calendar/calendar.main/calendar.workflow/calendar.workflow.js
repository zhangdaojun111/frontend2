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

    //获取工作流信息
    getWorkflowData: function(from_date, to_date){
        this.is_approve_workflow = false;
        this.is_approving_workflow = false;
        this.is_focus_workflow = false;

        //approve
        CalendarService.getWorkflowRecords( {type: 5,"rows":9999,"page":1,"rate_data":1,'from_date':from_date,'to_date':to_date} ).then( res=>{
            this.workflow_approve_data = res.rows;
            this.is_approve_workflow = true;
            this.getWorkflowDataTogether();
        } );
        //approving
        CalendarService.getWorkflowRecords( {type: 2,"rows":9999,"page":1,"rate_data":1,'from_date':from_date,'to_date':to_date} ).then( res=>{
            this.workflow_approving_data = res.rows;
            this.is_approving_workflow = true;
            this.getWorkflowDataTogether();
        } );
        //focus
        CalendarService.getWorkflowRecords( {type: 6,"rows":9999,"page":1,"rate_data":1,'from_date':from_date,'to_date':to_date} ).then( res=>{
            this.workflow_focus_data = res.rows;
            this.is_focus_workflow = true;
            this.getWorkflowDataTogether();
        } );
    },

    //将工作流数据整合到一起
    getWorkflowDataTogether: function(){
        if( this.is_approve_workflow && this.is_approving_workflow && this.is_focus_workflow ){
            let arr = [];
            try{
                arr = this.workflow_approve_data.concat( this.workflow_approving_data );
                arr = arr.concat( this.workflow_focus_data );
            }catch(e){}
            Mediator.emit('CalendarWorkflowData: workflowData', arr);
        }
    }
};