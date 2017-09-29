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

const handlers = {
    selectAll: function (data) {

        let html =
            `<div class="ag-cell-label-container" role="presentation">    
                <div ref="eLabel" class="ag-header-cell-label" role="presentation">                    
                    <span ref="eText" class="ag-header-cell-text" role="columnheader">全选</span>
                </div>
            </div>`;
        let headerCell = $(html);
        headerCell.on('click', () => {
            if (headerCell.data('selected') === '1') {
                data.api.deselectAll();
                headerCell.find("span[ref=eText]").html('全选');
                headerCell.data('selected', '0')
            } else {
                data.api.selectAll();
                headerCell.find("span[ref=eText]").html('反选');
                headerCell.data('selected', '1')
            }
        })
        return headerCell[0];
    },
    readRender: function (data) {
        return `<div class="grid-cell-info ${data.value?'already-read-icon':'not-read-icon'}">${data.value?'已读':'未读'}<div>`;
    }
};

export const systemMessageService = {
    columnDefs: [],
    getColumnDefs: function () {
        return [
            _.defaultsDeep({headerName: '序号', width: 40}, dgcService.numberCol),
            dgcService.selectCol,
            // {
            //     headerCellTemplate: function (data) {
            //         return handlers.selectAll(data);
            //     },
            //     width: 60,
            //     headerName: '全选',
            //     checkboxSelection: true,
            //     suppressSorting: true,
            //     suppressMenu: true,
            //     cellStyle: {'text-align': 'center'},
            // },
            {
                headerName: '阅读状态',
                field: 'is_read',
                width: 80,
                suppressMenu: true,
                tooltipField: 'is_read',
                cellStyle: {'text-align': 'center'},
                cellRenderer: handlers.readRender
            }, {
                headerName: '发布者',
                field: 'publisher',
                width: 80,
                suppressMenu: true,
                tooltipField: 'publisher',
                cellStyle: {'text-align': 'center'},
                suppressSorting: true
            }, {
                headerName: '消息标题',
                field: 'title',
                width: 140,
                suppressMenu: true,
                tooltipField: 'title',
                cellStyle: {'text-align': 'center'}
            }, {
                headerName: '消息类型',
                field: 'msg_type',
                width: 100,
                suppressMenu: true,
                tooltipField: 'msg_type_text',
                cellStyle: {'text-align': 'center'},
                suppressSorting: true
            }, {
                width:458,
                headerName: '消息内容',
                field: 'msg_content',
                suppressMenu: true,
                tooltipField: 'msg_content',
                cellStyle: {'text-align': 'center'}
            }, {
                width:160,
                headerName: '发布时间',
                field: 'create_time',
                suppressMenu: true,
                tooltipField: 'create_time',
                cellStyle: {'text-align': 'center'}
            }, {
                headerName: '执行状态',
                field: 'handle_status_text',
                width: 80,
                suppressMenu: true,
                tooltipField: 'handle_status_text',
                cellStyle: {'text-align': 'center'},
                suppressSorting: true
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
        let promise = HTTP.post('get_my_msg', param);
        HTTP.flush();
        return promise;
    },

    markRead: function (data){
        let url = '/data/remark_or_del_msg/';
        let dataSave = {};
        if( data["is_del"] ){
            dataSave = {"checkIds":JSON.stringify(data['id']),"is_del":data['is_del']};
        }else{
            dataSave = {"checkIds":JSON.stringify(data['id'])};
        }
        return this.http.post( url,this.formatParams(dataSave),{headers:this.headers} )
            .toPromise()
            .then( res=> { return res.json() })
    },

    batchDelete: function (data){
        let url = '/data/remark_or_del_msg/';
        let dataSave = {};
        if( data["is_del"] ){
            dataSave = {"checkIds":JSON.stringify(data['id']),"is_del":data['is_del']};
        }else{
            dataSave = {"checkIds":JSON.stringify(data['id'])};
        }
        return this.http.post( url,this.formatParams(dataSave),{headers:this.headers} )
            .toPromise()
            .then( res=> { return res.json() })
    }

}