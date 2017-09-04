import {Base} from '../base';
import template from './pie.html';

import {chartName,theme,icon} from '../form.chart.common';
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
                };
                // 清除所有下穿字段数据
                this.formItems['deeps'].actions.clear();
            }
        },

        /**
         * 初始化图表操作
         */
       async init() {
            this.formItems['pieType'].trigger('onChange', this.formItems['pieType'].data.value);
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
                assortment: 'pie',
                chartName:{id: this.data.chart ? this.data.chart.chartName.id : '', name: data.chartName},
                countColumn:'',
                filter: [],
                chartType: {
                    name: '饼图',
                    type: 'pie'
                },
                icon: data.icon,
                source: data.source,
                theme: data.theme,
                pieType: data.pieType == '1' ? {name: '单条数据', value: 1} : {name: '多条数据', value: 2},
                xAxis:data.xAxis,
                yAxis:data.pieType == '1' ? data.columns : data.yAxis,
                deeps: data.pieType == '1' ? [] : data.deeps
            };
            let res = await ChartFormService.saveChart(JSON.stringify(chart));
            if (res['success'] == 1) {
                msgbox.alert('保存成功');
                if (!chart['chartName']['id']) {
                    this.reload();
                };
                Mediator.publish('bi:aside:update',{type: chart['chartName']['id'] ? 'update' :'new', data:res['data']})
            } else {
                msgbox.alert(res['error'])
            };
        },

        /**
         * 编辑时填充表格配置
         * @param chart = this.data.chart
         */
        fillChart(chart) {
            console.log(chart);
            this.formItems['chartName'].setValue(chart['chartName']['name']);
            this.formItems['source'].setValue(chart['source']);
            this.formItems['theme'].setValue(chart['theme']);
            this.formItems['icon'].setValue(chart['icon']);
            this.formItems['columns'].setValue(chart['columns']);
            this.formItems['pieType'].setValue(chart['pieType']['value']);
            this.formItems['xAxis'].setValue(chart['xAxis']);
            if (chart['pieType']['value'] == 1) {
                this.formItems['columns'].setValue(chart['yAxis']);
            } else {
                this.formItems['yAxis'].setValue(chart['yAxis']);
                this.formItems['deeps'].setValue(chart['deeps']);
            };
        }
    },
    data: {
        options: [
            chartName,
            {
                label: '数据来源',
                name: 'source',
                defaultValue: '',
                type: 'autocomplete',
                events: {
                    onSelect(value) {
                        this.actions.getFields(value);
                    }
                }
            },
            theme,
            icon,
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
                            this.formItems['columns'].el.show();
                            this.formItems['yAxis'].el.hide();
                            this.formItems['deeps'].el.hide();
                            this.formItems['deepX'].el.hide();
                            this.formItems['deeps'].actions.clear();
                        } else {
                            this.formItems['columns'].el.hide();
                            this.formItems['yAxis'].el.show();
                            this.formItems['deeps'].el.show();
                            this.formItems['deepX'].el.show();
                        }
                    }
                }
            },
            {
                label: 'x轴字段',
                name: 'xAxis',
                defaultValue: '',
                type: 'autocomplete'
            },
            {
                label: 'y轴字段',
                name: 'yAxis',
                defaultValue: '',
                type: 'autocomplete'
            },
            {
                label: '选择y轴数据',
                name: 'columns',
                defaultValue: [],
                list: [],
                type: 'checkbox',
                events: {}
            },
            {
                label: '',
                name: 'deeps',
                defaultValue: [],
                type: 'deep',
                events: {}
            },
            {
                label: '选择x轴字段',
                name: 'deepX',
                defaultValue: '',
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
                name: 'save',
                defaultValue: '',
                type: 'save',
                events: {
                    save() {
                        this.actions.saveChart();
                    }
                }
            },

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

class PieEditor extends Base {
    constructor(data) {
        config.data.chart_id = data.id ? data.id : null;
        super(config);
    }
}

export {PieEditor}