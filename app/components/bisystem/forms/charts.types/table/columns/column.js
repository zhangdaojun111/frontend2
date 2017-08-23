/**
 * Created by birdyy on 2017/8/23.
 * 表格列名选择
 */

import {BiBaseComponent} from '../../../../bi.base.component';
import msgbox from "../../../../../../lib/msgbox";
import "./column.scss";
import template from './column.html';
import {FormColumnChoosedComponent} from './choosed/choosed';

let config = {
    template:template,
    data: {
        columns: [],
        choosed: new Set()
    },
    actions: {},
    afterRender() {
        this.init();
    },
    firstAfterRender() {
        let me = this;
        this.el.on('change', 'input',function (event) {
            let checked = $(this).is(':checked');
            let index = $(this).closest('span').index();
            me.chooseColumn(checked,index)
        })

    },
    beforeDestory() {}
};

export class FormColumnComponent extends BiBaseComponent{
    constructor() {
        super(config);
        this.choosed = null;
    }

    /**
     * 初始化
     */
    init() {
        this.choosed = new FormColumnChoosedComponent();
        this.append(this.choosed, this.el.find('.choosed-columns'));
    }

    /**
     * 当数据源变化的时候重新渲染
     * @param 需要重新渲染的columns字段
     */
    reloadUi(data){
        this.data.columns = data['x_field'];
        this.data.choosed.clear();
        this.reload();
    }

    /**
     * 选择列名
     * @param checked = 是否选择，index = this.data.columns索引值
     */
    chooseColumn(checked,index) {
        if (checked) {
            this.data.choosed.add(this.data.columns[index]);
        } else {
            this.data.choosed.delete(this.data.columns[index])
        };
        this.choosed.data.choosed = Array.from(this.data.choosed);
        this.messager('test',this.choosed.data.choosed);
        this.choosed.reload();
    }
}