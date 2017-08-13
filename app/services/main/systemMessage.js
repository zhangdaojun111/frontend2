import {HTTP} from '../../lib/http';
import {dgcService} from '../dataGrid/data-table-control.service';

// HTTP.getImmediately('/get_system_table_column/online_user/').then((res) => {
//     let cols = res.rows;
//     let numberCol = _.defaultsDeep({}, dgcService.numberCol);
//     let selectCol = _.defaultsDeep({}, dgcService.selectCol);
//     that.columnDefs = [numberCol, selectCol];
//     for (let col of cols) {
//         if (col["name"] == "工号") {
//             continue;
//         }
//         that.columnDefs.push(
//             {
//                 headerName: col["name"],
//                 filter: 'number',
//                 field: col["field"],
//                 width: 110,
//                 suppressMenu: true,
//                 colId: col["field"],
//                 tooltipField: col["field"],
//                 sortingOrder: ['desc', 'asc', null],
//                 cellStyle: {'text-align': 'center'}
//             }
//         );
//     }
//     resolve(that.columnDefs);
// });

function handleCellRenderer(params) {
    if (params.data.record_status == 1) {
        return `
            <div style="text-align:center;">
            <a href=javascript:void(0); class="ui-link" data-type="view">查看</a>
            <span>|</span>
            <a href=javascript:void(0); class="ui-link" data-type="approve">审批</a>
            <div>
            `;
    } else {
        return `
            <div style="text-align:center;">
            <a href=javascript:void(0); class="ui-link" data-type="view">查看</a>
            </div>
            `;
    }
}

export const systemMessageService = {
    columnDefs: [],
    getColumnDefs: function () {

        return [
            _.defaultsDeep({headerName: '序号', width: 60}, dgcService.numberCol),
            {
                headerCellTemplate: (params) => {
                    // return this.selectAll(params, this);
                },
                width: 60,
                headerName: '全选',
                checkboxSelection: true,
                suppressSorting: true,
                suppressMenu: true,
                cellStyle: {'text-align': 'center'}
            },
            {
                headerName: '操作',
                field: 'operation',
                width: 120,
                suppressSorting: true,
                suppressMenu: true,
                cellRenderer: (params) => {
                    return handleCellRenderer(params)
                }
            },
            {
                headerName: '发布者',
                field: 'publisher',
                width: 100,
                suppressMenu: true,
                tooltipField: 'publisher',
                cellStyle: {'text-align': 'center'},
                suppressSorting: true
            },
            {
                headerName: '消息标题',
                field: 'title',
                width: 150,
                suppressMenu: true,
                tooltipField: 'title',
                cellStyle: {'text-align': 'center'}
            },
            {
                headerName: '消息类型',
                field: 'msg_type',
                width: 180,
                suppressMenu: true,
                tooltipField: 'msg_type',
                cellStyle: {'text-align': 'center'},
                suppressSorting: true
            },
            {
                headerName: '消息内容',
                field: 'msg_content',
                suppressMenu: true,
                tooltipField: 'msg_content',
                cellStyle: {'text-align': 'center'}
            },
            {
                headerName: '发布时间',
                field: 'create_time',
                suppressMenu: true,
                tooltipField: 'create_time',
                cellStyle: {'text-align': 'center'}
            },
            {
                headerName: '阅读状态',
                field: 'is_read',
                width: 120,
                suppressMenu: true,
                tooltipField: 'is_read',
                cellStyle: {'text-align': 'center'},
                cellRenderer: function (data) {
                    if (data.value == '未阅读') {
                        return `<div style="text-align:center;color:red;">未阅读<div>`;
                    } else {
                        return `<div style="text-align:center;">已阅读<div>`;
                    }
                }
            },
            {
                headerName: '执行状态',
                field: 'handle_status_text',
                width: 120,
                suppressMenu: true,
                tooltipField: 'handle_status_text',
                cellStyle: {'text-align': 'center'},
                suppressSorting: true,
                cellRenderer: function (data) {
                    if (data.data.handle_status == 0) {
                        return `<div style="text-align:center;color:red;">待审批<div>`;
                    } else {
                        return `<div style="text-align:center;">` + data.data['handle_status_text'] + `<div>`;
                    }
                }
            }
        ];
    },

    getMyMsg: function (_param) {
        _param = _param || {};
        let param = _.defaultsDeep(_param, {
            rows: 100,
            first: 0,
            sortOrder: -1,
            sortField: '',
        })
        return HTTP.postImmediately('/get_my_msg/', param);
    }

}