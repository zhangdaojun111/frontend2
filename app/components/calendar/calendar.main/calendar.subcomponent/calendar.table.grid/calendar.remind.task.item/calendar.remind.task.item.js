/**
 * Created by zj on 2017/8/11.
 */
import Component from "../../../../../../lib/component";
import template from './calendar.remind.task.item.html';
import './calendar.remind.task.item.scss';
import CalendarRemind from '../../../calendar.remind/calendar.remind';
import {PMAPI} from '../../../../../../lib/postmsg';

let config = {
    template: template,
    data: {
        remindTaskData: {},
        remindTaskItemData:{},
        isFinishedTask:false,
        isWaitCheck:true,
    },
    actions: {
    },
    afterRender: function() {
        console.log(this.data.remindTaskItemData);
        this.el.find('.task-bg-color').css({backgroundColor: this.data.remindTaskItemData['color']});
        if(this.data.remindTaskData === "已完成") {
            this.data.isFinishedTask = true;
        }else if(this.data.remindTaskData === "待完成"){
            this.data.isWaitCheck = true;
        }
        if(this.data.remindTaskItemData['data3show']) {
            this.el.find('.task-show-text').html(this.data.remindTaskItemData['data3show'][0][0]['fieldName'] + ':' + this.data.remindTaskItemData['data3show'][0][0]['fieldValue']);
            this.el.on('click', '.task-item', () => {
                CalendarRemind.data.remindTable = this.data.remindTaskItemData.tableName;
                CalendarRemind.data.remindDateProp = this.data.remindTaskItemData.fieldName;
                CalendarRemind.data.remindDetail = this.data.remindTaskItemData.data2show;
                CalendarRemind.data.remindDateTime = this.data.remindTaskItemData.time;
                CalendarRemind.data.remindTableId = this.data.remindTaskItemData.tableId;
                CalendarRemind.data.remindDate = this.data.remindTaskItemData.time.substr(0,10);
                CalendarRemind.data.remindTime = this.data.remindTaskItemData.time.substr(11,5);
                PMAPI.openDialogByComponent(CalendarRemind, {
                    width: '1000',
                    height: '600',
                    title: '查看',
                }).then(data => {
                    console.log(data);
                });
            });

        }else {
            this.el.find('.task-show-text').html(this.data.remindTaskItemData['data']['name']);
            this.el.on('click', '.task-item', () => {
                console.log(this.data.remindTaskItemData);
                PMAPI.openDialogByIframe(`/wf/approval/?record_id=${this.data.remindTaskItemData['data']['id']}&form_id=${this.data.remindTaskItemData['data']['form_id']}&table_id=${this.data.remindTaskItemData['data']['table_id']}&flow_id=${this.data.remindTaskItemData['data']['flow_id']}`,{
                    width:1500,
                    height:1000,
                    // title:"审批工作流",
                    modal:true
                })
            })
        }
    }
};

class CalendarRemindTaskItem extends Component {
    constructor(data) {
        config.data.remindTaskItemData = data;
        config.data.remindTaskData = data['data3show'][0][0].fieldValue;
        super(config);
    }
}

export default CalendarRemindTaskItem;