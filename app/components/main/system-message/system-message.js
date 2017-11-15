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
import {dataTableService} from "../../../services/dataGrid/data-table.service"
import Mediator from '../../../lib/mediator';

let gridPref;
let config = {
    template: template,
    data:{
        frontendSort:true,      //排序方式（前端/后端）
        total:0,
        rows:100,
        getDataParams:{           //后端排序参数
            rows:100,
            first:0,
            currentPage:1
        },
        tableId:'user-message'
    },
    actions: {
        /**
         * 根据参数（页码）向后台发送请求，获取渲染该页所需数据
         * @param _param
         */
        loadData: function (param) {
            // _param = _param || {};
            // let param = _.defaultsDeep(_param, {
            //     rows: this.pagination.data.rows,
            //     first: (this.pagination.data.currentPage - 1) * this.pagination.data.rows,
            //     currentPage: this.pagination.data.currentPage
            // });
            // this.showLoading();
            systemMessageService.getMyMsg(param).then((data) => {
                this.data.total = data.total;
                this.actions.setSortModel();
                this.agGrid.actions.setGridData({
                    rowData: data.rows
                });

                this.pagination.actions.setPagination(data.total, param.currentPage);
                // this.hideLoading();
                this.agGrid.gridOptions.api.sizeColumnsToFit();
            });
        },
        setSortModel:function () {
            if(this.data.total > this.data.rows){
                this.data.frontendSort = false;
            }else{
                this.data.frontendSort = true;
            }
            this.agGrid.gridOptions["enableServerSideSorting"] = !this.data.frontendSort;
            this.agGrid.gridOptions["enableSorting"] = this.data.frontendSort;
        },
        /**
         * 将选中信息标记为已读状态
         */
        markRead: function () {
            let unread_count = 0;
            msgbox.confirm('是否将选中的消息标为已读？').then((res) => {
                if (res) {
                    let rows = this.agGrid.gridOptions.api.getSelectedRows();
                    let checkIds = rows.map((item) => {
                        if(item.is_read === 0){
                            unread_count++;
                        }
                        return item.id;
                    });
                    //保持window.config中unread数量正确
                    window.config.sysConfig.unread_msg_count = window.config.sysConfig.unread_msg_count - unread_count;
                    Mediator.emit("sysmsg:refresh_unread");
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
            let that = this;
            HTTP.postImmediately('/remark_or_del_msg/', {
                checkIds: ids
            }).then((res) => {
                this.hideLoading();
                if (res.success === 1) {
                    that.actions.loadData(that.data.getDataParams);
                }
            });
        },
        /**
         * 向后台发送信息阅读状态,前端自己刷新页面
         * @param ids
         * @private
         */
        _justPostReadData:function (ids) {
            HTTP.postImmediately('/remark_or_del_msg/', {
                checkIds: ids
            })
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
                width: 450,
                height: 310,
                title: '批量审批',
                // customSize:true
            },data).then(res => {
                if(res.refresh === true){
                    that.actions.loadData(this.data.getDataParams);
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
                            this.actions.loadData(this.data.getDataParams);
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
            this.data.getDataParams = _.defaultsDeep(data,this.data.getDataParams);
            this.data.rows = data.rows;
            this.actions.loadData(this.data.getDataParams);
        },
        /**
         * 根据消息数量和每页显示数量进行前端排序或后端排序
         * @param $event
         */
        onSortChanged:function ($event) {
            //分情况进行前端排序或后端排序
            if(!this.data.frontendSort){
                //后端排序
                console.log('启用后端排序');
                let data = this.agGrid.gridOptions.api.getSortModel()[0];
                if( data && data.sort === "asc" ){
                    this.data.getDataParams = {
                        rows: this.pagination.data.rows,
                        currentPage: this.pagination.data.currentPage,
                        first: (this.pagination.data.currentPage - 1) * this.pagination.data.rows,
                        sortField: data.colId,
                        sortOrder: 1
                    };
                }else if(data && data.sort === "desc"){
                    this.data.getDataParams = {
                        rows: this.pagination.data.rows,
                        currentPage: this.pagination.data.currentPage,
                        first: (this.pagination.data.currentPage - 1) * this.pagination.data.rows,
                        sortField: data.colId,
                        sortOrder: -1
                    };
                }else{
                    this.data.getDataParams = {
                        rows: this.pagination.data.rows,
                        currentPage: this.pagination.data.currentPage,
                        first: (this.pagination.data.currentPage - 1) * this.pagination.data.rows,
                    };
                }
                this.actions.loadData(this.data.getDataParams);
            }else{
                //前端排序
                console.log('启用前端排序');
                this.agGrid.actions.refreshView();
            }
        },
        /**
         * 双击打开消息细节弹窗
         * @param $event
         */
        onRowDoubleClicked:function ($event) {
            this.actions.openDialog($event);
        },
        /**
         * 选择信息查看详细内容，信息类型不同，采用不同方式展示
         * @param $event
         */
        onCellClicked: function ($event) {
            if($event.colDef.headerName === '操作'){
                this.actions.openDialog($event);
            }
        },
        /**
         * 根据消息类型按不同方式展示具体消息
         * @param $event
         */
        openDialog:function ($event) {
        	console.log('查看操作');
        	console.log($event)
            let data = $event.data;
            // if ((data.handle_status_text === '待审批' || data.handle_status_text === '已通过' || data.handle_status_text === '已取消' ||
            //     data.handle_status_text === '已驳回' || data.handle_status_text === '已完成') || data.msg_type === '关注消息') {
            if (data.msg_type === '审批消息' || data.msg_type === '关注消息') {
                if(data.handle_status_text === '待审批'){
                    data.url += "&btnType=edit";
                }else if(data.handle_status_text === '已取消'){
                    data.url += "&btnType=view";
                }else if(data.handle_status_text === '已被通过' || data.handle_status_text === '已通过' || data.handle_status_text === '其他'|| data.handle_status_text === '已驳回'){
	                data.url += "&btnType=view";
                }

                PMAPI.openDialogByIframe(data.url, {
                    width: 1200,
                    height: 500,
                    title: data.msg_type_text,
                    customSize:true
                }).then((result) => {
                    if (result.refresh === true) {
                        this.actions.loadData(this.data.getDataParams);
                    }
                })
            } else {
                systemMessageUtil.showMessageDetail(data.msg_type_text, data);
            }

            // 查看操作通过前端自己刷新未读，审批通过loadData刷新
            if($event.data.handle_status_text !== '待审批'){
                if($event.node.data.is_read === 0){
                    $event.node.data.is_read = 1;
                    this.agGrid.actions.refreshView();
                    window.config.sysConfig.unread_msg_count--;
                    Mediator.emit("sysmsg:refresh_unread");
                    this.actions._justPostReadData(JSON.stringify([data.id]));
                }
            }else{
                if($event.node.data.is_read === 0){
                    window.config.sysConfig.unread_msg_count--;
                }
                this.actions._postReadData(JSON.stringify([data.id]));
            }
        },
        /**
         * 根据用户偏好初始化分页工具
         */
        initPagination:function () {
            this.pagination = new dataPagination({
                currentPage: 1,
                rows: this.data.rows,
                tableId:this.data.tableId
            });
            this.pagination.render(this.el.find('.pagination'));
            this.pagination.actions.paginationChanged = this.actions.onPaginationChanged;
            this.data.getDataParams.rows = this.data.rows;
            this.actions.loadData(this.data.getDataParams);
            this.hideLoading();
        },
    },
    afterRender: function () {
        let gridDom = this.el.find('.grid');
        let that = this;
        //设置表格表头信息
        gridPref = this.agGrid = new agGrid({
            columnDefs: systemMessageService.getColumnDefs(),
            onCellClicked: that.actions.onCellClicked,
            noFooter: true,
            onRowDoubleClicked:that.actions.onRowDoubleClicked,
            onSortChanged: this.actions.onSortChanged,
            footerData:[]
        });
        this.agGrid.render(gridDom);
        this.showLoading();
        //请求页显示数量偏好
        let tempData = {
            actions:JSON.stringify(['pageSize']),
            table_id:this.data.tableId
        };

        dataTableService.getPreferences(tempData).then((result) => {
            if(result.success === 1 && result.pageSize !== null){
                that.data.rows = result.pageSize.pageSize;
            }
            that.actions.initPagination();
        });
        HTTP.flush();
    },
    firstAfterRender: function () {
        this.el.on('click', '.markRead', () => {
            this.actions.markRead();
        }).on('click', '.batchApprove', () => {
            this.actions.batchApprove();
        }).on('click', '.batchDelete', () => {
            this.actions.batchDelete();
        });
    }
};

class SystemMessage extends Component {
    constructor(newConfig) {
        super($.extend(true,{},config,newConfig));
    }
}

let systemMessageUtil = {
    el: null,
    show: function () {
        this.el = $("<div class='user-system-message'>").appendTo('body');
        let systemMessage = new SystemMessage();
        systemMessage.render(this.el);
        let sysDom = this.el.find('.system-message');
        this.el.erdsDialog({
            width: 1205,
            height: 580,
            modal: true,
            maxable: true,
            defaultMax: false,
            title: '消息提醒',
            resizeMax:function () {
                sysDom.addClass('maximize-model');
                systemMessage.showLoading();
                setTimeout(function () {
                    gridPref.gridOptions.api.sizeColumnsToFit();
                    systemMessage.hideLoading();
                },500);
            },
            resizeMin:function () {
                sysDom.removeClass('maximize-model');
                systemMessage.showLoading();
                setTimeout(function () {
                    gridPref.gridOptions.api.sizeColumnsToFit();
                    systemMessage.hideLoading();
                },500);
            },
            close: function () {
                $(this).erdsDialog('destroy');
                systemMessage.destroySelf();
            }
        })
    },
    hide: function () {

    },
    /**
     * 传入单条消息或消息数组，进行显示和朗读
     * @param dialogTitle
     * @param data
     * @param speak
     */
    showMessageDetail: function (dialogTitle, data, speak = false) {
        let html = '<div class="component-msg-detail">';
        let readMsg = '';
        if($.isArray(data) === false){
            if(data.content){
                data.msg_content = data.content;
            }
            html += `
                <h3 class="msg-title">${data.title}</h3>
                <pre class="text">${data.msg_content}</pre>
            </div>
        `;
            readMsg = data.title.toString() + data.msg_content.toString();
        }else{
            for(let msg of data){
                html += `
                    <h3 class="msg-title">${msg.title}</h3>
                    <pre class="text">${msg.content}</pre>                
            `;
                readMsg += msg.title.toString() + msg.content.toString();
            }
            html += `</div>`;
        }

        if (speak) {
            let msg = new SpeechSynthesisUtterance(readMsg);
            msg.lang = 'zh';
            msg.voice = speechSynthesis.getVoices().filter(function(voice) {
                return voice.name == 'Whisper';
            })[0];
            speechSynthesis.speak(msg);
        }
        this.el = $(html).appendTo('body');
        let that = this;
        this.el.erdsDialog({
            width: 800,
            height: 600,
            modal: true,
            title: dialogTitle,
            close: function () {
                //关闭语音提示
                speechSynthesis.cancel();
                $(this).erdsDialog('destroy');
                that.el.remove();
            }
        })
    }
};

export {systemMessageUtil};
// systemMessageUtil.show();