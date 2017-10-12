/**
 * @author zhaoyan
 * 在线用户列表展示
 */
import Component from '../../../lib/component';
import 'jquery-ui/themes/base/base.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/ui/widgets/dialog.js';
import './online-users.scss';
import template from './online-users.html';
import agGrid from '../../dataGrid/agGrid/agGrid';
import dataPagination from '../../dataGrid/data-table-toolbar/data-pagination/data-pagination';
import {GlobalService} from "../../../services/main/globalService"
import {dataTableService} from "../../../services/dataGrid/data-table.service"
import {HTTP} from '../../../lib/http';

let component;
let config = {
    template:template,
    data:{
        columnDefs:{},
        currentData:{},
        total:0,
        rows:100,
        tableId:'online-user'
    },
    actions:{
        /**
         * 获取在线人数信息
         * @param _param
         */
        loadData:function (_param) {
            component.showLoading();
            _param = _param || {};
            let param = _.defaultsDeep(_param, {
                rows: this.pagination.data.rows,
                first: (this.pagination.data.currentPage - 1) * this.pagination.data.rows,
                page: this.pagination.data.currentPage,
                currentPage:this.pagination.data.currentPage
            });

            let that = this;
            GlobalService.getOnlineUserData(param).done((data) => {
                if(data.success === 1){
                    that.agGrid.actions.setGridData({
                        rowData: data.rows
                    });
                    that.pagination.actions.setPagination(data.total, param.currentPage);
                    component.hideLoading();
                }else{
                    component.hideLoading();
                    console.log("获取在线用户数据失败",data.err);
                }
            });
        },
        /**
         * 页数改变时，根据页码重新查询数据
         * @param data
         */
        onPaginationChanged:function (data) {
            this.actions.loadData(data);
        },
        onSortChanged:function ($event) {
            this.agGrid.actions.refreshView();
        },
        initPagination:function () {
            this.pagination = new dataPagination({
                currentPage: 1,
                rows: this.data.rows,
                tableId:this.data.tableId
            });
            this.pagination.render(this.el.find('.user-pagination'));
            this.pagination.actions.paginationChanged = this.actions.onPaginationChanged;
            this.actions.loadData();
        }
    },
    afterRender:function () {
        let that = this;
        let gridRoot = this.el.find('.user-grid');
        //设置表头
        this.agGrid = new agGrid({
            columnDefs: GlobalService.getOnlineColumnDefs(),
            footerData:[],
            onSortChanged: this.actions.onSortChanged,
        });
        this.agGrid.render(gridRoot);
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
    beforeDestory:function () {
        
    }
};

class OnlineUser extends Component {
    constructor(){
        super(config)
    }
}

export const OnlineDisplay = {
    el:null,
    show:function () {
        component = new OnlineUser();
        this.el = $('<div class="online-users-page">').appendTo(document.body);
        component.render(this.el);
        this.el.erdsDialog({
            title: '在线用户',
            width: 1200,
            height: 580,
            modal: true,
            close: function() {
                $(this).erdsDialog('destroy');
                component.destroySelf();
            }
        });
    },
    hide:function () {
        this.el.erdsDialog('close');
    }
};
