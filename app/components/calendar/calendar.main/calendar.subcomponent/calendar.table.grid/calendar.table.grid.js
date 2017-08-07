/**
 * Created by zj on 2017/7/28.
 */
import Component from "../../../../../lib/component";
import template from './calendar.table.grid.html';
import './calendar.table.grid.scss';

let config = {
    template: template,
    data: {
        bodyData: Object,
        type: '',
    },
    actions: {

    },
    afterRender: function() {

        if (this.data.type === 'day') {
            this.el.css({display: "inline-block", width: "calc(100% - 1px)", height: "100%"});
            $('.grid-content').css({'max-height': "840px", border: "1px solid #ddd", overflow: "auto"});
        } else if(this.data.type === 'month') {
            this.el.css({display: "inline-block", width: "calc(100%/7)", height: "100%"});
            $('.task-list').css({'height': "calc(100% - 20px)", overflow: "auto" , width:"100%"});
        } else if (this.data.type === 'week') {
            this.el.css({display: "inline-block", width: "calc((100% - 1px)/7)", height: "100%"});
            $('.grid-content').css({'max-height': "805px", "border-bottom": "1px solid #ddd", overflow: "auto"});
        }
        let taskData = this.data.bodyData['data'];
        if(taskData.length > 0) {
            taskData.forEach(item => {
                let taskItemHtml = document.createElement('div');
                taskItemHtml.id = 'task-item';
                taskItemHtml.style.overflow = "hidden";
                taskItemHtml.style.whiteSpace = "nowrap";
                taskItemHtml.style.backgroundColor = item['color'];
                taskItemHtml.innerHTML = item['data3show'][0][0]['fieldName'] + ':' + item['data3show'][0][0]['fieldValue'];
                this.el.find('.task-list').append(taskItemHtml);
                taskItemHtml.onclick = function () {
                    console.log(item['tableId']);
                }
            });

        }
    }
};

class TableGrid extends Component {
    constructor(data) {
        config.data.headData = data['headTitle'];
        config.data.bodyData = data['bodyData'];
        config.data.type = data.type;
        super(config);
    }
}

export default TableGrid;