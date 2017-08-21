import {HTTP} from "../../lib/http"
import {Utils} from "./utils";
import {dgcService} from '../dataGrid/data-table-control.service';



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
                width: 150,
                suppressMenu: true,
                tooltipField: 'name',
                cellStyle: {'text-align': 'center'},
                suppressSorting: true
            },
            {
                headerName: '是否在职',
                field: 'is_active',
                width: 100,
                suppressMenu: true,
                tooltipField: 'is_active',
                cellStyle: {'text-align': 'center'},
                suppressSorting: true
            },
            {
                headerName: '管理员权限',
                field: 'is_superuser',
                width: 150,
                suppressMenu: true,
                tooltipField: 'is_superuser',
                cellStyle: {'text-align': 'center'},
                suppressSorting: true
            },
            {
                headerName: '登陆时间',
                field: 'login_time',
                width: 150,
                suppressMenu: true,
                tooltipField: 'login_time',
                cellStyle: {'text-align': 'center'},
                suppressSorting: true
            },
            {
                headerName: '登录IP',
                field: 'login_ip',
                width: 150,
                suppressMenu: true,
                tooltipField: 'login_ip',
                cellStyle: {'text-align': 'center'},
                suppressSorting: true
            },
            {
                headerName: '手机登录',
                field: 'mobile',
                width: 150,
                suppressMenu: true,
                tooltipField: 'mobile',
                cellStyle: {'text-align': 'center'},
                suppressSorting: true
            },
            {
                headerName: '设备',
                field: 'device',
                width: 100,
                suppressMenu: true,
                tooltipField: 'device',
                cellStyle: {'text-align': 'center'},
                suppressSorting: true
            },
            {
                headerName: 'app版本',
                field: 'version',
                width: 150,
                suppressMenu: true,
                tooltipField: 'version',
                cellStyle: {'text-align': 'center'},
                suppressSorting: true
            },
            {
                headerName: 'Session失效时间',
                field: 'expire',
                width: 150,
                suppressMenu: true,
                tooltipField: 'expire',
                cellStyle: {'text-align': 'center'},
                suppressSorting: true
            }
        ];
    },
    getOnlineUserData:function (_param) {         //获取在线人员列表数据
        let param = _.defaultsDeep(_param, {
            rows: 50,
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