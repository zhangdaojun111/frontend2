import {Base} from '../base';
import template from './message.html';
import './message.scss';
import {chartName,theme,icon,button,countColumn} from '../form.chart.common';
import {ChartFormService} from '../../../../../services/bisystem/chart.form.service';
import msgbox from "../../../../../lib/msgbox";
import Mediator from '../../../../../lib/mediator';
import {canvasCellService} from '../../../../../services/bisystem/canvas.cell.service';

let config = {
    template: template,
    actions:{
        /**
         * 初始化图表操作
         */
        async init() {
           this.formItems['countColumn'].el.hide();
           // this.formItems['single'].trigger('onChange');
           // 获取数据来源
            ChartFormService.getChartSource().then(res => {
                if (res['success'] === 1) {
                    this.formItems['source'].setList(res['data']);
                } else {
                    msgbox.alert(res['error'])
                }
            });
        },
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
                    this.data.xAxis = columns;
                    this.formItems['columns'].setList(columns);
                    this.formItems['sortColumns'].setList(columns);
                } else { // 清空字段
                    this.data.xAxis = [];
                    this.formItems['columns'].actions.clear();
                    this.formItems['choosed'].actions.clear();
                    // this.formItems['table_single'].actions.clear();
                    this.formItems['sortColumns'].setList([]);
                }
            }
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
         * 编辑时填充表格配置
         * @param chart = this.data.chart
         */
        fillChart(chart) {
            this.formItems['chartName'].setValue(chart['chartName']['name']);
            this.formItems['source'].setValue(chart['source']);
            this.formItems['countColumn'].setValue(JSON.stringify(chart['countColumn']));
            this.formItems['theme'].setValue(chart['theme']);
            this.formItems['icon'].setValue(chart['icon']);
            this.formItems['filter'].setValue({filter: chart['filter']?chart['filter']: '', filter_source:chart['filter_source']?chart['filter_source']:[]});
            this.formItems['columns'].setValue(chart['columns']);
            this.formItems['sort'].setValue(chart['sort']);
            this.formItems['sortColumns'].setValue(chart['sortColumns'][0]);
            this.formItems['alignment'].setValue(chart['alignment']);
            this.formItems['countNum'].setValue(chart['countNum']);
            this.formItems['single'].setValue(chart['single']);
            this.formItems['columnNum'].setValue(chart['columnNum']);
        },
        /**
         * 保存图表数据
         */
        async saveChart() {
            let data = this.getData();
            let chart = {
                assortment: 'table',
                chartName:{id: this.data.chart ? this.data.chart.chartName.id : '', name: data.chartName},
                countColumn: typeof data.countColumn === 'string' ? JSON.parse(data.countColumn) : {},
                columns:data.columns,
                icon: data.icon || '',
                source: data.source || '',
                theme: data.theme || '',
                filter: data.filter.filter || '',
                filter_source: data.filter.filter_source || '',
                countNum: data.countNum || '',
                single:data.single[0] ? data.single[0]: 0,
                singleColumnWidthList:[],
                sort: data.sort || '',
                sortColumns:data.sortColumns ? [data.sortColumns] : [],
                alignment:data.alignment,
                columnNum:data.columnNum
            };
            let pass = true; // 判断表单是否验证通过
            for (let key of Object.keys(this.formItems)) {
                if (this.formItems[key].data.rules) {
                    if(window.config.query_mark !== 'single' && key=='countColumn'){
                        continue;
                    }
                    let isValid = this.formItems[key].valid();
                    if (!isValid) {
                        pass = false;
                    }
                }
            }

            if(pass) {
                this.save(chart);
            }
        },
    },
    data: {
        options: [
            chartName,
            {
                label: '数据来源',
                name: 'source',
                defaultValue: '',
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
                        // console.log(value)
                        this.actions.getFields(value);
                    }
                }
            },
            countColumn,
            {
                label: '高级查询',
                name: 'filter',
                defaultValue: {},
                type: 'search',
                events: {
                    onShowAdvancedSearchDialog() {
                        let data = {
                            tableId: this.formItems['source'].data.value ? this.formItems['source'].data.value.id : '',
                            fieldsData: this.data.xAxis,
                            commonQuery: this.formItems['filter'].data.value && this.formItems['filter'].data.value.hasOwnProperty('filter') ? [this.formItems['filter'].data.value.filter_source] : null,
                        };
                        this.formItems['filter'].actions.showAdvancedDialog(data);
                    }
                }
            },
            {
                label: '请选择列名',
                name: 'columns',
                defaultValue: [],
                list: [],
                required: true,
                rules: [
                    {
                        errorMsg: '请至少选择一个列名',
                        type: 'required'
                    }
                ],
                type: 'checkbox',
                events: {
                    onChange:function(value) {
                        this.formItems['columns'].clearErrorMsg();
                        this.formItems['choosed'].actions.update(value);
                        this.formItems['table_single'].actions.setColumns(value, this.formItems['columnNum'].getValue());

                        let me = this;
                        // 以选择列名排序
                        let sort_items = this.formItems['choosed'].el.find('.form-chart-clo');
                        sort_items.sortable({
                            'update': function(event, ui) {
                                let sort_columns_list = sort_items.sortable( "toArray");
                                let columns = [];
                                sort_columns_list.forEach(item => {
                                    for (let column of me.formItems['columns'].data.value) {
                                        if (column.id === item) {
                                            columns.push(column);
                                            break;
                                        }
                                    }
                                });
                                me.formItems['columns'].data.value = columns;
                                me.formItems['table_single'].actions.setColumns(columns, me.formItems['columnNum'].getValue());
                            }
                        })
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
                label: '需要显示多少列',
                name: 'columnNum',
                defaultValue: '1',
                placeholder: '请输入默认显示单行为多少列',
                type: 'text',
                rules: [
                    {
                        errorMsg: '显示多少列数必须是大于0的整数',
                        type: 'positiveInteger'
                    }
                ],
                category: 'number',
                events: {
                    onChange: _.debounce(function(value) {
                        let columnNum = parseInt(value);
                        if (columnNum !== NaN) {
                            this.formItems['table_single'].actions.setColumns(this.formItems['choosed'].data.list, columnNum);
                        }
                    },100)
                }
            },
            {
                label: '默认排序',
                name: 'sort',
                defaultValue: '-1',
                list: [
                    {value: '1',name: '升序'},
                    {value: '-1', name:'降序'}
                ],
                type: 'radio'
            },
            {
                label: '',
                name: 'sortColumns',
                defaultValue: '',
                type: 'autocomplete',
                placeholder: '选择排序字段（非必选）'
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
                        }
                    }
                }
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
            button,
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
        this.actions.init();
        if (this.data.chart_id) {
            this.actions.fillChart(this.data.chart);
        }
    },
};

let MessageEditor = Base.extend(config);

export {MessageEditor}