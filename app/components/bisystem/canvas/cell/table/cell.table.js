/**
 * Created by birdyy on 2017/7/31.
 */
import {BiBaseComponent} from '../../../bi.base.component';
import template from './cell.table.html';
import "./cell.table.scss";

let config = {
    template: template,
    data: {},
    // actions: {
    //     singleTableHandler(){
    //         columnNum = this.data['chart']['columnNum']; // 显示多少列
    //         let rows = Math.ceil(this.data['chart']['columns'].length / columnNum); // 计算出显示多少行
    //
    //         let list = []; // 组合 字段的name 和 value 成一个列表
    //         let columnList = []; // 获取每列字段
    //
    //         this.data['chart']['columns'].forEach((title, index) => {
    //             list.push(title['name']);
    //             list.push(this.data['chart']['data']['rows'][0][index]);
    //         });
    //
    //         for (let i = 0; i < columnNum; i++) {
    //             columnList.push(list.slice(i * rows * 2, (i * rows + rows) * 2));
    //         }
    //
    //         for (let i = 0; i < rows; i++) {
    //             let row = [];
    //             columnList.forEach((val, index, items) => {
    //                 if (index === items.length - 1) {
    //                     if (val.length < rows * 2) {
    //                         for (let i = 0; i < (rows * 2 - val.length); i++) {
    //                             val.push(' ');
    //                         }
    //                     }
    //                 }
    //                 val.slice(i * 2, i * 2 + 2).map(v => {
    //                     row.push(v);
    //                 });
    //             });
    //             this.rows.push(row);
    //         }
    //     }
    // },
    // afterRender(){
    //     if(this.data['chart']['data']['rows'][0]){
    //         this.singleTableHandler()
    //     }
    // }

};
export class CellTableComponent extends BiBaseComponent {
    constructor(cellChart) {
        config.data = cellChart ? cellChart : null;
        super(config);
        console.log(this.data);


    }
}
