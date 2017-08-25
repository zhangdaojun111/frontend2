/**
 * Created by birdyy on 2017/8/21.
 * 多表图表的单个图表组件
 */

import {BiBaseComponent} from '../../../../bi.base.component';
import {instanceFitting, groupFitting} from '../../../fittings/export.fittings';
import Mediator from '../../../../../../lib/mediator';
import msgbox from "../../../../../../lib/msgbox";
import {FormSearchComponent} from '../../../search/search';
import template from './chart.html';
import "./chart.scss";
import {ChartFormService} from '../../../../../../services/bisystem/chart.form.service';

let config = {
    template:template,
    data: {
        yAxis: []
    },
    actions: {},
    afterRender() {
        this.renderFitting();
    },
    firstAfterRender() {
        this.el.on('click','.multi-close',()=>{
            this.multiDel();
        });
    },
    beforeDestory() {}
};

export class MultiChartComponent extends BiBaseComponent{
    constructor() {
        super(config);
    }

    /**
     * 添加图标 配置 fittings
     */
    renderFitting() {
        let multiSearch = new FormSearchComponent();
        this.append(multiSearch, this.el.find('.item-senior'));

        this.multiChart = {
            multiShare:multiSearch,
            multiSource: instanceFitting({
                type:'autoComplete',
                me: this,
                data: {
                    onSelect:this.getChartField.bind(this)
                },
                container: 'item-source'
            }),
            multiType: instanceFitting({
                type:'select',
                data: {
                    value:'line',
                    label: '图表类型',
                    options:[
                        {value: 'line', name: '折线图'},
                        {value: 'bar', name: '柱状图'}
                    ],

                },
                me: this,
                container: 'item-type'
            }),
            multiX: instanceFitting({
                type:'autoComplete',
                me: this,
                container: 'item-x'
            }),
            multiY: instanceFitting({
                type:'autoComplete',
                me: this,
                data: {
                    onSelect:this.choosedYs.bind(this)
                },
                container: 'item-filed .item-y'
            }),
            multiCheckbox: instanceFitting({
                type:'checkbox',
                me: this,
                data: {
                    value:null,
                    items:[],
                    checkedItems: [],
                    checkboxs:[],
                    onChange: this.removeY.bind(this)

                },
                container: 'item-filed .item-y'
            }),
        }
    };

    /**
     * 删除一张图表
     */
    multiDel(){
        this.destroySelf();
    }

    /**
     * 获取x,y轴
     */
    async getChartField(tableId) {
        const table = tableId.length > 0 ? tableId[0] : null;
        let data;
        if (this.multiChart) {
            if (table) {
                let res = await ChartFormService.getChartField(table.id);
                if (res['success'] === 1) {
                    data = res['data'];
                    this.multiChart.multiX.autoSelect.data.list = res['data']['x_field'];
                    this.multiChart.multiY.autoSelect.data.list = res['data']['y_field'];
                } else {
                    msgbox.alert(res['error']);
                };
            } else {
                data = [];
                this.multiChart.multiX.autoSelect.data.list = data;
                this.multiChart.multiY.autoSelect.data.list = data;
            };

            this.multiChart.multiX.autoSelect.data.choosed = [];
            this.multiChart.multiX.autoSelect.reload();
            this.multiChart.multiY.autoSelect.data.choosed = [];
            this.multiChart.multiY.autoSelect.reload();
        }
    }

    /**
     * 选择多y轴
     */
    choosedYs() {
        if (this.multiChart) {
            let y = this.multiChart.multiY.getValue();
            if (y.hasOwnProperty('id')) {
                let yAxis = _.clone(this.data.yAxis);
                let r = _.remove(yAxis, (val) => {
                    return y.id === val.id
                });

                if (r.length === 0) {
                    this.data.yAxis.push(y);
                }
                this.multiChart.multiY.autoSelect.actions.clearValue();
                this.multiChart.multiCheckbox.data.checkboxs = this.data.yAxis;
                this.multiChart.multiCheckbox.data.items = this.data.yAxis;
                this.multiChart.multiCheckbox.data.items.checkedItems = this.data.yAxis;
                this.multiChart.multiCheckbox.reload();
                this.multiChart.multiCheckbox.setCheck();
            }
        }
    }

    /**
     * 删除y轴
     */
    removeY(checked) {
        if (!checked) {
            this.data.yAxis = this.multiChart.multiCheckbox.data.items = this.multiChart.multiCheckbox.data.checkboxs = this.multiChart.multiCheckbox.data.checkedItems;
            this.multiChart.multiCheckbox.reload();
            this.multiChart.multiCheckbox.setCheck();
        }
    }

    /**
     * 获取值
     */

    getValue() {
        const fields  = this.multiChart;
        const data = {};
        Object.keys(fields).map(k => {
            if (fields[k].getValue) {
                data[k] = fields[k].getValue();
            };
        });

        return {
            chartType: data.multiType == 'line' ? {'name': '折线图', 'type': 'line'} : {'name': '柱状图', 'type': 'bar'},
            countColumn: '',
            filter: [],
            sources: data.multiSource,
            xAxis: data.multiX,
            yAxis: data.multiCheckbox
        }
    }
}