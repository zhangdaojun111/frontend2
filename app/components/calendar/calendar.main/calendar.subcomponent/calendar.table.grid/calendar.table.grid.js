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
    },
    actions: {


    },
    afterRender: function() {
        let that = this;
        let drag_Postion = null;
        if (this.data.type === 'day') {
            this.el.css({display: "inline-block", width: "calc(100% - 1px)", height: "100%"});
            $('.grid-content').css({'max-height': "840px", overflow: "auto"});
            $('.date').remove();
        } else if(this.data.type === 'month') {
            this.el.css({display: "inline-block", width: "calc((100% - 1px)/7)", height: "calc(100% - 1px)"});
            $('.task-list').css({'height': "calc(100% - 20px)", 'overflow-y': "auto",'overflow-x': "hidden" , width:"100%"});
        } else if (this.data.type === 'week') {
            this.el.css({display: "inline-block", width: "calc((100% - 1px)/7)", height: "100%"});
            $('.grid-content').css({'max-height': "805px", "border-bottom": "1px solid #ddd", overflow: "auto"});
            $('.date').remove();
        }
        let taskData = this.data.bodyData['data'];
        if(taskData && taskData.length > 0) {
            this.el.find('.grid-content').css({backgroundColor: "rgba(255, 255, 255, 1)"});
            taskData.forEach(item => {
                this.append(new CalendarRemindTaskItem(item), this.el.find('.task-list'));
            });
        }
        this.el.on('dragenter', '.task-item',function(event){
            drag_Postion = null;
            let ev = event.originalEvent;
            let temp = $(".task-item-draggable").parent();
            if(temp[0] === $(this).parent().prev()[0]){
                $(this).parent().after(temp);
            } else{
                $(this).parent().before(temp);
            }
            drag_Postion = $(this).parent();
            ev.preventDefault();
            return true;
        }).on('dragleave', '.task-list',(event) => {
            if(this.el.find('.task-item').length < 2 ){
                drag_Postion = null;
            }
            let ev = event.originalEvent;
            ev.preventDefault();
            return true;
        }).on('dragover', '.task-list',(event) => {
            let ev = event.originalEvent;
            ev.preventDefault();
            return true;
        }).on('drop','.task-list',(event) => {
            let ev = event.originalEvent;
            let temp = $(".task-item-draggable");
            temp.removeClass("task-item-draggable");
            temp = temp.parent();
            let data = JSON.parse(ev.dataTransfer.getData("Text"));
            console.log(data, this.data.bodyData);
            if(drag_Postion ===null){
                drag_Postion = this.el.find(".task-list");
                drag_Postion.append(temp);
            } else{
                drag_Postion.before(temp);
            }
            drag_Postion = null;
            return false;
        });
        // this.el.on('dragleave', '.task-item',function(event){
        //     if(this === that.el.find('.task-item')[that.el.find('.task-item').length -1]){
        //         let temp = $(".task-item-draggable");
        //         if(temp[0] !==this ){
        //             temp = temp.parent();
        //             $(this).parent().after(temp);
        //             drag_Postion = null;
        //         }
        //     }
        //     let ev = event.originalEvent;
        //     ev.preventDefault();
        //     return true;
        // });

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