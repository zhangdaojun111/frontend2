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

let component;
let config = {
    template:template,
    data:{
        columnDefs:{},
        currentData:{},
        // test_data:{"total": 15, "rows": [{"employee_id": -1, "name": "\u5c39\u624d\u534e", "mobile": "", "is_active": "\u5728\u804c", "is_superuser": "\u662f", "expire": 86378, "login_ip": "127.0.0.1", "version": "", "device": "pc", "ID": "5979e48a41f77c586658e343", "login_time": "2017-09-04 12:53:26"}, {"employee_id": -1, "name": "\u718a\u5c0f\u6d9b", "mobile": "", "is_active": "\u5728\u804c", "is_superuser": "\u662f", "expire": 80606, "login_ip": "127.0.0.1", "version": "", "device": "pc", "ID": "5979e48a41f77c586658e34b", "login_time": "2017-09-04 09:55:15"}, {"employee_id": -1, "name": "\u5f90\u8273", "mobile": "", "is_active": "\u5728\u804c", "is_superuser": "\u662f", "expire": 85533, "login_ip": "192.168.2.1", "version": "", "device": "pc", "ID": "5979e48a41f77c586658e34f", "login_time": "2017-09-04 11:54:42"}, {"employee_id": -1, "name": "\u6768\u6653\u5ddd", "mobile": "", "is_active": "\u5728\u804c", "is_superuser": "\u662f", "expire": 82247, "login_ip": "192.168.2.21", "version": "", "device": "pc", "ID": "5979e48a41f77c586658e370", "login_time": "2017-09-04 10:19:37"}, {"employee_id": -1, "name": "\u4e8e\u5fb7\u840d", "mobile": "", "is_active": "\u5728\u804c", "is_superuser": "\u662f", "expire": 80096, "login_ip": "127.0.0.1", "version": "", "device": "pc", "ID": "5979e48a41f77c586658e371", "login_time": "2017-09-04 10:06:39"},{"employee_id": -1, "name": "\u4e8e\u5fb7\u840d", "mobile": "", "is_active": "\u5728\u804c", "is_superuser": "\u662f", "expire": 80096, "login_ip": "127.0.0.1", "version": "", "device": "pc", "ID": "5979e48a41f77c586658e371", "login_time": "2017-09-04 10:06:39"},{"employee_id": -1, "name": "\u4e8e\u5fb7\u840d", "mobile": "", "is_active": "\u5728\u804c", "is_superuser": "\u662f", "expire": 80096, "login_ip": "127.0.0.1", "version": "", "device": "pc", "ID": "5979e48a41f77c586658e371", "login_time": "2017-09-04 10:06:39"},{"employee_id": -1, "name": "\u4e8e\u5fb7\u840d", "mobile": "", "is_active": "\u5728\u804c", "is_superuser": "\u662f", "expire": 80096, "login_ip": "127.0.0.1", "version": "", "device": "pc", "ID": "5979e48a41f77c586658e371", "login_time": "2017-09-04 10:06:39"},{"employee_id": -1, "name": "\u4e8e\u5fb7\u840d", "mobile": "", "is_active": "\u5728\u804c", "is_superuser": "\u662f", "expire": 80096, "login_ip": "127.0.0.1", "version": "", "device": "pc", "ID": "5979e48a41f77c586658e371", "login_time": "2017-09-04 10:06:39"},{"employee_id": -1, "name": "\u4e8e\u5fb7\u840d", "mobile": "", "is_active": "\u5728\u804c", "is_superuser": "\u662f", "expire": 80096, "login_ip": "127.0.0.1", "version": "", "device": "pc", "ID": "5979e48a41f77c586658e371", "login_time": "2017-09-04 10:06:39"},{"employee_id": -1, "name": "\u4e8e\u5fb7\u840d", "mobile": "", "is_active": "\u5728\u804c", "is_superuser": "\u662f", "expire": 80096, "login_ip": "127.0.0.1", "version": "", "device": "pc", "ID": "5979e48a41f77c586658e371", "login_time": "2017-09-04 10:06:39"},{"employee_id": -1, "name": "\u4e8e\u5fb7\u840d", "mobile": "", "is_active": "\u5728\u804c", "is_superuser": "\u662f", "expire": 80096, "login_ip": "127.0.0.1", "version": "", "device": "pc", "ID": "5979e48a41f77c586658e371", "login_time": "2017-09-04 10:06:39"},{"employee_id": -1, "name": "\u4e8e\u5fb7\u840d", "mobile": "", "is_active": "\u5728\u804c", "is_superuser": "\u662f", "expire": 80096, "login_ip": "127.0.0.1", "version": "", "device": "pc", "ID": "5979e48a41f77c586658e371", "login_time": "2017-09-04 10:06:39"},{"employee_id": -1, "name": "\u4e8e\u5fb7\u840d", "mobile": "", "is_active": "\u5728\u804c", "is_superuser": "\u662f", "expire": 80096, "login_ip": "127.0.0.1", "version": "", "device": "pc", "ID": "5979e48a41f77c586658e371", "login_time": "2017-09-04 10:06:39"},{"employee_id": -1, "name": "\u4e8e\u5fb7\u840d", "mobile": "", "is_active": "\u5728\u804c", "is_superuser": "\u662f", "expire": 80096, "login_ip": "127.0.0.1", "version": "", "device": "pc", "ID": "5979e48a41f77c586658e371", "login_time": "2017-09-04 10:06:39"}], "success": 1, "error": ""}
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
    },
    afterRender:function () {
        let gridRoot = this.el.find('.user-grid');
        //设置表头
        this.agGrid = new agGrid({
            columnDefs: GlobalService.getOnlineColumnDefs(),
            footerData:[]
        });
        this.agGrid.render(gridRoot);
        this.pagination = new dataPagination({
            currentPage: 1,
            rows: 100,
        });
        this.pagination.render(this.el.find('.user-pagination'));
        this.pagination.actions.paginationChanged = this.actions.onPaginationChanged;
        this.actions.loadData();
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
