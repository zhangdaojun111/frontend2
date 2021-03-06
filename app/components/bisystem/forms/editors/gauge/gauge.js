import {Base} from '../base';
import template from './gauge.html';

import {chartName,theme,icon,button,countColumn} from '../form.chart.common';
import {ChartFormService} from '../../../../../services/bisystem/chart.form.service';
import msgbox from "../../../../../lib/msgbox";
import Mediator from '../../../../../lib/mediator';
import {canvasCellService} from '../../../../../services/bisystem/canvas.cell.service';
import './gauge.scss';

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
                    this.formItems['countColumn'].setValue(this.formItems['countColumn'].data.list[0].value);
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
         * 渲染列名字段列表（y轴）
         * @param data 表格列表字段（y轴）
         */
        async loadColumns(data) {
            if (this.formItems['yAxis']) {
                if (data) {
                    this.formItems['yAxis'].setList(data['y_field']);
                } else { // 清空字段
                    this.formItems['yAxis'].setList([]);
                }
            }
        },

        /**
         * 初始化图表操作
         */
        async init() {
            this.formItems['countColumn'].el.hide();
            this.formItems['customAccuracy'].trigger('onChange');
            this.formItems['customTextStyle'].trigger('onChange');
            // 获取数据来源
            const res = await ChartFormService.getChartSource();
            if (res['success'] === 1) {
                this.formItems['source'].setList(res['data']);
            } else {
                msgbox.alert(res['error'])
            }

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
                assortment: 'gauge',
                chartName:{id: this.data.chart ? this.data.chart.chartName.id : '', name: data.chartName},
                countColumn: typeof data.countColumn === 'string' ? JSON.parse(data.countColumn) : {},
                filter: data.filter.filter,
                filter_source: data.filter.filter_source,
                icon: data.icon,
                source: data.source,
                theme: data.theme,
                yAxis: [data.yAxis],
                customAccuracy: data.customAccuracy[0] && data.customAccuracyNum ? data.customAccuracyNum : 0,
                customTextStyle: data.customTextStyle[0] ? {titleSize: data.titleSize,chartSize: data.chartSize} : {},
            };
            let pass = true; // 判断表单是否验证通过
            for (let key of Object.keys(this.formItems)) {
                if (this.formItems[key].data.rules) {
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
            this.formItems['yAxis'].setValue(chart['yAxis'][0]);
            this.formItems['customAccuracy'].setValue(chart['customAccuracy'] ? 1 : 0);
            this.formItems['customAccuracyNum'].setValue(chart['customAccuracy'] ? chart['customAccuracy'] : 1);
            this.formItems['customTextStyle'].setValue(chart['customTextStyle'].hasOwnProperty('titleSize') ? 1 : 0);
            this.formItems['titleSize'].setValue(chart['customTextStyle'].hasOwnProperty('titleSize') ? chart['customTextStyle']['titleSize'] : 14);
            this.formItems['chartSize'].setValue(chart['customTextStyle'].hasOwnProperty('chartSize') ? chart['customTextStyle']['chartSize'] : 12);
        }
    },
    data: {
        countColumn:{
            required: true
        },
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
                            fieldsData: this.formItems['yAxis'].autoselect.data.list,
                            commonQuery: this.formItems['filter'].data.value && this.formItems['filter'].data.value.hasOwnProperty('filter') ? [this.formItems['filter'].data.value.filter_source] : null,
                        };
                        this.formItems['filter'].actions.showAdvancedDialog(data);
                    }
                }
            },
            {
                label: 'Y轴字段',
                name: 'yAxis',
                defaultValue: '',
                placeholder: '选择Y轴字段',
                required: true,
                rules: [
                    {
                        errorMsg: 'Y轴不能为空',
                        type: 'required'
                    }
                ],
                type: 'autocomplete'
            },
            {
                label: '更多设置',
                name: 'customAccuracy',
                defaultValue: [],
                list: [
                    {
                        value:1, name: '自定义设置精度'
                    }
                ],
                type: 'checkbox',
                class:'customAccuracy',
                events: {
                    onChange:function(value) {
                        if (value && value[0]) {
                            this.formItems['customAccuracyNum'].el.show();
                        } else {
                            this.formItems['customAccuracyNum'].el.hide();
                        }
                    }
                }
            },
            {
                label: '',
                name: 'customAccuracyNum',
                defaultValue: '1',
                category: 'number',
                textTip:'请输入自定义精度：',
                type: 'text',
                class: 'customAccuracyNum',
                events: {}
            },
            {
                label: '',
                name: 'customTextStyle',
                defaultValue: [],
                list: [
                    {
                        value:1, name: '自定义字体大小'
                    }
                ],
                type: 'checkbox',
                events: {
                    onChange:function(value) {
                        if (value && value[0]) {
                            this.formItems['titleSize'].el.show();
                            this.formItems['chartSize'].el.show();
                        }else{
                            this.formItems['titleSize'].el.hide();
                            this.formItems['chartSize'].el.hide();
                        }
                    }
                }
            },
            {
                label: '',
                name: 'titleSize',
                defaultValue:'14',
                placeholder: '标题字体大小',
                type: 'text',
                category: 'number',
                textTip:'标题字体大小：',
                class: 'titleSize',
                events: {}
            },
            {
                label: '',
                name: 'chartSize',
                defaultValue: '12',
                placeholder: '图表字体大小',
                category: 'number',
                type: 'text',
                class: 'chartSize',
                textTip:'图表字体大小：',
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
    beforeRender(){
        this.data.chart_id = this.data.id
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
        await this.actions.init();

        if (this.data.chart_id) {
            this.actions.fillChart(this.data.chart);
        }

    }
};

let GaugeEditor = Base.extend(config);

export {GaugeEditor}