/**
 * Created by birdyy on 2017/8/23.
 * 单行表格
 */
import "./single.scss";
import template from './single.html';
import {Base} from '../base';

let config = {
    template:template,
    data: {
        columns: [],
        choosed: [],
        show:false,
        singleNum: 1
    },
    binds: [
    ],
    actions: {
        /**
         * 设置选中字段
         * @param columns = 已选中字段
         */
        setColumns(choosed) {
            let num = this.data.singleNum;
            let choosedNum = Math.ceil(choosed.length / num);
            let arr = [];
            choosed.forEach((val, index,items) => {
                val = items.slice(index * choosedNum, index * choosedNum + choosedNum);
                arr.push(val);
            });
            this.data.choosed = arr.filter(item => item.length > 0);
            this.reload();
        },

        /**
         * 清空字段
         */
        clear() {
            console.log('this is a test!');
            this.data.choosed = [];
            this.reload();
        }

    },
    afterRender() {},
};

export class TableSingle extends Base{
    constructor(data, event){
        super(config, data, event)
    }
}