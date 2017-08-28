/**
 * Created by birdyy on 2017/8/16.
 * title: chart source数据源
 */

import {BiBaseComponent} from '../../bi.base.component';
import {ChartFormService} from '../../../../services/bisystem/chart.form.service';
import msgbox from "../../../../lib/msgbox";
import Mediator from '../../../../lib/mediator';
import template from './chart.source.html';
import {AutoCompleteComponent1} from '../fittings/autocomplete1/autocomplete';

let config = {
    template: template,
    data: {
        chart: null,
        assortment: ''
    },
    actions: {},
    afterRender() {},
    firstAfterRender() {
        this.init();
    }
};

export class FormChartSourceComponent extends BiBaseComponent {
    constructor(chart) {
        super(config);
        this.data.assortment = chart['assortment'];
    }

    /**
     * 初始化
     */
    init() {
        const data = {
            items: [], // autocomplete 原始数据列表
            select: null, //当前选中的值
            onChange: this.getChartField.bind(this), // 当值改变时，如果设置了会触发
            onInput: this.clearChartField.bind(this), // 当source输入改变时，清空x,y轴数据
            title: '请选择数据源',
        }
        this.source = new AutoCompleteComponent1(data);
        this.append(this.source, this.el.find('.chart-sources'));
    }

    /**
     * 设置值
     */
    setItems(data) {
        this.source.setItems(data);
    }

    /**
     * 设置编辑模式的值
     */
    setValue(chart) {
        this.source.setValue(chart);
        this.getChartField(chart);
    }

    /**
     * 获取x,y轴
     */
    async getChartField(source) {
        const table = source['id'] ? source : null;
        let data;
        if (table) {
            let res = await ChartFormService.getChartField(table.id);
            if (res['success'] === 1) {
                data = res['data'];
            } else {
                msgbox.alert(res['error']);
            }
        } else {
            data = [];
        };
        this.messager(`${this.data.assortment}:fields:ready`, {data: data});
    }

    clearChartField() {
        this.messager(`${this.data.assortment}:fields:ready`, {data: []});
    }

    /**
     * 返回当前数据源返回值
     */
    getValue() {
        return this.source.getValue();
    }

}