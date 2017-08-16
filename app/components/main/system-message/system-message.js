import template from './system-message.html';
import './system-message.scss';
import Component from '../../../lib/component';
import agGrid from '../../dataGrid/agGrid/agGrid';
import dataPagination from '../../dataGrid/data-table-toolbar/data-pagination/data-pagination';
import {systemMessageService} from '../../../services/main/systemMessage';
import {PMAPI, PMENUM} from '../../../lib/postmsg';
import msgbox from '../../../lib/msgbox';
import {HTTP} from '../../../lib/http';


let config = {
    template: template,
    actions: {
        loadData: function (_param) {
            _param = _param || {};
            let param = _.defaultsDeep(_param, {
                row: this.pagination.data.rows,
                first: (this.pagination.data.currentPage - 1) * this.pagination.data.rows
            });
            systemMessageService.getMyMsg(param).then((data) => {
                this.agGrid.actions.setGridData({
                    rowData: data.rows
                })
            });
        },
        markRead: function () {
            msgbox.confirm('是否将选中的消息标为已读？').then((res) => {
                if (res) {
                    let rows = this.agGrid.gridOptions.api.getSelectedRows();
                    let checkIds = rows.map((item) => {
                        return item.id;
                    });
                    HTTP.postImmediately('/remark_or_del_msg/', {
                        checkIds: JSON.stringify(checkIds)
                    }).then((res) => {
                        if (res.success === 1) {
                            this.actions.loadData();
                        }
                    });
                }
            });
        },
        batchApprove: function () {
            msgbox.confirm('是否将选中的消息标为已审批？').then((res) => {
                if (res) {
                    let rows = this.agGrid.gridOptions.api.getSelectedRows();
                    let checkIds = rows.map((item) => {
                        return item.id;
                    });
                    HTTP.postImmediately('/approve_many_workflow/', {
                        checkIds: JSON.stringify(checkIds)
                    }).then((res) => {
                        if (res.success === 1) {
                            this.actions.loadData();
                        }
                    });
                }
            });
        },
        batchDelete: function () {
            msgbox.confirm('是否批量删除选中的消息？').then((res) => {
                if (res) {
                    let rows = this.agGrid.gridOptions.api.getSelectedRows();
                    let checkIds = rows.map((item) => {
                        return item.id;
                    });
                    HTTP.postImmediately('/remark_or_del_msg/', {
                        checkIds: JSON.stringify(checkIds),
                        is_del: 1
                    }).then((res) => {
                        if (res.success === 1) {
                            this.actions.loadData();
                        }
                    });
                }
            });
        },
        onPaginationChanged: function (data) {
            this.actions.loadData();
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
        this.pagination.actions.paginationChanged = this.actions.onPaginationChanged;
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