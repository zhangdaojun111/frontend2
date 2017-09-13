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
            this.showLoading();
            systemMessageService.getMyMsg(param).then((data) => {
                this.agGrid.actions.setGridData({
                    rowData: data.rows
                });
                this.pagination.actions.setPagination(data.total, param.currentPage);
                this.hideLoading();
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
            // msgbox.confirm('是否将选中的消息标为已审批？').then((res) => {
            //     if (res) {
                    let rows = this.agGrid.gridOptions.api.getSelectedRows();
                    let checkIds = rows.map((item) => {
                        return item.id;
                    });

                    if(checkIds.length === 0){
                        msgbox.alert('请选择至少一条消息进行审批');
                        return;
                    }
                    let url = '/iframe/multiapp';
                    let data = JSON.stringify(checkIds);
                    let that = this;
                    PMAPI.openDialogByIframe(url,{
                        width: 1000,
                        height: 400,
                        title: '批量审批',
                        // customSize:true
                    },data).then(res => {
                        if(res.refresh === true){
                            that.actions.loadData();
                        }
                    });

                    // HTTP.postImmediately('/approve_many_workflow/', {
                    //     checkIds: JSON.stringify(checkIds)
                    // }).then((res) => {
                    //     if (res.success === 1) {
                    //         this.actions.loadData();
                    //     }
                    // });
                // }
            // });
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
                if(data.handle_status_text === '待审批'){
                    data.url += "&btnType=edit";
                }else if(data.handle_status_text === '已取消'){
                    data.url += "&btnType=view";
                }

                PMAPI.openDialogByIframe(data.url, {
                    width: 1200,
                    height: 500,
                    title: data.msg_type_text,
                    customSize:true
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
};

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
        this.el.erdsDialog({
            width: 1298,
            height: 575,
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
    showMessageDetail: function (dialogTitle, msgTitle, msgContent, speak = false) {
        let html = `
            <div class="component-msg-detail">
                <h3>${msgTitle}</h3>
                <div class="text">${msgContent}</div>
            </div>
        `;
        if (speak) {
            let msg = new SpeechSynthesisUtterance(msgTitle.toString() + msgContent.toString());
            msg.lang = 'zh';
            msg.voice = speechSynthesis.getVoices().filter(function(voice) {
                return voice.name == 'Whisper';
            })[0];
            speechSynthesis.speak(msg);
        }
        this.el = $(html).appendTo('body');
        this.el.erdsDialog({
            width: 800,
            height: 600,
            modal: true,
            title: dialogTitle,
            close: function () {
                $(this).dialog('destroy');
            }
        })
    }
};

export {systemMessageUtil};
// systemMessageUtil.show();