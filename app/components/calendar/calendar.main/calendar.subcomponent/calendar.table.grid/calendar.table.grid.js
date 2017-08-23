/**
 * Created by zj on 2017/7/28.
 */
import Component from "../../../../../lib/component";
import template from './calendar.table.grid.html';
import './calendar.table.grid.scss';;
import 'jquery-ui/ui/widgets/droppable';
import 'jquery-ui/ui/widgets/sortable';
import CalendarRemindTaskItem from './calendar.remind.task.item/calendar.remind.task.item';
import Mediator from '../../../../../lib/mediator';

let config = {
    template: template,
    data: {
        bodyData: {},
        itemData: {},
        type: '',
        drag_Postion: null,
    },
    actions: {
        dragEnter: function (event) {
            this.data.drag_Postion = null;
            let ev = event.originalEvent;
            let temp = this.el.find(".task-item-draggable").parent();
            if(temp[0] === $(this).parent().prev()[0]){
                $(this).parent().after(temp);
            } else{
                $(this).parent().before(temp);
            }
            this.data.drag_Postion = $(this).parent();
            ev.preventDefault();
            return true;
        },

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

        dragDrop: function (event) {
            let ev = event.originalEvent;
            let temp = $(".task-item-draggable");
            temp.removeClass("task-item-draggable");
            temp = temp.parent();
            if(ev.dataTransfer.getData("Text")) {
                let data = JSON.parse(ev.dataTransfer.getData("Text"));
                console.log(data, this.data.bodyData);
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
        }

    },
    afterRender: function() {
        let that = this;
        //let drag_Postion = null;

        // 不同视图下添加样式
        if (this.data.type === 'day') {
            this.el.addClass("item-td-col-day");
            $('.date').remove();
        } else if(this.data.type === 'month') {
            this.el.addClass("item-td-col-month");
        } else if (this.data.type === 'week') {
            this.el.addClass("item-td-col-week");
            $('.date').remove();
        }

        // 给对应日历棋盘格创建提醒数据
        let taskData = this.data.bodyData['data'];
        if(taskData && taskData.length > 0) {
            this.el.find('.grid-content').css({backgroundColor: "rgba(255, 255, 255, 1)"});
            taskData.forEach(item => {
                this.append(new CalendarRemindTaskItem({data:item, type: this.data.type}), this.el.find('.task-list'));
            });
        }

        // 日历提醒的拖动设置
        this.el.on('dragenter', '.task-item',function(event){
            that.actions.dragEnter(event);
        }).on('dragleave', '.task-list',(event) => {
            that.actions.dragLeave(event);
        }).on('dragover', '.task-list',(event) => {
            that.actions.dragOver(event);
        }).on('drop','.task-list',(event) => {
            that.actions.dragDrop(event);
        });
    }
};

class TableGrid extends Component {
    constructor(data) {
        config.data.bodyData = data['bodyData'];
        config.data.type = data.type;
        super(config);
    }
}

export default TableGrid;