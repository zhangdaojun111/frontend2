import {Base} from '../base';
import template from './table.html';
import './table.scss';

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
                    this.actions.loadColumns(res['data']['x_field']);
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
                    this.formItems['columns'].setList(columns);
                    this.formItems['sortColumns'].setList(columns);
                } else { // 清空字段
                    this.formItems['columns'].actions.clear();
                    this.formItems['choosed'].actions.clear();
                    this.formItems['table_single'].actions.clear();
                    this.formItems['sortColumns'].setList([]);
                }
            }
        },

        /**
         * 初始化图表操作
         */
       async init() {
           this.formItems['single'].trigger('onChange');

           // 获取数据来源
            ChartFormService.getChartSource().then(res => {
                if (res['success'] === 1) {
                    this.formItems['source'].setList(res['data']);
                } else {
                    msgbox.alert(res['error'])
                };
            });

            // 获取图标
           const res = await ChartFormService.getChartIcon();
            if (res['success'] === 1) {
                let icons =[];
                icons = res['data'].map(icon => {
                    return {value: icon, name: `<img src=/bi/download_icon/?file_id=${icon} />`}
                });
                this.formItems['icon'].setList(icons)
            } else {
                msgbox.alert(res['error'])
            };
            return Promise.resolve(res);
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
                assortment: 'table',
                chartName:{id: '', name: data.chartName},
                countColumn:{},
                columns:data.columns,
                icon: data.icon,
                source: data.source,
                theme: data.theme,
                filter: [],
                countNum: data.countNum,
                single:data.single[0] ? data.single[0]: 0,
                singleColumnWidthList:[],
                sort: data.sort,
                sortColumns:data.sortColumns ? [data.sortColumns] : [],
                alignment:data.alignment,
                columnNum:data.columnNum
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
                label: '请选择列名',
                name: 'columns',
                defaultValue: [],
                list: [],
                type: 'checkbox',
                events: {
                    onChange:function(value) {
                        this.formItems['choosed'].actions.update(value);
                        this.formItems['table_single'].actions.setColumns(value, this.formItems['columnNum'].getValue());
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
                label: '默认排序',
                name: 'sort',
                defaultValue: '1',
                list: [
                    {value: '1',name: '升序'},
                    {value: '-1', name:'降序'}
                ],
                type: 'radio'
            },
            {
                label: '选择排序字段(非必选)',
                name: 'sortColumns',
                defaultValue: '',
                type: 'autocomplete'
            },
            {
                label: '表格文字对齐方式',
                name: 'alignment',
                defaultValue: 'left',
                list: [
                    {'value': 'left', 'name': '居左'},
                    {'value': 'center', 'name': '居中'},
                    {'value': 'right', 'name': '居右'},
                ],
                type: 'select'
            },
            {
                label: '请输入显示多少多少列(默认10条)',
                name: 'countNum',
                defaultValue: 10,
                type: 'text'
            },
            {
                label: '',
                name: 'single',
                defaultValue: [],
                list: [
                    {
                        value:1, name: '是否显示为单行'
                    }
                ],
                type: 'checkbox',
                events: {
                    onChange:function(value) {
                        if (value && value[0]) {
                            this.formItems['columnNum'].el.show();
                            this.formItems['countNum'].el.hide();
                            this.formItems['table_single'].el.show();
                        } else {
                            this.formItems['columnNum'].el.hide();
                            this.formItems['countNum'].el.show();
                            this.formItems['table_single'].el.hide();
                        };
                    }
                }
            },
            {
                label: '需要显示多少列',
                name: 'columnNum',
                defaultValue: '1',
                type: 'text',
                events: {
                    onChange: _.debounce(function(value) {
                        let columnNum = parseInt(value);
                        if (columnNum !== NaN) {
                            let num = this.formItems['table_single'].actions.setColumns(this.formItems['choosed'].data.list, columnNum);
                            this.formItems['columnNum'].setValue(num);
                        }
                    },500)
                }
            },
            {
                label: '',
                name: 'table_single',
                defaultValue: '',
                type: 'table_single',
                events: {}
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
        }
        // 渲染图表表单字段
        this.drawForm();
        await this.actions.init();
        this.formItems['chartName'].setValue(this.data.chart['chartName']['name']);
        this.formItems['source'].setValue(this.data.chart['source']);
        this.formItems['theme'].setValue(this.data.chart['theme']);
        this.formItems['icon'].setValue(this.data.chart['icon']);
        this.formItems['columns'].setValue(this.data.chart['columns']);
    }
}

class TableEditor extends Base {
    constructor(data) {
        config.data.chart_id = data.id ? data.id : null;
        super(config);
    }

    reset() {}
}

export {TableEditor}