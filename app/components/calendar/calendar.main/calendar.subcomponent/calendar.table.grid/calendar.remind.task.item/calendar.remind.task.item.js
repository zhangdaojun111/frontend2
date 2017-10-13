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
        isNone: false,
        isWaitCheck:true,
        sValue: '',
        sLabel: '',
        type: '',
        isHomeCalendar:false,
    },
    actions: {
        /**
         * @author zj
         * @param sValue
         * @param sLabel
         */
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

        /**
         * @author zj
         * 打开日历提醒
         */
        openRemind: function () {
            let tempData = this.data.remindTaskItemData.data2show[0];
            if(tempData.length > 0) {
                tempData.forEach(item => {
                    if(typeof item['fieldValue'] === "string"){
                        item['fieldValue'] = item['fieldValue'].replace(/(\n)/g, '');
                    }

                })
            }
            console.log(tempData);
            CalendarRemind.data.remindTable = this.data.remindTaskItemData.tableName;
            CalendarRemind.data.remindDateProp = this.data.remindTaskItemData.fieldName;
            CalendarRemind.data.remindDetail = this.data.remindTaskItemData.data2show;
            CalendarRemind.data.remindDateTime = this.data.remindTaskItemData.time;
            CalendarRemind.data.remindTableId = this.data.remindTaskItemData.tableId;
            CalendarRemind.data.remindDate = this.data.remindTaskItemData.time.substr(0,10);
            CalendarRemind.data.remindTime = this.data.remindTaskItemData.time.substr(11,5);
            CalendarRemind.data.remindRealId = this.data.remindTaskItemData.real_id.substr(2,24);
            PMAPI.openDialogByComponent(CalendarRemind, {
                width: '1200',
                height: '640',
                title: '查看',
                //modal: true,
            }).then(data => {
                console.log(data);
            });
        },

        /**
         * @author zj
         * 打开工作流
         */
        openWorkflow: function () {
            console.log(111);
            this.el.find('.task-show-text').html(this.data.remindTaskItemData['data']['name']);
            this.el.on('click', '.task-show-text', () => {
                console.log(this.data.remindTaskItemData);
                PMAPI.openDialogByIframe(`/wf/approval/?record_id=${this.data.remindTaskItemData['data']['id']}&form_id=${this.data.remindTaskItemData['data']['form_id']}&table_id=${this.data.remindTaskItemData['data']['table_id']}&flow_id=${this.data.remindTaskItemData['data']['flow_id']}`,{
                    width: '100%',
                    height: '900',
                    // title:"审批工作流",
                    modal:true,
                    customSize: true,
                })
            });
        }

    },
    binds:[
        {
            event:'click',
            selector:'.task-state-icon',
            callback:function (context) {
                event.stopPropagation();
                if(!$(context).is(".options-show")){
                    this.el.parents(".calendar-main-content").find(".select-options").hide();
                    this.el.parents(".calendar-main-content").find(".task-state-icon").removeClass("options-show");
                    this.el.find(".select-options").show();
                    $(context).addClass("options-show");
                    if(this.el.find(".task-item").parent().position().top > 60){
                        let task_list = this.el.find(".task-item").parents(".task-list");
                        task_list.scrollTop(task_list.scrollTop()+35);
                    }
                }
                else{
                    this.el.find(".select-options").hide();
                    $(context).removeClass("options-show");
                }
            }
        },
        {
            event:'click',
            selector:'.select-options',
            callback:function () {
                event.stopPropagation();
            }
        },
        {
            event:'change',
            selector:'.select-options',
            callback:function(){
                let sValue = this.el.find('.select-options option:selected').val();
                let sLabel = this.el.find('.select-options option:selected').text();
                this.actions.changSelectValue(sValue, sLabel);
            }
        },
        {
            event:'dragstart',
            selector:'.task-item',
            callback:function(context,event){
                if(this.data.type === 'month' && this.data.remindTaskItemData['isDrag'] !== 0) {
                    let ev = event.originalEvent;
                    $(context).addClass("task-item-draggable");
                    ev.dataTransfer.setData("Text",JSON.stringify(this.data.remindTaskItemData));
                    return true;
                }
            }
        }
    ],
    afterRender: function() {
        this.el.addClass("comment-task-item");
        this.el.find('.task-bg-color').css({backgroundColor: this.data.remindTaskItemData['color']});
        let that = this;
        if(this.data.remindTaskItemData.selectOption) {
            for( let s of this.data.remindTaskItemData.selectOption ){
                if( s.value === this.data.remindTaskItemData['data3show'][0][0]['selectValue'] ){
                    let selectOpts = this.el.find('.select-options option');
                    selectOpts.each(item => {
                        let a = selectOpts[item].value;
                        if(a === s.value) {
                            this.el.find('.select-options option')[item].selected  = 'selected';
                        }
                    })
                }
            }
        }
        if(this.data.remindTaskItemData['type'] === 1) {
            // console.log(this.data.remindTaskItemData);
            if(this.data.remindTaskItemData['data3show'][0] && this.data.remindTaskItemData['data3show'][0][0]) {
                for(let i of this.data.remindTaskItemData['data3show'][0]) {
                    if(i['fieldId'] === this.data.remindTaskItemData['selectedRepresents']) {
                        this.el.find('.task-show-text').html(i['fieldName'] + ':' + i['fieldValue']);
                    }
                }
                // this.el.find('.task-show-text').html(this.data.remindTaskItemData['data3show'][0][0]['fieldName'] + ':' + this.data.remindTaskItemData['data3show'][0][0]['fieldValue']);
            }
            this.el.on('click', '.task-show-text', () => {
                this.actions.openRemind();
            });
        } else if(this.data.remindTaskItemData['type'] === 2){
            console.log(this.data.remindTaskItemData);
        } else if(this.data.remindTaskItemData['type'] === 3 || this.data.remindTaskItemData['type'] === 4) {
            // 工作流数据
            this.actions.openWorkflow();
        }

        // this.el.on('dragstart','.task-item',function(ev){
        //     if(that.data.type === 'month' && that.data.remindTaskItemData['isDrag'] !== 0) {
        //         let event = ev.originalEvent;
        //         $(this).addClass("task-item-draggable");
        //         event.dataTransfer.setData("Text",JSON.stringify(that.data.remindTaskItemData));
        //         return true;
        //     }
        // });
        $(document).click(function(){
            that.el.parents(".calendar-main-content").find(".select-options").hide();
            that.el.parents(".calendar-main-content").find(".task-state-icon").removeClass("options-show");
        });
    }
};

