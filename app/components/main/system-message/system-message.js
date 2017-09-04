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
    data:{
        test_data:{"succ": 1, "code": 200, "data": {"erds-1504502937272": {"total": 19, "succ": 0, "rows": [{"msg_type_text": "\u5173\u6ce8\u6d88\u606f", "msg_type": 3, "is_read": 0, "create_time": "2017-09-04 10:47:17", "handle_status_text": "\u5176\u4ed6", "id": "59acbeb5d8e9e40851b963bb", "form_id": 158, "publisher": "\u90b1\u8302\u8018", "handle_status": 7, "title": "\u5173\u6ce8\u6d88\u606f\u901a\u77e5", "url": "/wf/approval/?record_id=59acbeb5c9d095946c30b2ea&table_id=9265_J94BXH6pF7ZZTSAPtczh68&form_id=158&flow_id=12", "msg_content": "\u60a8\u6709\u4e00\u6761\u9700\u5173\u6ce8\u7684\u5de5\u4f5c\uff0c\u5de5\u4f5c\u3010\u90b1\u8302\u8018 \u3010\u738b\u8fea\u6d4b\u8bd5\u6d41\u7a0b3\u3011\u65b0\u5efa\uff08\u666e\u901a\uff09\u3011\u521b\u5efa\u540e\u5df2\u76f4\u63a5\u7ed3\u675f", "record_status": 0, "flow_id": 12, "record_id": "59acbeb5c9d095946c30b2ea"}, {"msg_type_text": "\u63a8\u9001\u6d88\u606f", "msg_type": 4, "is_read": 0, "create_time": "2017-09-01 16:05:25", "handle_status_text": "\u5176\u4ed6", "id": "59a914c5d8e9e40839b963a3", "form_id": 0, "publisher": "\u7ba1\u7406\u5458", "handle_status": 7, "title": "222", "url": "", "msg_content": "2222", "record_status": 0, "flow_id": 0, "record_id": 0}, {"msg_type_text": "\u63a8\u9001\u6d88\u606f", "msg_type": 4, "is_read": 0, "create_time": "2017-09-01 16:05:04", "handle_status_text": "\u5176\u4ed6", "id": "59a914b0d8e9e4083db9639d", "form_id": 0, "publisher": "\u7ba1\u7406\u5458", "handle_status": 7, "title": "11", "url": "", "msg_content": "111", "record_status": 0, "flow_id": 0, "record_id": 0}, {"msg_type_text": "\u63a8\u9001\u6d88\u606f", "msg_type": 4, "is_read": 0, "create_time": "2017-08-30 14:27:44", "handle_status_text": "\u5176\u4ed6", "id": "59a65ae0d8e9e40847b96365", "form_id": 0, "publisher": "\u7ba1\u7406\u5458", "handle_status": 7, "title": "\u591a\u4e00\u6761\u4e5f\u65e0\u6240\u8c13\u5427", "url": "", "msg_content": "\u591a\u4e00\u6761\u4e5f\u65e0\u6240\u8c13\u5427", "record_status": 0, "flow_id": 0, "record_id": 0}, {"msg_type_text": "\u63a8\u9001\u6d88\u606f", "msg_type": 4, "is_read": 0, "create_time": "2017-08-30 14:27:24", "handle_status_text": "\u5176\u4ed6", "id": "59a65accd8e9e40849b96365", "form_id": 0, "publisher": "\u7ba1\u7406\u5458", "handle_status": 7, "title": "\u518d\u6765\u4e00\u6761", "url": "", "msg_content": "\u518d\u6765\u4e00\u6761", "record_status": 0, "flow_id": 0, "record_id": 0}, {"msg_type_text": "\u63a8\u9001\u6d88\u606f", "msg_type": 4, "is_read": 0, "create_time": "2017-08-30 14:27:03", "handle_status_text": "\u5176\u4ed6", "id": "59a65ab7d8e9e40840b96360", "form_id": 0, "publisher": "\u7ba1\u7406\u5458", "handle_status": 7, "title": "15\u6761\uff0c\u53ea\u898115\u6761", "url": "", "msg_content": "\u4e0d\u591a\u4e0d\u5c11\u6b63\u597d15\u6761", "record_status": 0, "flow_id": 0, "record_id": 0}, {"msg_type_text": "\u5173\u6ce8\u6d88\u606f", "msg_type": 3, "is_read": 1, "create_time": "2017-08-25 14:07:37", "handle_status_text": "\u5176\u4ed6", "id": "599fbea9d8e9e408f7c1afd9", "form_id": 181, "publisher": "\u6587\u6676\u6676", "handle_status": 7, "title": "\u5173\u6ce8\u6d88\u606f\u901a\u77e5", "url": "/wf/approval/?record_id=599bdb325700e9eeb23029fb&table_id=5318_EHFuJD7Ae76c6GMPtzdiWH&form_id=181&flow_id=43", "msg_content": "\u60a8\u6709\u4e00\u6761\u9700\u8981\u5173\u6ce8\u7684\u5de5\u4f5c\u738b\u8fea \u3010\u738b\u8fea\u6d4b1\u8bd5\u6d41\u7a0b2\u3011\u65b0\u5efa\uff08\u666e\u901a\uff09,\u5df2\u88ab\u6587\u6676\u6676\u5ba1\u6279\u3002\u8fdb\u5165\u4e0b\u4e00\u7ea7\u5ba1\u6838", "record_status": 0, "flow_id": 43, "record_id": "599bdb325700e9eeb23029fb"}, {"msg_type_text": "\u5173\u6ce8\u6d88\u606f", "msg_type": 3, "is_read": 1, "create_time": "2017-08-25 14:07:36", "handle_status_text": "\u5176\u4ed6", "id": "599fbea8d8e9e408f3c1b1e7", "form_id": 181, "publisher": "\u6587\u6676\u6676", "handle_status": 7, "title": "\u5173\u6ce8\u6d88\u606f\u901a\u77e5", "url": "/wf/approval/?record_id=599bda43060ba3e2ecda3f50&table_id=5318_EHFuJD7Ae76c6GMPtzdiWH&form_id=181&flow_id=43", "msg_content": "\u60a8\u6709\u4e00\u6761\u9700\u8981\u5173\u6ce8\u7684\u5de5\u4f5c\u738b\u8fea \u3010\u738b\u8fea\u6d4b1\u8bd5\u6d41\u7a0b2\u3011\u65b0\u5efa\uff08\u666e\u901a\uff09,\u5df2\u88ab\u6587\u6676\u6676\u5ba1\u6279\u3002\u8fdb\u5165\u4e0b\u4e00\u7ea7\u5ba1\u6838", "record_status": 0, "flow_id": 43, "record_id": "599bda43060ba3e2ecda3f50"}, {"msg_type_text": "\u5173\u6ce8\u6d88\u606f", "msg_type": 3, "is_read": 1, "create_time": "2017-08-22 15:20:18", "handle_status_text": "\u5176\u4ed6", "id": "599bdb32d8e9e408584842c3", "form_id": 181, "publisher": "\u738b\u8fea", "handle_status": 7, "title": "\u5173\u6ce8\u6d88\u606f\u901a\u77e5", "url": "/wf/approval/?record_id=599bdb325700e9eeb23029fb&table_id=5318_EHFuJD7Ae76c6GMPtzdiWH&form_id=181&flow_id=43", "msg_content": "\u60a8\u6709\u4e00\u6761\u9700\u5173\u6ce8\u7684\u5de5\u4f5c,\u65b0\u5de5\u4f5c\u3010\u738b\u8fea \u3010\u738b\u8fea\u6d4b1\u8bd5\u6d41\u7a0b2\u3011\u65b0\u5efa\uff08\u666e\u901a\uff09\u3011\u88ab\u521b\u5efa", "record_status": 0, "flow_id": 43, "record_id": "599bdb325700e9eeb23029fb"}, {"msg_type_text": "\u5173\u6ce8\u6d88\u606f", "msg_type": 3, "is_read": 1, "create_time": "2017-08-22 15:16:20", "handle_status_text": "\u5176\u4ed6", "id": "599bda44d8e9e408644842eb", "form_id": 181, "publisher": "\u738b\u8fea", "handle_status": 7, "title": "\u5173\u6ce8\u6d88\u606f\u901a\u77e5", "url": "/wf/approval/?record_id=599bda43060ba3e2ecda3f50&table_id=5318_EHFuJD7Ae76c6GMPtzdiWH&form_id=181&flow_id=43", "msg_content": "\u60a8\u6709\u4e00\u6761\u9700\u5173\u6ce8\u7684\u5de5\u4f5c,\u65b0\u5de5\u4f5c\u3010\u738b\u8fea \u3010\u738b\u8fea\u6d4b1\u8bd5\u6d41\u7a0b2\u3011\u65b0\u5efa\uff08\u666e\u901a\uff09\u3011\u88ab\u521b\u5efa", "record_status": 0, "flow_id": 43, "record_id": "599bda43060ba3e2ecda3f50"}, {"msg_type_text": "\u63a8\u9001\u6d88\u606f", "msg_type": 4, "is_read": 1, "create_time": "2017-08-17 11:48:42", "handle_status_text": "\u5176\u4ed6", "id": "5995121ad8e9e408670aa60b", "form_id": 0, "publisher": "\u718a\u5c0f\u6d9b", "handle_status": 7, "title": "33", "url": "", "msg_content": "333", "record_status": 0, "flow_id": 0, "record_id": 0}, {"msg_type_text": "\u63a8\u9001\u6d88\u606f", "msg_type": 4, "is_read": 1, "create_time": "2017-08-17 11:43:37", "handle_status_text": "\u5176\u4ed6", "id": "599510e9d8e9e408770aa64b", "form_id": 0, "publisher": "\u718a\u5c0f\u6d9b", "handle_status": 7, "title": "1231", "url": "", "msg_content": "23123123", "record_status": 0, "flow_id": 0, "record_id": 0}, {"msg_type_text": "\u63a8\u9001\u6d88\u606f", "msg_type": 4, "is_read": 1, "create_time": "2017-08-17 11:41:41", "handle_status_text": "\u5176\u4ed6", "id": "59951075d8e9e408750aa60b", "form_id": 0, "publisher": "\u718a\u5c0f\u6d9b", "handle_status": 7, "title": "3312", "url": "", "msg_content": "3123123", "record_status": 0, "flow_id": 0, "record_id": 0}, {"msg_type_text": "\u63a8\u9001\u6d88\u606f", "msg_type": 4, "is_read": 1, "create_time": "2017-08-17 10:26:36", "handle_status_text": "\u5176\u4ed6", "id": "5994fedcd8e9e408710aa605", "form_id": 0, "publisher": "\u718a\u5c0f\u6d9b", "handle_status": 7, "title": "\u6d4b\u8bd5\u6d88\u606f2", "url": "", "msg_content": "\u6d4b\u8bd5\u6d88\u606f2", "record_status": 0, "flow_id": 0, "record_id": 0}, {"msg_type_text": "\u63a8\u9001\u6d88\u606f", "msg_type": 4, "is_read": 1, "create_time": "2017-08-17 10:25:48", "handle_status_text": "\u5176\u4ed6", "id": "5994feacd8e9e408770aa60b", "form_id": 0, "publisher": "\u718a\u5c0f\u6d9b", "handle_status": 7, "title": "\u6d4b\u8bd5\u6d88\u606f", "url": "", "msg_content": "\u6d4b\u8bd5\u6d88\u606f", "record_status": 0, "flow_id": 0, "record_id": 0}, {"msg_type_text": "\u63a8\u9001\u6d88\u606f", "msg_type": 4, "is_read": 1, "create_time": "2017-08-16 21:04:50", "handle_status_text": "\u5176\u4ed6", "id": "599442f2d8e9e4084e5dfb4b", "form_id": 0, "publisher": "\u718a\u5c0f\u6d9b", "handle_status": 7, "title": "123", "url": "", "msg_content": "333", "record_status": 0, "flow_id": 0, "record_id": 0}, {"msg_type_text": "\u63a8\u9001\u6d88\u606f", "msg_type": 4, "is_read": 1, "create_time": "2017-08-16 20:48:34", "handle_status_text": "\u5176\u4ed6", "id": "59943f22d8e9e4085d5dfb52", "form_id": 0, "publisher": "\u718a\u5c0f\u6d9b", "handle_status": 7, "title": "3", "url": "", "msg_content": "3", "record_status": 0, "flow_id": 0, "record_id": 0}, {"msg_type_text": "\u63a8\u9001\u6d88\u606f", "msg_type": 4, "is_read": 0, "create_time": "2017-08-16 20:19:34", "handle_status_text": "\u5176\u4ed6", "id": "59943856d8e9e408545dfb9b", "form_id": 0, "publisher": "\u718a\u5c0f\u6d9b", "handle_status": 7, "title": "123", "url": "", "msg_content": "312333", "record_status": 0, "flow_id": 0, "record_id": 0}, {"msg_type_text": "\u63a8\u9001\u6d88\u606f", "msg_type": 4, "is_read": 0, "create_time": "2017-08-16 16:09:10", "handle_status_text": "\u5176\u4ed6", "id": "5993fda6d8e9e408545dfb3f", "form_id": 0, "publisher": "\u718a\u5c0f\u6d9b", "handle_status": 7, "title": "3", "url": "", "msg_content": "3", "record_status": 0, "flow_id": 0, "record_id": 0}], "error": ""}}},
    },
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
            console.log(data);
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
        this.el.dialog({
            width: 1328,
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
};

export {systemMessageUtil};
// systemMessageUtil.show();