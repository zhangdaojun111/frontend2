/**
 * Created by birdyy on 2017/7/31.
 * 表格图表配置
 */
import {BiBaseComponent} from '../../../../../bi.base.component';
import template from './cell.table.html';
import "./cell.table.scss";

let config = {
    template: template,
    data: {
        rows: [],
        chart: {},
    },
    actions: {
        init(cellChart) {
            if (cellChart['chart']['single'] === 1) {
                config.actions.singleTable(cellChart);
            }
        },

        /**
         * 用于组装单行表格所需数据
         * @param cellChart = 表格的原始数据
         */
        singleTable(cellChart) {
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
            };

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
            };
            config.data.rows = tableRows;

        }
    },
    afterRender() {}
};
export class CellTableComponent extends BiBaseComponent {
    constructor(cellChart) {
        config.data.chart = cellChart['chart'] ? cellChart['chart'] : null;
        config.actions.init(cellChart);
        super(config);
    }
}
