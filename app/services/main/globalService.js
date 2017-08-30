import {HTTP} from "../../lib/http"
import {Utils} from "./utils";
import {dgcService} from '../dataGrid/data-table-control.service';

const handlers = {
    userTypeRender:function (data) {
        return data.value === "是"? "管理员" : "普通用户";
    }
};

export const GlobalService = {
    http:HTTP,
    sendSearch:function (data) {
        let url = '/search_full_text/';
        let body =  Utils.formatParams(data);

        return this.http.postImmediately({
            url:url,
            data:body,
            type:'post'
        })
    },
    getOnlineColumnDefs:function () {       //获取在线人员列表表头
        return [
            _.defaultsDeep({headerName: '序号', width: 60}, dgcService.numberCol),
            {
                headerName: '姓名',
                field: 'name',
                width: 100,
                suppressMenu: true,
                tooltipField: 'name',
                cellStyle: {'text-align': 'center'},
                // suppressSorting: true
            },
            {
                headerName: '是否在职',
                field: 'is_active',
                width: 60,
                suppressMenu: true,
                tooltipField: 'is_active',
                cellStyle: {'text-align': 'center'},
                // suppressSorting: true
            },
            {
                headerName: '用户类型',
                field: 'is_superuser',
                width: 80,
                suppressMenu: true,
                tooltipField: 'is_superuser',
                cellStyle: {'text-align': 'center'},
                // suppressSorting: true
                cellRenderer: handlers.userTypeRender
            },
            {
                headerName: '登陆时间',
                field: 'login_time',
                width: 180,
                suppressMenu: true,
                tooltipField: 'login_time',
                cellStyle: {'text-align': 'center'},
                // suppressSorting: true
            },
            {
                headerName: '登录IP',
                field: 'login_ip',
                width: 120,
                suppressMenu: true,
                tooltipField: 'login_ip',
                cellStyle: {'text-align': 'center'},
                // suppressSorting: true
            },
            {
                headerName: '手机登录',
                field: 'mobile',
                width: 60,
                suppressMenu: true,
                tooltipField: 'mobile',
                cellStyle: {'text-align': 'center'},
                // suppressSorting: true
            },
            {
                headerName: '设备',
                field: 'device',
                width: 80,
                suppressMenu: true,
                tooltipField: 'device',
                cellStyle: {'text-align': 'center'},
                // suppressSorting: true
            },
            {
                headerName: 'app版本',
                field: 'version',
                width: 150,
                suppressMenu: true,
                tooltipField: 'version',
                cellStyle: {'text-align': 'center'},
                // suppressSorting: true
            },
            {
                headerName: 'Session失效时间',
                field: 'expire',
                width: 120,
                suppressMenu: true,
                tooltipField: 'expire',
                cellStyle: {'text-align': 'center'},
                // suppressSorting: true
            }
        ];
    },
    getOnlineUserData:function (_param) {         //获取在线人员列表数据
        let param = _.defaultsDeep(_param, {
            rows: 10,
            first:0,
            sortOrder: -1,
            sortField: '',
            page:1
        });
        let url = '/get_online_user_list/';
        let body = Utils.formatParams(param);

        return HTTP.postImmediately({
            url:url,
            type:'post',
            data:body
        })
    }

};