import template from './system-message.html';
import './system-message.scss';
import Component from '../../../lib/component';
import agGrid from '../../dataGrid/agGrid/agGrid';
import dataPagination from '../../dataGrid/data-table-toolbar/data-pagination/data-pagination';
import {systemMessageService} from '../../../services/main/systemMessage';



let config = {
    template: template,
    actions: {
        loadData: function () {
            systemMessageService.getMyMsg().then((data) => {
                console.log(data);
                this.agGrid.actions.setGridData({
                    rowData: data.rows
                })
            })
        }
    },
    afterRender: function () {
        let gridDom = this.el.find('.grid');
        this.agGrid = new agGrid();
        this.agGrid.data.columnDefs = systemMessageService.getColumnDefs();
        this.agGrid.render(gridDom);
        this.pagination = new dataPagination({
            page: 1,
            rows: 100
        });
        this.pagination.render(this.el.find('.pagination'));
        this.actions.loadData();
    }
}

class SystemMessage extends Component {

    constructor(data) {
        super(config, data);
    }

}

let systemMessageUtil = {
    el: null,
    show: function () {
        this.el = $("<div>").appendTo('body');
        let systemMessage = new SystemMessage();
        systemMessage.render(this.el);
        this.el.dialog({
            width: 1000,
            height: 600,
            modal: true,
            title: '消息提醒',
            close: function () {
                $(this).dialog('destroy');
                systemMessage.destroySelf();
            }
        })
    },
    hide: function () {

    }
}

export {systemMessageUtil};