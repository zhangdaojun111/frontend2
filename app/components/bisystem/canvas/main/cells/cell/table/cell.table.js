/**
 * Created by birdyy on 2017/7/31.
 * 表格图表配置
 */
import {CellBaseComponent} from '../base';
import template from './cell.table.html';
import "./cell.table.scss";

let config = {
    template: template,
    data: {
        rows: [],
        chart: {},
    },
    actions: {

        //打开局部的弹窗
        openSelfIframe: function (url, title, w, h) {
            w = window.screen.width * 0.8;
            h = window.screen.height * 0.6;
            PMAPI.openDialogToSelfByIframe(url, {
                width: w || 1400,
                height: h || 800,
                title: title,
                modal: true,
                defaultMax: true,
                // customSize: true
            }).then((data) => {
                if (data == 'success' || data.refresh) {
                    this.actions.timeDelayRefresh();
                }
            })
        },

        //操作列点击事件
        gridHandle: function (data) {
            console.log("操作");
            console.log(data);
            console.log(this.data.namespace);
            if (data.event.srcElement.className == 'gridView') {
                console.log('查看');
                let btnType = 'view';
                if (this.data.viewMode == 'in_process' || data["data"]["status"] == 2 || this.data.permission.edit == 0 || this.actions.viewOrEditPerm('view') || this.data.parent_btnType == 'none') {
                    btnType = 'none';
                }
                let obj = {
                    table_id: this.data.tableId,
                    parent_table_id: this.data.parentTableId,
                    parent_real_id: this.data.parentRealId,
                    parent_temp_id: this.data.parentTempId,
                    parent_record_id: this.data.parentRecordId,
                    real_id: data.data._id,
                    temp_id: data.data.temp_id || '',
                    record_id: data.data.record_id || '',
                    btnType: btnType,
                    is_view: 1,
                    in_process: this.data.viewMode == 'in_process' ? 1 : 0,
                    is_batch: (this.data.viewMode == 'createBatch' || this.data.viewMode == 'approveBatch') ? 1 : 0,
                    form_id: this.data.formId,
                    flow_id: data.data.flow_id || '',
                };
                let url = dgcService.returnIframeUrl('/iframe/addWf/', obj);
                let title = '查看';
                this.actions.openSelfIframe(url, title);
            }
            if (data.event.srcElement.className == 'gridEdit') {
                console.log('编辑');
                let btnType = 'edit';
                if (this.data.viewMode == 'in_process' || data["data"]["status"] == 2 || this.data.permission.edit == 0 || this.actions.viewOrEditPerm('edit')) {
                    btnType = 'none';
                }
                let obj = {
                    table_id: this.data.tableId,
                    parent_table_id: this.data.parentTableId,
                    parent_real_id: this.data.parentRealId,
                    parent_temp_id: this.data.parentTempId,
                    parent_record_id: this.data.parentRecordId,
                    real_id: data.data._id,
                    temp_id: data.data.temp_id || '',
                    btnType: btnType,
                    in_process: this.data.viewMode == 'in_process' ? 1 : 0,
                    is_batch: (this.data.viewMode == 'createBatch' || this.data.viewMode == 'approveBatch') ? 1 : 0,
                    form_id: this.data.formId,
                    flow_id: data.data.flow_id || '',
                };
                let url = dgcService.returnIframeUrl('/iframe/addWf/', obj);
                let title = '编辑';
                this.actions.openSelfIframe(url, title);
            }
            if (data.event.srcElement.className == 'gridHistory') {
                console.log('历史');
                let obj = {
                    table_id: this.data.tableId,
                    real_id: data.data._id
                };
                PMAPI.openDialogByIframe(`/iframe/historyApprove/`, {
                    width: 1000,
                    height: 600,
                    title: `历史`,
                    modal: true
                }, {obj}).then(res => {

                })
            }
            // //半触发操作
            // if (data.event.srcElement.className == 'customOperate') {
            //     let id = data["event"]["target"]["id"];
            //     for (let d of this.data.customOperateList) {
            //         if (d["id"] == id) {
            //             this.actions.customOperate(d, data);
            //         }
            //     }
            // }
            // //行级操作
            // if (data.event.srcElement.className == 'rowOperation') {
            //     let id = data["event"]["target"]["id"];
            //     for (let ro of this.data.rowOperation) {
            //         if (ro['row_op_id'] == id) {
            //             //在这里处理脚本
            //             //如果前端地址不为空，处理前端页面
            //             this.actions.doRowOperation(ro, data);
            //         }
            //     }
            // }
        }
    },
    afterRender() {}
};
export class CellTableComponent extends CellBaseComponent {
    // constructor(cellChart) {
    //     config.data.chart = cellChart['chart'] ? cellChart['chart'] : null;
    //     config.actions.init(cellChart);
    //     super(config);
    // }
    constructor(data,event,extendConfig) {
        let cellChart = CellTableComponent.init(data);
        super($.extend(true,{},config,extendConfig),cellChart,event);
    }

    static init(cellChart) {
        //格式化数据
        let data = cellChart.chart.data.rows;
        for (let k in data){
            for (let n in data[k]){
                let temp = data[k][n];
                if(CellTableComponent.isNumber(temp)){
                    data[k][n] = CellTableComponent.numFormat(temp);
                }
            }
        }

        if (cellChart['chart']['single'] === 1) {
            if (cellChart['chart']['data']['rows'][0]) {
                CellTableComponent.singleTable(cellChart);
            }
        }
        return cellChart
    }

    /**
     * 用于组装单行表格所需数据
     * @param cellChart = 表格的原始数据
     */
   static singleTable(cellChart) {
        let cellData = cellChart['chart'];
        const columnNum = cellData['columnNum']; // 显示多少列
        let rows = Math.ceil(cellData['columns'].length / columnNum); // 计算出显示多少行
        let list = []; // 组合 字段的name 和 value 成一个列表
        let columnList = []; // 获取每列字段
        let tableRows = []; // 单行表格每行的数据

        // 组装列字段和列数据
        cellData['columns'].forEach((title, index) => {
            list.push(title['name']);
            list.push(cellData['data']['rows'][0][index]);
        });

        // 显示每列的数据
        for (let i = 0; i < columnNum; i++) {
            columnList.push(list.slice(i * rows * 2, (i * rows + rows) * 2));
        }

        // 把每列的数据转化为行
        for (let i = 0; i < rows ; i++) {
            let row = [];
            columnList.forEach((val, index, items) => {
                if (index === items.length - 1) {
                    if (val.length < rows * 2) {
                        for (let i = 0; i < (rows * 2 - val.length); i++) {
                            val.push(' ');
                        }
                    }
                }
                val.slice(i * 2, i * 2 + 2).map(v => {
                    row.push(v);
                });
            });
            tableRows.push(row);
        }
        cellChart.rows = tableRows;
    }
    static numFormat(num) {
        num = parseFloat(Number(num)).toString().split(".");
        num[0] = num[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)','ig'),"$1,");
        return num.join(".");
    }

    static isNumber(value) {         //验证是否为数字
        let patrn = /^(-)?\d+(\.\d+)?$/;
        return !(patrn.exec(value) === null || value === "");
    }
}
