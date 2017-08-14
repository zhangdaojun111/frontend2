import template from './system-message.html';
import './system-message.scss';
import Component from '../../../lib/component';
import agGrid from '../../dataGrid/agGrid/agGrid';
import dataPagination from '../../dataGrid/data-table-toolbar/data-pagination/data-pagination';
import {systemMessageService} from '../../../services/main/systemMessage';
import {PMAPI, PMENUM} from '../../../lib/postmsg';
import msgbox from '../../../lib/msgbox';


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
        },
        markRead: function () {
            console.log(this);
            msgbox.confirm('是否将选中的消息标为已读？').then(() => {
                let rows = this.agGrid.gridOptions.api.getSelectedRows();
                console.log(rows);
            });
        }
    },
    afterRender: function () {
        let gridDom = this.el.find('.grid');
        this.agGrid = new agGrid({
            columnDefs: systemMessageService.getColumnDefs(),
            onCellClicked: function ($event) {
                let data = $event.data;
                PMAPI.openDialogByIframe(data.url, {
                    width: 1200,
                    height: 800,
                    title: data.title
                })
            }
        });
        this.agGrid.render(gridDom);
        this.pagination = new dataPagination({
            page: 1,
            rows: 100
        });
        this.pagination.render(this.el.find('.pagination'));
        this.actions.loadData();
    },
    firstAfterRender: function () {
        this.el.on('click', '.markRead', () => {
            this.actions.markRead();
        }).on('click', '.batchApprove', () => {
            this.actions.batchApprove();
        }).on('click', '.batchDelete', () => {
            this.actions.batchDelete();
        })
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
            width: 1200,
            height: 800,
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