class CalendarRemindTaskItem extends Component {
    constructor(data) {
        config.data.remindTaskItemData = data['data'];
        config.data.type = data['type'];
        if(data['data']['data3show']) {
            config.data.remindTaskData = data['data']['data3show'][0][0];
        }
        if(config.data.remindTaskItemData.tableName === "首页日历事件表"){
            config.data.isHomeCalendar = true;
            //config.data.isFinishedTask =  config.data.TestValue.test(config.data.remindTaskData.fieldValue);
            if(config.data.remindTaskData['selectLabel']) {
                let checkText = '已';
                let uncheckText = '未';
                if(config.data.remindTaskData['selectLabel'].indexOf(checkText) >= 0) {
                    config.data.isFinishedTask = true;
                }else if (config.data.remindTaskData['selectLabel'].indexOf(uncheckText) >= 0) {
                    config.data.isFinishedTask = false
                }
            } else {
                config.data.isNone = true;
            }
        }else{
            if(config.data.remindTaskData === undefined) {
                MSG.alert('undefined!该表未设置代表字段');
            }
            if(config.data.remindTaskData['selectLabel']) {
                config.data.isFinishedTask = true;
            } else {
                config.data.isNone = true;
            }
        }
        super(config);
    }
}

export default CalendarRemindTaskItem;