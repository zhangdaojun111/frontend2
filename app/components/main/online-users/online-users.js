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
    },
    actions:{
        loadData:function (_param) {
            component.showLoading();
            _param = _param || {};
            let param = _.defaultsDeep(_param, {
                rows: this.pagination.data.rows,
                first: (this.pagination.data.currentPage - 1) * this.pagination.data.rows,
                page: this.pagination.data.currentPage,
                currentPage:this.pagination.data.currentPage
            });

            GlobalService.getOnlineUserData(param).done((data) => {
                if(data.success === 1){
                    this.agGrid.actions.setGridData({
                        rowData: data.rows
                    });
                    this.pagination.actions.setPagination(data.total, param.currentPage);
                    component.hideLoading();
                }else{
                    component.hideLoading();
                    console.log("获取在线用户数据失败",data.err);
                }
            });
        },
        onPaginationChanged:function (data) {
            this.actions.loadData(data);
        },
    },
    afterRender:function () {
        let gridRoot = this.el.find('.user-grid');
        this.agGrid = new agGrid({
            columnDefs: GlobalService.getOnlineColumnDefs(),
        });
        this.agGrid.render(gridRoot);
        this.pagination = new dataPagination({
            currentPage: 1,
            rows: 15,
            range: {
                l:15,
                r:200
            }
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
        this.el.dialog({
            title: '在线用户',
            width: 1035,
            height: 580,
            modal: true,
            close: function() {
                $(this).dialog('destroy');
                component.destroySelf();
            }
        });
    },
    hide:function () {
        this.el.dialog('close');
    }
};
