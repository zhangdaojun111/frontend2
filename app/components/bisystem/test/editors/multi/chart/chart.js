import {Base} from '../../base';
import template from './chart.html';

import {chartName,theme,icon} from '../../form.chart.common';
import {ChartFormService} from '../../../../../../services/bisystem/chart.form.service';
import msgbox from "../../../../../../lib/msgbox";
import Mediator from '../../../../../../lib/mediator';

let config = {
    template: template,
    actions: {
        /**
         * 加载x 和y轴数据
         * @param data 选中的数据源
         */
        async getFields(data) {
            let table = data ? data : null;
            if (table) {
                let res = await ChartFormService.getChartField(table.id);
                if (res['success'] === 1){
                    this.actions.loadColumns(res['data']);
                } else {
                    msgbox.alert(res['error'])
                }
            } else {
                this.actions.loadColumns(table);
            }
        },

        /**
         * 渲染多表图表x,y
         * @param data x_field,y_field列表字段
         */
        async loadColumns(data) {
            if (this.formItems['xAxis'] && this.formItems['yAxis']) {
                if (data) {
                    this.formItems['xAxis'].setList(data['x_field']);
                    this.formItems['yAxis'].setList(data['y_field']);
                    // 编辑模式下第一次不清空y轴字段列表
                    if (!this.data.firstDo) {
                        this.formItems['columns'].actions.clear();
                    };
                    this.data.firstDo = false;
                } else { // 清空字段
                    this.formItems['xAxis'].setList([]);
                    this.formItems['yAxis'].setList([]);
                    this.formItems['columns'].actions.clear();
                };

            }
        },

        /**
         * 初始化图表操作
         */
       async init() {
           this.formItems['source'].setList(this.data.source);
        },
        /**
         * 添加y轴
         */
        addyAxis(y) {
            _.remove(this.formItems['columns'].data.list, (column) => {
                return JSON.parse(column.value).id === y.id;
            });
            this.formItems['columns'].data.list.push({value: JSON.stringify(y), name: y['name']});
            this.formItems['columns'].reload();
            this.formItems['columns'].actions.selectAll();
        },

        /**
         * 删除图表
         */
        removeChart() {
            this.trigger('onRemoveChart', this.componentId);
            this.destroySelf();
        },
        /**
         *已选择的y轴字段
         * @param list = y轴字段列表
         */
        selectY(list) {
            let data = list.map(val => {
                return {value: JSON.stringify(val), name: val['name']}
            });
            this.formItems['columns'].data.list = data;
            this.formItems['columns'].reload();
            this.formItems['columns'].actions.selectAll();
        }
    },
    data: {
        options: [
            {
                label: '',
                name: 'source',
                defaultValue: '',
                type: 'autocomplete',
                placeholder: '选择数据来源',
                events: {
                    onSelect(value) {
                        this.actions.getFields(value);
                    }
                }
            },
            {
                label: '',
                name: 'chartType',
                defaultValue: 'line',
                type: 'select',
                list: [
                    {value: 'line', name: '折线图'},
                    {value: 'bar', name: '柱状图'}
                ],
                events: {
                }
            },
            {
                label: '',
                name: 'xAxis',
                defaultValue: '',
                type: 'autocomplete',
                placeholder: '选择X轴字段',
                events: {}
            },
            {
                label: '',
                name: 'yAxis',
                defaultValue: '',
                type: 'autocomplete',
                placeholder: '选择Y轴字段',
                events: {
                    onSelect(value) {
                        if(value) {
                            this.actions.addyAxis(value);
                            this.formItems['yAxis'].autoselect.actions.clearValue();
                        }
                    }
                }
            },
            {
                label: '',
                name: 'columns',
                defaultValue: [],
                list:[],
                type: 'checkbox',
                events: {
                    onChange:function(value) {
                        let list = _.cloneDeep(value);
                        this.actions.selectY(list);
                    }
                }
            },
        ]
    },
    binds:[
        {
            event: 'click',
            selector: '.remove-y-btn',
            callback: function (context) {
                this.actions.removeChart();
            }
        }
    ],
    async afterRender() {
        // 渲染图表表单字段
        this.drawForm('.form-group-chart');
        this.actions.init();
    }
};

class ChartEditor extends Base {
    constructor(data, event) {
        super(config, data, event);
    }

    /**
     * 获取多表chart数据
     * @returns {{chartType: *, countColumn: string, filter: Array, filter_rule: {}, sources, xAxis, yAxis}}
     */
    getChartData() {
        let data = this.getData();
        console.log(data);
        let chart = {
            chartType: data.chartType == 'line' ? {'name': '折线图', 'type': 'line'} : {'name': '柱状图', 'type': 'bar'},
            countColumn: '',
            filter: [],
            filter_rule: {},
            sources: data.source,
            xAxis: data.xAxis,
            yAxis: data.columns
        }
        return chart;
    }

    /**
     * 设置chart(编辑模式下)
     * @param data
     */
    setValue(data) {
        this.formItems['source'].setValue(data['sources']);
        this.formItems['chartType'].setValue(data['chartType']['type']);
        this.formItems['xAxis'].setValue(data['xAxis']);
        this.actions.selectY(data['yAxis']);
        this.data.firstDo = true;
    }
}

export {ChartEditor}