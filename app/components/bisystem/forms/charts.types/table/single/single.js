/**
 * Created by birdyy on 2017/8/23.
 * 单行表格
 */

import {BiBaseComponent} from '../../../../bi.base.component';
import msgbox from "../../../../../../lib/msgbox";
import "./single.scss";
import template from './single.html';

let config = {
    template:template,
    data: {
        columns: [],
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
            if (parseInt(value) !== NaN) {
                me.data.columns = new Array(value).fill(value);
                for (let i = 1; i<value;i++) {
                    me.data.columns.push(i);
                };
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
     * 设置选中字段
     * @param columns = 已选中字段
     */
    setColumns(columns) {
        this.data.columns = columns;
    }


}