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
    },
    actions: {

    },
    afterRender: function() {

        this.el.find('.task-bg-color').css({backgroundColor: this.data['color']});
        
        if(this.data['data3show']) {
            this.el.find('.task-show-text').html(this.data['data3show'][0][0]['fieldName'] + ':' + this.data['data3show'][0][0]['fieldValue']);
            this.el.on('click', '.task-show-text', () => {
                console.log(this.data);
                CalendarRemind.data.remindTable = this.data.tableName;
                CalendarRemind.data.remindDateProp = this.data.fieldName;
                CalendarRemind.data.remindDetail = this.data.data2show;
                CalendarRemind.data.remindDateTime = this.data.time;
                CalendarRemind.data.remindTableId = this.data.tableId;
                CalendarRemind.data.remindDate = this.data.time.substr(0,10);
                CalendarRemind.data.remindTime = this.data.time.substr(11,5);
                PMAPI.openDialogByComponent(CalendarRemind, {
                    width: '1000',
                    height: '600',
                    title: '查看',
                }).then(data => {
                    console.log(data);
                });
            });

        }else {
            this.el.find('.task-show-text').html(this.data['data']['name']);
            this.el.on('click', '.task-show-text', () => {
                console.log(this.data);
                PMAPI.openDialogByIframe(`/wf/approval/?record_id=${this.data['data']['id']}&form_id=${this.data['data']['form_id']}&table_id=${this.data['data']['table_id']}&flow_id=${this.data['data']['flow_id']}`,{
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
        config.data = data;
        super(config);
    }
}

export default CalendarRemindTaskItem;