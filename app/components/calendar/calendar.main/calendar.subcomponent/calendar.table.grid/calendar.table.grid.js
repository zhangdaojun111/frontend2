/**
 * Created by zj on 2017/7/28.
 */
import Component from "../../../../../lib/component";
import template from './calendar.table.grid.html';
import './calendar.table.grid.scss';
import 'jquery-ui/ui/widgets/droppable';
import 'jquery-ui/ui/widgets/sortable';
import CalendarRemindTaskItem from './calendar.remind.task.item/calendar.remind.task.item';
import Mediator from '../../../../../lib/mediator';
import MSG from '../../../../../lib/msgbox';

let config = {
    template: template,
    data: {
        bodyData: {},
        itemData: {},
        type: '',
        drag_Postion: null,
    },
    actions: {
        /**
         * 拖动进入.task-item排序
         */
        dragEnter: function (event,_this) {
            this.data.drag_Postion = null;
            let ev = event.originalEvent;
            let temp = $(".task-item-draggable").parent();
            if(temp[0] === $(_this).parent().prev()[0]){
                $(_this).parent().after(temp);
            } else{
                $(_this).parent().before(temp);
            }
            this.data.drag_Postion = $(_this).parent();
            ev.preventDefault();
            return true;
        },

        /**
         * 拖动离开.task-list
         */
        dragLeave: function (event) {
            if(this.el.find('.task-item').length < 2 ){
                this.data.drag_Postion = null;
            }
            let ev = event.originalEvent;
            ev.preventDefault();
            return true;
        },

        dragOver: function (event) {
            let ev = event.originalEvent;
            ev.preventDefault();
            return true;
        },

        /**
         * 拖动放在.task-list内
         */
        dragDrop: function (event) {
            let ev = event.originalEvent;
            let temp = $(".task-item-draggable");
            temp.removeClass("task-item-draggable");
            temp = temp.parent();
            if(ev.dataTransfer.getData("Text")) {
                let data = JSON.parse(ev.dataTransfer.getData("Text"));
                let params = {
                    real_ids: data['real_id'],
                    table_id: data['tableId'],
                    calendar_id: data['setId'],
                    data: {}
                };
                params['data'][data['dfield']] = this.data.bodyData['dataTime'];
                params['data'] = JSON.stringify(params['data']);
                Mediator.emit('CalendarDrag: dragRemind', params);
            }
            if(this.data.drag_Postion ===null){
                this.data.drag_Postion = this.el.find(".task-list");
                this.data.drag_Postion.append(temp);
            } else{
                this.data.drag_Postion.before(temp);
            }
            this.data.drag_Postion = null;
            return false;
        },
        /**
         * 循环渲染数据
         */
        newRemindTaskItem:function(firstNum,EndNum){
            let taskData = this.data.bodyData['data'];
            let lastNum = EndNum - firstNum;
            this.data.firstNum = firstNum;
            this.data.EndNum = EndNum;
            if(lastNum > 50){
                lastNum = 50;
            }
            for(let i= 0;i < lastNum;i ++){
                let data = taskData[firstNum + i],
                    remindTaskData = {},
                    isHomeCalendar = false,
                    isFinishedTask = false,
                    isNone = false;
                if(data['data3show']) {
                    remindTaskData = data['data3show'][0][0];
                }
                if(data.tableName === "首页日历事件表"){
                    isHomeCalendar = true;
                    if(remindTaskData['selectLabel']) {
                        let checkText = '已';
                        let uncheckText = '未';
                        if(remindTaskData['selectLabel'].indexOf(checkText) >= 0) {
                            isFinishedTask = true;
                        }else if (remindTaskData['selectLabel'].indexOf(uncheckText) >= 0) {
                            isFinishedTask = false
                        }
                    } else {
                        isNone = true;
                    }
                }else{
                    if(remindTaskData === undefined) {
                        MSG.alert('undefined!该表未设置代表字段');
                    }
                    if(remindTaskData['selectLabel']) {
                        isFinishedTask = true;
                    } else {
                        isNone = true;
                    }
                }

                let calendarRemindTaskItem = new CalendarRemindTaskItem({
                    data: {
                        remindTaskItemData: taskData[firstNum + i],
                        type: this.data.type,
                        remindTaskData: remindTaskData,
                        isHomeCalendar: isHomeCalendar,
                        isFinishedTask: isFinishedTask,
                        isNone: isNone,
                    }
                });
                this.append(calendarRemindTaskItem, this.el.find('.task-list'));
                // this.append(new CalendarRemindTaskItem({data:taskData[firstNum + i], type: this.data.type}), this.el.find('.task-list'));
            }
            this.data.firstNum += 50;
        },
    },
    binds:[
        //拖动进入.task-item排序
        {
            event:'dragenter',
            selector:'.task-item',
            callback:function(context,event){
                this.actions.dragEnter(event,context);
            }
        },
        //拖动离开.task-list
        {
            event:'dragleave',
            selector:'.task-list',
            callback:function(context,event){
                this.actions.dragLeave(event);
            }
        },
        {
            event:'dragover',
            selector:'.task-list',
            callback:function(context,event){
                this.actions.dragOver(event);
            }
        },
        //拖动放在.task-list内
        {
            event:'drop',
            selector:'.task-list',
            callback:function(context,event){
                this.actions.dragDrop(event);
            }
        },

    ],
    afterRender: function() {

        // 不同视图下添加样式
        if (this.data.type === 'day') {
            this.el.addClass("item-td-col-day");
            $('.date').remove();
        } else if(this.data.type === 'month') {
            this.el.addClass("item-td-col-month");
        } else if (this.data.type === 'week') {
            this.el.addClass("item-td-col-week");
            this.el.find('.task-list').addClass('week-task-list');
            $('.date').remove();
        }
        //滚动条滚动 动态加载过大数据
        let that = this;
        // 给对应日历棋盘格创建提醒数据
        let taskData = this.data.bodyData['data'];
        if(taskData && taskData.length > 0) {
            this.el.find('.grid-content').css({backgroundColor: "rgba(255, 255, 255, 1)"});
            // taskData.forEach(item => {
            //     this.append(new CalendarRemindTaskItem({data:item, type: this.data.type}), this.el.find('.task-list'));
            // });
            if(taskData.length >= 50){
                this.el.find('.task-list').scroll(function() {
                    let divHeight = $(this).height();
                    let nScrollHeight = $(this)[0].scrollHeight;
                    let scrollTop = $(this)[0].scrollTop;
                    if(scrollTop + divHeight >= nScrollHeight) {
                        if(that.data.firstNum < that.data.EndNum){
                            that.actions.newRemindTaskItem(that.data.firstNum,that.data.EndNum);
                        }
                    }
                });
            }
            this.actions.newRemindTaskItem(0,taskData.length);
        }
    }
};

// class TableGrid extends Component {
//     constructor(data, newconfig = {}) {
//         config.data.bodyData = data['bodyData'];
//         config.data.type = data.type;
//         super($.extend(true ,{}, config, newconfig));
//     }
// }
//
// export default TableGrid;
let TableGrid = Component.extend(config);

export default TableGrid;