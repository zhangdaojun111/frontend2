import {Base} from '../base';
import template from './radar.html';

import {chartName,theme,icon,button} from '../form.chart.common';
import {ChartFormService} from '../../../../../services/bisystem/chart.form.service';
import msgbox from "../../../../../lib/msgbox";
import Mediator from '../../../../../lib/mediator';
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
         * 渲染列名字段列表（x轴）
         * @param columns 表格列表字段（x轴）
         */
        async loadColumns(columns) {
            if (this.formItems['columns']) {
                if (columns) {
                    this.formItems['columns'].setList(columns['y_field']);
                    this.formItems['product'].setList(columns['x_field']);
                } else { // 清空字段
                    this.formItems['columns'].actions.clear();
                    this.formItems['choosed'].actions.clear();
                    this.formItems['product'].setList([]);
                }
            }
        },

        /**
         * 初始化图表操作
         */
       async init() {
           // 获取数据来源
            ChartFormService.getChartSource().then(res => {
                if (res['success'] === 1) {
                    this.formItems['source'].setList(res['data']);
                } else {
                    msgbox.alert(res['error'])
                };
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
               };
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
            }
            const data = {
                layouts:[JSON.stringify(layout)],
                query_type:'deep',
                is_deep:1,
            }
            const chart = await canvasCellService.getCellChart(data);
            return Promise.resolve(chart);
        },

        /**
         * 保存图表数据
         */
        async saveChart() {
            let data = this.getData();
            let chart = {
                assortment: 'radar',
                chartName:{id: this.data.chart ? this.data.chart.chartName.id : '', name: data.chartName},
                countColumn:'',
                filter: data.filter,
                columns:data.columns,
                product:data.product,
                icon: data.icon,
                source: data.source,
                theme: data.theme,
            };

            let pass = true; // 判断表单是否验证通过
            for (let key of Object.keys(this.formItems)) {
                if (this.formItems[key].data.rules) {
                    let isValid = this.formItems[key].valid();
                    if (!isValid) {
                        pass = false;
                    };
                }
            };

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
            this.formItems['theme'].setValue(chart['theme']);
            this.formItems['icon'].setValue(chart['icon']);
            this.formItems['filter'].setValue(chart['filter']);
            this.formItems['columns'].setValue(chart['columns']);
            this.formItems['product'].setValue(chart['product']);
        }
    },
    data: {
        options: [
            chartName,
            {
                label: '数据来源',
                name: 'source',
                defaultValue: '',
                placeholder: '请选择数据来源',
                type: 'autocomplete',
                required:true,
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
                            commonQuery: this.formItems['filter'].data.value ? [this.formItems['filter'].data.value.filter_source] : null,
                        };
                        this.formItems['filter'].actions.showAdvancedDialog(data);
                    }
                }
            },
            {
                label: '选中雷达图名称字段',
                name: 'product',
                defaultValue: '',
                required: true,
                rules: [
                    {
                        errorMsg: '雷达图名称字段不能为空',
                        type: 'required'
                    }
                ],
                type: 'autocomplete'
            },
            {
                label: '请选择列名',
                name: 'columns',
                defaultValue: [],
                list: [],
                type: 'checkbox',
                required: true,
                rules: [
                    {
                        errorMsg: '请至少选择一个列名',
                        type: 'required'
                    }
                ],
                events: {
                    onChange:function(value) {
                        this.formItems['columns'].clearErrorMsg();
                        this.formItems['choosed'].actions.update(value);
                    }
                }
            },
            {
                label: '已选择列名',
                name: 'choosed',
                defaultValue: '',
                list: [],
                type: 'choosed'
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
            };
        };

        // 渲染图表表单字段
        this.drawForm();
        this.actions.init();

        if (this.data.chart_id) {
            this.actions.fillChart(this.data.chart);
        }

    }
}

class RadarEditor extends Base {
    constructor(data) {
        config.data.chart_id = data.id ? data.id : null;
        super(config);
    }
}

export {RadarEditor}