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
        columns: [],
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
            let value = parseInt($(this).val());
            let columns = [];
            if (value !== NaN) {
                let num = value;
                let choosedNum = Math.ceil(me.data.columns.length / num);
                let arr = [];
                me.data.columns.forEach((val, index,items) => {
                    val = items.slice(index * choosedNum, index * choosedNum + choosedNum);
                    arr.push(val);
                });
                me.data.choosed = arr.filter(item => item.length > 0);
                // console.log(choosedNum);
                me.data.singleNum = me.data.choosed.length;
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
        let choosedNum = Math.ceil(choosed.length / num);
        let arr = [];
        choosed.forEach((val, index,items) => {
            val = items.slice(index * choosedNum, index * choosedNum + choosedNum);
            arr.push(val);
        });
        this.data.choosed = arr.filter(item => item.length > 0);
        this.data.columns = choosed;
        this.reload();
    }


}