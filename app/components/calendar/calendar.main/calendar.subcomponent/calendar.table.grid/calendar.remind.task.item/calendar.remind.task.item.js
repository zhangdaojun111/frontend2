/**
 * Created by zj on 2017/8/11.
 */
import Component from "../../../../../../lib/component";
import template from './calendar.remind.task.item.html';
import './calendar.remind.task.item.scss';
import CalendarRemind from '../../../calendar.remind/calendar.remind';
import {PMAPI} from '../../../../../../lib/postmsg';
import MSG from '../../../../../../lib/msgbox';
import Mediator from '../../../../../../lib/mediator';

let config = {
    template: template,
    data: {
        remindTaskData: {},
        remindTaskItemData:{},
        isFinishedTask:false,
        isWaitCheck:true,
        sValue: '',
        sLabel: '',
    },
    actions: {

        changSelectValue: function(sValue, sLabel){
            let oldValue = this.data.remindTaskItemData['data3show'][0][0]['selectValue'];
            let oldLabel = this.data.remindTaskItemData['data3show'][0][0]['selectLabel'];
            let newValue = sValue;
            let newLabel = sLabel;

            let str = '是否将字段 “'+ this.data.remindTaskItemData.selectFieldName +'” 的值由 “'+ oldLabel + '” 改为 “' + newLabel + '”';
            MSG.alert(str).then(res => {
                if(res['confirm']) {
                    //this.actions.reset(tableId);
                    let params = {
                        real_ids: this.data.remindTaskItemData['real_id'],
                        table_id: this.data.remindTaskItemData['tableId'],
                        calendar_id: this.data.remindTaskItemData['setId'],
                        type: 1,
                        data: {},
                    };
                    params['data'][this.data.remindTaskItemData['selectField']] = newValue;
                    params['data'] = JSON.stringify(params['data']);
                    Mediator.emit('CalendarRemindTask: changeData', params);
                }
            });
        },
        openRemind: function () {
            CalendarRemind.data.remindTable = this.data.remindTaskItemData.tableName;
            CalendarRemind.data.remindDateProp = this.data.remindTaskItemData.fieldName;
            CalendarRemind.data.remindDetail = this.data.remindTaskItemData.data2show;
            CalendarRemind.data.remindDateTime = this.data.remindTaskItemData.time;
            CalendarRemind.data.remindTableId = this.data.remindTaskItemData.tableId;
            CalendarRemind.data.remindDate = this.data.remindTaskItemData.time.substr(0,10);
            CalendarRemind.data.remindTime = this.data.remindTaskItemData.time.substr(11,5);
            CalendarRemind.data.remindRealId = this.data.remindTaskItemData.real_id.substr(2,24);
            PMAPI.openDialogByComponent(CalendarRemind, {
                width: '1000',
                height: '600',
                title: '查看',
            }).then(data => {
                console.log(data);
            });
        },

        openWorkflow: function () {
            this.el.find('.task-show-text').html(this.data.remindTaskItemData['data']['name']);
            this.el.on('click', '.task-show-text', () => {
                console.log(this.data.remindTaskItemData);
                PMAPI.openDialogByIframe(`/wf/approval/?record_id=${this.data.remindTaskItemData['data']['id']}&form_id=${this.data.remindTaskItemData['data']['form_id']}&table_id=${this.data.remindTaskItemData['data']['table_id']}&flow_id=${this.data.remindTaskItemData['data']['flow_id']}`,{
                    width:1500,
                    height:1000,
                    // title:"审批工作流",
                    modal:true
                })
            });
        }

    },
    afterRender: function() {
        this.el.find('.task-bg-color').css({backgroundColor: this.data.remindTaskItemData['color']});
        let that = this;
        if(this.data.remindTaskItemData.selectOption) {
            for( let s of this.data.remindTaskItemData.selectOption ){
                if( s.value === this.data.remindTaskItemData['data3show'][0][0]['selectValue'] ){
                    this.el.find('.select-options option').each((item) => {
                        let a = $('.select-options option')[item].value;
                        if(a === s.value) {
                            this.el.find('.select-options option')[item].selected  = 'selected';
                        }
                    });
                }
            }
        }
        if(this.data.remindTaskItemData['type'] === 1) {
            if(this.data.remindTaskItemData['data3show'][0] && this.data.remindTaskItemData['data3show'][0][0]) {
                this.el.find('.task-show-text').html(this.data.remindTaskItemData['data3show'][0][0]['fieldName'] + ':' + this.data.remindTaskItemData['data3show'][0][0]['fieldValue']);
            }
            // else if(this.data.remindTaskItemData['data2show'][0] && this.data.remindTaskItemData['data2show'][0][0]) {
            //     this.el.find('.task-show-text').html(this.data.remindTaskItemData['data2show'][0][0]['fieldName'] + ':' + this.data.remindTaskItemData['data2show'][0][0]['fieldValue']);
            // }
            this.el.on('click', '.task-show-text', () => {
                this.actions.openRemind();
            });
        } else if(this.data.remindTaskItemData['type'] === 2){
            console.log(this.data.remindTaskItemData);
        } else if(this.data.remindTaskItemData['type'] === 3 || this.data.remindTaskItemData['type'] === 4) {
            this.actions.openWorkflow();
        }
        this.el.on('click','.task-state-icon', function() {
            event.stopPropagation();
            if(!$(this).is(".options-show")){
                console.log(that.el.find(".task-state-icon").offset().top);
                that.el.parents(".calendar-main-content").find(".select-options").hide();
                that.el.parents(".calendar-main-content").find(".task-state-icon").removeClass("options-show");
                that.el.find(".select-options").css({"left":that.el.find(".task-state-icon").offset().left - 30,"top":that.el.find(".task-state-icon").offset().top - 70});
                that.el.find(".select-options").show();
                $(this).addClass("options-show");
                // if(that.el.find(".task-item").parent().position().top > 60){
                //     let task_list = that.el.find(".task-item").parents(".task-list");
                //     task_list.scrollTop(task_list.scrollTop()+25);
                // }
            }
            else{
                that.el.find(".select-options").hide();
                $(this).removeClass("options-show");
            }
        }).on('click','.select-options', () => {
            event.stopPropagation();

        }).on('change', '.select-options', () => {
            let sValue = this.el.find('.select-options option:selected').val();
            let sLabel = this.el.find('.select-options option:selected').text();
            this.actions.changSelectValue(sValue, sLabel);
        });
        $(document).click(function(){
            that.el.parents(".calendar-main-content").find(".select-options").hide();
            that.el.parents(".calendar-main-content").find(".task-state-icon").removeClass("options-show");
        });
        this.el.parent(".task-list").scroll(function () {
            that.el.find(".select-options").hide();
            that.el.find(".task-state-icon").removeClass("options-show");
        })


    }
};

class CalendarRemindTaskItem extends Component {
    constructor(data) {
        config.data.remindTaskItemData = data;
        if(data['data3show']) {
            config.data.remindTaskData = data['data3show'][0][0];
        }

        super(config);
    }
}

export default CalendarRemindTaskItem;