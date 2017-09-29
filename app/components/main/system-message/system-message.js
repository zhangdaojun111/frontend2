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
        /**
         * 根据参数（页码）向后台发送请求，获取渲染该页所需数据
         * @param _param
         */
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
        /**
         * 将选中信息标记为已读状态
         */
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
        /**
         * 向后台发送信息阅读状态，审批通过获取数据刷新页面
         * @param ids
         * @param type
         * @private
         */
        _postReadData: function (ids) {
            this.showLoading();
            HTTP.postImmediately('/remark_or_del_msg/', {
                checkIds: ids
            }).then((res) => {
                this.hideLoading();
                if (res.success === 1) {
                    this.actions.loadData();
                }
            });
        },
        /**
         * 批量审批，符合勾选规则后跳至工作流页面，审批完成后，刷新数据
         */
        batchApprove: function () {
            let rows = this.agGrid.gridOptions.api.getSelectedRows();

            let checkIds = rows.map((item) => {
                return item.id;
            });

            if(checkIds.length === 0){
                msgbox.alert('请选择至少一条“待审批”消息进行审批');
                return;
            }

            //检测是否含有非待审批状态的消息被勾选
            for(let k of rows){
                if(k.handle_status_text !== '待审批'){
                    msgbox.alert('勾选消息必须全部为“待审批”状态才能进行批量审批');
                    return;
                }
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
        },
        /**
         * 批量删除，请求后台删除成功后，刷新页面
         */
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
        /**
         * 分页组件监听页码改变后，根据页码请求数据
         * @param data
         */
        onPaginationChanged: function (data) {
            this.actions.loadData(data);
        },
        /**
         * 选择信息查看详细内容，信息类型不同，采用不同方式展示
         * @param $event
         */
        onCellClicked: function ($event) {
            if($event.colDef.headerName === '操作'){
                let data = $event.data;
                if (data.handle_status_text === '待审批' || data.handle_status_text === '已通过' || data.handle_status_text === '已取消' ||
                    data.handle_status_text === '已驳回' || data.handle_status_text === '已完成') {
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
                    }).then((result) => {
                        console.log(result);
                        if (result.refresh === true) {
                            this.actions.loadData();
                        }
                    })
                } else {
                    systemMessageUtil.showMessageDetail(data.msg_type_text, data.title, data.msg_content);
                }

                //查看通过前端自己刷新，审批通过loadData刷新
                // if($event.event.srcElement.className.includes()){
                //     $event.node.data.is_read = 1;
                //     this.agGrid.actions.refreshView();
                    this.actions._postReadData(JSON.stringify([data.id]));
                // }
            }
        }
    },
    afterRender: function () {
        let gridDom = this.el.find('.grid');
        let that = this;
        //设置表格表头信息
        this.agGrid = new agGrid({
            columnDefs: systemMessageService.getColumnDefs(),
            onCellClicked: that.actions.onCellClicked,
            footerData:[]
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
            width: 1200,
            height: 580,
            modal: true,
            title: '消息提醒',
            close: function () {
                $(this).erdsDialog('destroy');
                systemMessage.destroySelf();
            }
        })
    },
    hide: function () {

    },
    /**
     * 显示单条信息详细内容
     * @param dialogTitle
     * @param msgTitle
     * @param msgContent
     * @param speak
     */
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
                $(this).erdsDialog('destroy');
            }
        })
    }
};

export {systemMessageUtil};
// systemMessageUtil.show();