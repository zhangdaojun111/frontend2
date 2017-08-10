/**
 * Created by zj on 2017/7/28.
 */
import Component from "../../../../../lib/component";
import template from './calendar.table.grid.html';
import './calendar.table.grid.scss';

import CalendarRemind from '../../calendar.remind/calendar.remind';

import {PMAPI} from '../../../../../lib/postmsg';

let config = {
    template: template,
    data: {
        bodyData: {},
        itemData: {},
    },
    actions: {

    },
    afterRender: function() {

        if (this.data.type === 'day') {
            this.el.css({display: "inline-block", width: "calc(100% - 1px)", height: "100%"});
            $('.grid-content').css({'max-height': "840px", border: "1px solid #ddd", overflow: "auto"});
            $('.date').remove();
        } else if(this.data.type === 'month') {
            this.el.css({display: "inline-block", width: "calc(100%/7)", height: "100%"});
            $('.task-list').css({'height': "calc(100% - 20px)", overflow: "auto" , width:"100%"});
        } else if (this.data.type === 'week') {
            this.el.css({display: "inline-block", width: "calc((100% - 1px)/7)", height: "100%"});
            $('.grid-content').css({'max-height': "805px", "border-bottom": "1px solid #ddd", overflow: "auto"});
            $('.date').remove();
        }

        let taskData = this.data.bodyData['data'];

        if(taskData && taskData.length > 0) {
            taskData.forEach(item => {
                let taskItemHtml = document.createElement('div');
                taskItemHtml.id = 'task-item';
                taskItemHtml.style.backgroundColor = item['color'];
                if(item['data3show']) {
                    taskItemHtml.innerHTML = item['data3show'][0][0]['fieldName'] + ':' + item['data3show'][0][0]['fieldValue'];
                    taskItemHtml.onclick = function () {
                        let component = new CalendarRemind(item);
                        let el = $('<div>').appendTo(document.body);
                        component.render(el);
                        el.dialog({
                            title: '查看',
                            width: '80%',
                            height: '800',
                            background: '#ddd',
                            close: function() {
                                $(this).dialog('destroy');
                                component.destroySelf();
                            }
                        });
                    };
                }else {
                    taskItemHtml.innerHTML = item['data']['name'];
                    taskItemHtml.onclick = function () {
                        PMAPI.openDialogByIframe(
                            '/wf/approval/',
                            {
                                width: "100%",
                                height: '900',
                                title: '审批',
                            })
                    };

                }
                this.el.find('.task-list').append(taskItemHtml);

            });

        }
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