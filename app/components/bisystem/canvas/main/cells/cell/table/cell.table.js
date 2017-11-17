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
    actions: {},
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
