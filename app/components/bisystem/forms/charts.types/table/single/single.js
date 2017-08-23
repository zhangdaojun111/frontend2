/**
 * Created by birdyy on 2017/8/23.
 * 单行表格
 */

import {BiBaseComponent} from '../../../../bi.base.component';
import msgbox from "../../../../../../lib/msgbox";
import "./single.scss";
import template from './single.html';
import handlebars from 'handlebars';

let config = {
    template:template,
    data: {
        columns: [1],
        choosed: [],
        show:false,
        singleNum: 1
    },
    actions: {},
    afterRender() {
    },
    firstAfterRender() {
        let me = this;
        this.el.on('input', '.single-column-num',_.debounce(function(event) {
            let value = $(this).val();
            let columns = [];
            if (parseInt(value) !== NaN) {
                for (let i = 1; i<=value;i++) {
                    columns.push(i);
                };
                columns.sort((a,b) => a-b);
                this.data.columns = columns;
                me.data.singleNum = value;
                me.reload();
            }
            return false;
        },500));
    },
    beforeDestory() {}
};

export class FormSingleComponent extends BiBaseComponent{
    constructor() {
        super(config);
    }

    /**
     * 初始化
     */
    init() {
        // this.data.columns = this.data.singleNum;
    }

    /**
     * 设置选中字段
     * @param columns = 已选中字段
     */
    setColumns(choosed) {
        let num = this.data.singleNum;
        console.log(num);
        let choosedNum = Math.ceil(choosed.length / num);
        let arr = [];
        choosed.forEach((val, index,items) => {
            val = items.slice(index * choosedNum, index * choosedNum + choosedNum);
            arr.push(val);
        });
        this.data.choosed = this.data.columns =arr;
        this.reload();
    }
}