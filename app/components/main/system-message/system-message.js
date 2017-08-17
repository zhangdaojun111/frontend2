/**
 * @author xiongxiaotao
 * 打开系统消息
 */
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
                rows: this.pagination.data.rows,
                first: (this.pagination.data.currentPage - 1) * this.pagination.data.rows,
                currentPage: this.pagination.data.currentPage
            });
            console.log(this.pagination.data.currentPage);
            systemMessageService.getMyMsg(param).then((data) => {
                this.agGrid.actions.setGridData({
                    rowData: data.rows
                });
                this.pagination.actions.setPagination(data.total, param.currentPage);
            });
        },
        markRead: function () {
            msgbox.confirm('是否将选中的消息标为已读？').then((res) => {
                if (res) {
                    let rows = this.agGrid.gridOptions.api.getSelectedRows();
                    let checkIds = rows.map((item) => {
                        return item.id;
                    });
                    this.actions._postReadData(JSON.stringify(checkIds));
                }
            });
        },
        _postReadData: function (ids) {
            HTTP.postImmediately('/remark_or_del_msg/', {
                checkIds: ids
            }).then((res) => {
                if (res.success === 1) {
                    this.actions.loadData();
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
            this.actions.loadData(data);
        },
        onCellClicked: function ($event) {
            let data = $event.data;
            if (data.msg_type === 3 || data.msg_type === 0) {
                PMAPI.openDialogByIframe(data.url, {
                    width: 1200,
                    height: 800,
                    title: data.msg_type_text
                })
            } else {
                systemMessageUtil.showMessageDetail(data.msg_type_text, data.title, data.msg_content);
            }
            this.actions._postReadData(JSON.stringify([data.id]));
        }
    },
    afterRender: function () {
        let gridDom = this.el.find('.grid');
        let that = this;
        this.agGrid = new agGrid({
            columnDefs: systemMessageService.getColumnDefs(),
            onCellClicked: that.actions.onCellClicked
        });
        this.agGrid.render(gridDom);
        this.pagination = new dataPagination({
            page: 1,
            rows: 10
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

    },
    showMessageDetail: function (dialogTitle, msgTitle, msgContent) {
        let html = `
            <div class="component-msg-detail">
                <h3>${msgTitle}</h3>
                <div class="text">${msgContent}</div>
            </div>
        `;
        this.el = $(html).appendTo('body');
        this.el.dialog({
            width: 800,
            height: 600,
            modal: true,
            title: dialogTitle,
            close: function () {
                $(this).dialog('destroy');
            }
        })
    }
}

export {systemMessageUtil};
// systemMessageUtil.show();