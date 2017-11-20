import {Base} from '../base';
import template from './pie.html';

import {chartName,theme,icon,button,countColumn} from '../form.chart.common';
import {ChartFormService} from '../../../../../services/bisystem/chart.form.service';
import msgbox from "../../../../../lib/msgbox";
import Mediator from '../../../../../lib/mediator';
import './pie.scss';
import {canvasCellService} from '../../../../../services/bisystem/canvas.cell.service';

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
                if (table.count_fields.length > 0) {
                    let fields =[];
                    fields = table.count_fields.map(item => {
                        return {value: JSON.stringify(item), name: item.name}
                    });
                    this.formItems['countColumn'].setList(fields);
                    this.formItems['countColumn'].el.show();
                } else {
                    this.formItems['countColumn'].actions.clear();
                    this.formItems['countColumn'].el.hide();
                }
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
         * 渲染列名字段列表（x,y轴）
         * @param data 表格列表字段（x,y轴）
         */
        async loadColumns(data) {
            if (this.formItems['columns']) {
                if (data) {
                    this.formItems['xAxis'].setList(data['x_field']);
                    this.formItems['yAxis'].setList(data['y_field']);
                    this.formItems['columns'].setList(data['y_field']);
                    this.formItems['deepX'].setList(data['x_field']);

                } else { // 清空字段
                    this.formItems['columns'].actions.clear();
                    this.formItems['xAxis'].setList([]);
                    this.formItems['yAxis'].setList([]);
                    this.formItems['deepX'].setList([]);
                }
                if (this.formItems['deeps']) {
                    // 清除所有下穿字段数据
                    this.formItems['deeps'].actions.clear();
                }
            }
        },

        /**
         * 初始化图表操作
         */
        async init() {
            this.formItems['countColumn'].el.hide();
            this.formItems['pieType'].trigger('onChange', this.formItems['pieType'].data.value);
            this.formItems['limit'].trigger('onChange');
            // 获取数据来源
            ChartFormService.getChartSource().then(res => {
                if (res['success'] === 1) {
                    this.formItems['source'].setList(res['data']);
                } else {
                    msgbox.alert(res['error'])
                }
            });

            // 获取图标
            ChartFormService.getChartIcon().then(res => {
                if (res['success'] === 1) {
                    let icons =[];
                    icons = res['data'].map(icon => {
                        return {value: icon, name: `<img src=/bi/download_icon/?file_id=${icon} />`}
                    });
                    this.formItems['icon'].setList(icons)
                } else {
                    msgbox.alert(res['error'])
                }
            });

        },

        /**
         * 当是编辑模式时，此时所有操作都需要等到从服务器获取渲染完成后再渲染字段
         */
        async getChartData(id) {
            let layout = {
                "chart_id":id,
                "floor":0,
                "view_id":"",
                "layout_id":"",
                "xOld":{},
                "row_id":0,
                "deep_info":{}
            };
            const data = {
                layouts:[JSON.stringify(layout)],
                query_type:'deep',
                is_deep:1,
            };
            const chart = await canvasCellService.getCellChart(data);
            return Promise.resolve(chart);
        },

        /**
         * 保存图表数据
         */
        async saveChart() {
            let data = this.getData();
            let chart = {
                assortment: 'pie',
                chartName:{id: this.data.chart ? this.data.chart.chartName.id : '', name: data.chartName},
                countColumn: typeof data.countColumn === 'string' ? JSON.parse(data.countColumn) : {},
                filter: data.filter.filter,
                filter_source: data.filter.filter_source,
                chartType: {
                    name: this.data.name,
                    type: this.data.type,
                },
                icon: data.icon,
                source: data.source,
                theme: data.theme,
                pieType: data.pieType == '1' ? {name: '单条数据', value: 1} : {name: '多条数据', value: 2},
                xAxis:data.xAxis,
                yAxis:data.pieType == '1' ? data.columns : data.yAxis,
                deeps: data.pieType == '1' ? [] : data.deeps,
                limit: data.limit[0] && data.limitNum ? data.limitNum : 0,
                endlimit:data.limit[0] && data.endLimitNum ? data.endLimitNum : 0,
            };
            let pass = true; // 判断表单是否验证通过
            for (let key of Object.keys(this.formItems)) {
                if (this.formItems[key].data.rules) {
                    if(key == 'columns' && chart.pieType.value == 2){
                        continue;
                    }
                    if(key == 'yAxis' && chart.pieType.value == 1){
                        continue;
                    }
                    let isValid = this.formItems[key].valid();
                    if (!isValid) {
                        pass = false;
                    }
                }
            }

            if (pass) {
                this.save(chart);
            }
        },

        /**
         * 编辑时填充表格配置
         * @param chart = this.data.chart
         */
        fillChart(chart) {
            this.formItems['chartName'].setValue(chart['chartName']['name']);
            this.formItems['source'].setValue(chart['source']);
            this.formItems['countColumn'].setValue(JSON.stringify(chart['countColumn']));
            this.formItems['theme'].setValue(chart['theme']);
            this.formItems['icon'].setValue(chart['icon']);
            this.formItems['filter'].setValue({filter: chart['filter'], filter_source:chart['filter_source']});
            this.formItems['columns'].setValue(chart['columns']);
            this.formItems['pieType'].setValue(chart['pieType']['value']);
            this.formItems['circular'].setValue(chart['chartType']['type']=='pie'? 1 : 2);
            this.formItems['xAxis'].setValue(chart['xAxis']);
            if (chart['pieType']['value'] == 1) {
                this.formItems['columns'].setValue(chart['yAxis']);
            } else {
                this.formItems['yAxis'].setValue(chart['yAxis']);
                this.formItems['deeps'].setValue(chart['deeps']);
            }
            if (chart['pieType']['value'] == 2) {
                this.formItems['limit'].setValue(chart['limit'] || chart['endlimit']  ? 1 : 0);
                this.formItems['limitNum'].setValue(chart['limit'] ? chart['limit'] : '');
                this.formItems['endLimitNum'].setValue(chart['endlimit'] ? chart['endlimit'] : '');
            }
        }
    },
    data: {
        type: 'pie',
        name: '饼图',
        options: [
            chartName,
            {
                label: '数据来源',
                name: 'source',
                defaultValue: '',
                placeholder: '选择数据来源',
                type: 'autocomplete',
                required: true,
                rules: [
                    {
                        errorMsg: '数据源不能为空',
                        type: 'required'
                    }
                ],
                events: {
                    onSelect(value) {
                        this.actions.getFields(value);
                    }
                }
            },
            countColumn,
            theme,
            icon,
            {
                label: '高级查询',
                name: 'filter',
                defaultValue: {},
                type: 'search',
                events: {
                    onShowAdvancedSearchDialog() {
                        let data = {
                            tableId: this.formItems['source'].data.value ? this.formItems['source'].data.value.id : '',
                            fieldsData: this.formItems['xAxis'].autoselect.data.list,
                            commonQuery: this.formItems['filter'].data.value && this.formItems['filter'].data.value.hasOwnProperty('filter') ? [this.formItems['filter'].data.value.filter_source] : null,
                        };
                        this.formItems['filter'].actions.showAdvancedDialog(data);
                    }
                }
            },
            {
                label: '选择单条数据，多条数据',
                name: 'pieType',
                defaultValue: '1',
                list: [
                    {name:'多条', value:'2'},
                    {name:'单条', value:'1'},
                ],
                type: 'select',
                events: {
                    onChange(value) {
                        if (value == 1) {
                            if (this.formItems['limit'].data.value.length > 0) {
                                this.formItems['limit'].el.find('input').trigger('click');
                            }
                            this.formItems['limit'].trigger('onChange');
                            this.formItems['limit'].el.hide();
                            this.formItems['columns'].el.show();
                            this.formItems['yAxis'].el.hide();
                            this.formItems['deeps'].el.hide();
                            this.formItems['deepX'].el.hide();
                            this.formItems['deeps'].actions.clear();
                        } else {
                            this.formItems['limit'].el.show();
                            this.formItems['columns'].el.hide();
                            this.formItems['yAxis'].el.show();
                            this.formItems['deeps'].el.show();
                            this.formItems['deepX'].el.show();
                        }
                    }
                }
            },
            {
                label: '选择图形类型',
                name: 'circular',
                defaultValue: '1',
                list: [
                    {name:'环形图', value:'2'},
                    {name:'饼图', value:'1'},

                ],
                type: 'select',
                events: {
                    onChange(value){
                        if(value === '2'){
                            this.data.name = '环形图';
                            this.data.type = 'circular';
                        }else{
                            this.data.name = '饼图';
                            this.data.type = 'pie';
                        }
                    }
                }
            },
            {
                label: 'x轴字段',
                name: 'xAxis',
                defaultValue: '',
                placeholder: '选择x轴字段',
                required: true,
                rules: [
                    {
                        errorMsg: 'x轴不能为空',
                        type: 'required'
                    }
                ],
                type: 'autocomplete'
            },
            {
                label: 'y轴字段',
                name: 'yAxis',
                defaultValue: '',
                placeholder: '选择y轴字段',
                required: true,
                rules: [
                    {
                        errorMsg: 'y轴不能为空',
                        type: 'required'
                    }
                ],
                type: 'autocomplete'
            },
            {
                label: '选择y轴数据',
                name: 'columns',
                defaultValue: [],
                list: [],
                required: true,
                rules: [
                    {
                        errorMsg: 'y轴不能为空',
                        type: 'required'
                    }
                ],
                type: 'checkbox',
                events: {
                    onChange:function () {
                        this.formItems['columns'].clearErrorMsg();
                    }
                }
            },

            {
                label: '选择下穿x轴字段',
                name: 'deepX',
                defaultValue: '',
                placeholder: '选择下穿x轴字段',
                type: 'autocomplete',
                events: {
                    onSelect(value) {
                        if (value) {
                            this.formItems['deeps'].actions.update(value);
                            this.formItems['deepX'].autoselect.actions.clearValue()
                        };
                    }
                }
            },
            {
                label: '',
                name: 'deeps',
                defaultValue: [],
                type: 'deep',
                events: {}
            },
            {
                label: '更多设置',
                name: 'defaultY',
                defaultValue: [],
                type: 'checkbox',
            },
            {
                label: '',
                name: 'limit',
                defaultValue: [],
                list: [
                    {
                        value:1, name: '默认展示多少条数据'
                    }
                ],
                type: 'checkbox',
                events: {
                    onChange:function(value) {
                        if (value && value[0]) {
                            this.formItems['limitNum'].el.show();
                            this.formItems['endLimitNum'].el.show();
                        } else {
                            this.formItems['limitNum'].el.hide();
                            this.formItems['endLimitNum'].el.hide();
                        }
                    }
                }
            },
            {
                label: '',
                name: 'limitNum',
                defaultValue: 0,
                placeholder: '请输入显示前多少条数据',
                category: 'number',
                textTip:'请输入显示前多少条数据：',
                type: 'text',
                class: 'limitNum',
                events: {}
            },
            {
                label: '',
                name: 'endLimitNum',
                defaultValue: 0,
                placeholder: '请输入显示后多少条数据',
                category: 'number',
                textTip:'请输入显示后多少条数据：',
                type: 'text',
                class: 'endLimitNum',
                events: {}
            },
            {
                label: '',
                name: '保存',
                defaultValue: '',
                type: 'button',
                events: {
                    save() {
                        this.actions.saveChart();
                    }
                }
            },
            button

        ]
    },
    async afterRender() {
        if(this.data.chart_id) {
            const res = await this.actions.getChartData(this.data.chart_id);
            if (res[0]['success'] === 1) {
                this.data.chart = res[0]['data']
            } else {
                msgbox.alert(res[0]['error'])
            }
        }

        // 渲染图表表单字段
        this.drawForm();
        this.actions.init();

        if (this.data.chart_id) {
            this.actions.fillChart(this.data.chart);
        }

    }
};

class PieEditor extends Base {
    constructor(data,extendConfig) {
        config.data.chart_id = data.id ? data.id : null;
        super($.extend(true,{},config,extendConfig));
    }
}

export {PieEditor}