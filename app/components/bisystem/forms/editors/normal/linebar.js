import {Base} from '../base';
import template from './linebar.html';
import {chartName,theme,icon,button,search} from '../form.chart.common';
import {ChartFormService} from '../../../../../services/bisystem/chart.form.service';
import msgbox from "../../../../../lib/msgbox";
import Mediator from '../../../../../lib/mediator';
import {canvasCellService} from '../../../../../services/bisystem/canvas.cell.service';
import './linebar.scss';
import {formChartValidateService as formValidate} from '../../../../../services/bisystem/bi.chart.validate.service';
let config = {
    template: template,
    actions: {

        /**
         * 更新默认展示y轴数据
         */
        updateYSelectedGroup() {
            if (this.formItems['yAxis0'] && this.formItems['yAxis1']) {
                let data = [];
                let yAxis0 = this.formItems['yAxis0'].getYaxisData();
                let yAxis1 = this.formItems['yAxis1'].getYaxisData();
                let double = this.formItems['double'].data.value[0] ? true : false;
                yAxis0.forEach(yAxis => {
                    if (yAxis.field) {
                        data.push(yAxis.field);
                    }
                });

                // 双y轴
                if (double) {
                    yAxis1.forEach(yAxis => {
                        if (yAxis.field) {
                            data.push(yAxis.field);
                        }
                    });
                };

                this.formItems['double'].clearErrorMsg();
                // 当是编辑模式下,需要先渲染完y轴在执行默认展示y轴数据
                if(this.data.id) {
                    if (data) {
                        if (this.data.chart['yAxis'].length == data.length) {
                            delete this.data.id;
                            return false;
                        }
                    }
                } else {
                    this.formItems['ySelectedGroup'].setList(data);
                };
            }
        },

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
                    msgbox.alert(res['error']);
                }
            } else {
                this.actions.loadColumns(table);
            }
        },

        /**
         * 渲染列名字段列表（x轴）
         * @param columns 表格列表字段（x轴）
         */
        async loadColumns(data) {
            if (this.formItems['xAxis']) {
                if (data) {
                    this.formItems['xAxis'].setList(data['x_field']);
                    this.formItems['yAxis0'].actions.updateY(data['y_field']);
                    this.formItems['yAxis1'].actions.updateY(data['y_field']);
                    this.formItems['chartGroup'].setList(data['x_field']);
                    this.formItems['sortColumns'].setList(data['x_field']);
                } else { // 清空字段
                    this.formItems['xAxis'].setList([]);
                    this.formItems['yAxis0'].actions.updateY([]);
                    this.formItems['yAxis1'].actions.updateY([]);
                    this.formItems['chartGroup'].setList([]);
                    this.formItems['sortColumns'].setList([]);
                }
            }
        },

        /**
         * 初始化图表操作
         */
        async init() {
            this.formItems['double'].trigger('onChange');
            this.formItems['yHorizontalColumns'].trigger('onChange');
            this.formItems['chartAssignment'].trigger('onChange');
            this.formItems['echartX'].trigger('onChange');
            this.formItems['defaultY'].trigger('onChange');

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
            let yAxis = [];

            this.formItems['yAxis0'].getYaxisData().forEach(item => {
                item['yAxisIndex'] = 0;
                yAxis.push(item);
            });
            if (data.double[0]) {
                this.formItems['yAxis1'].getYaxisData().forEach(item => {
                    item['yAxisIndex'] = 1;
                    yAxis.push(item);
                });
            };


            let ySelectedGroup = [];
            data.ySelectedGroup.forEach(item => {
                for (let y of yAxis){
                    if (item.id === y.field.id) {
                        ySelectedGroup.push(y);
                        break;
                    }
                }
            });

            let advancedDataTemplates = this.formItems.advancedDataTemplates.getValue();
            let chart = {
                advancedDataTemplates: advancedDataTemplates,
                assortment: 'normal',
                chartAssignment: data.chartAssignment == 1 ? {name:'分组', val:1} : {name:'下穿', val:2},
                chartName:{id: this.data.chart ? this.data.chart.chartName.id : '', name: data.chartName},
                countColumn: {},
                double:data.double[0] ? 1 : 0,
                echartX: data.echartX[0] ? {marginBottom: data.marginBottom, textNum:data.textNum}: {},
                filter: data.filter,
                icon: data.icon,
                relations: [],
                source: data.source,
                theme: data.theme,
                xAxis: data.xAxis,
                sort: data.sort,
                sortColumns:data.sortColumns ? [data.sortColumns] : [],
                yAxis: yAxis,
                yHorizontal: data.yHorizontal[0] ? true : false,
                yHorizontalColumns: data.yHorizontalColumns[0] ? {marginBottom:data.marginBottomx} : {},
                ySelectedGroup: data.defaultY[0] ? ySelectedGroup : [],
            };
            if (data.chartAssignment == 1) {
                chart['chartGroup'] = data.chartGroup;
            } else {
                chart['deeps'] = data.deeps
            };
            console.log(chart);
            let pass = true; // 判断表单是否验证通过

            for (let key of Object.keys(this.formItems)) {
                if (this.formItems[key].data.rules) {
                   let isValid = this.formItems[key].valid();
                   if (!isValid) {
                       pass = false;
                   };
                }
            };


            // y轴单独验证
            let yAxispass = formValidate.validateYAxis(yAxis);
            if (!yAxispass) {
                this.formItems['double'].showErrorMsg('y轴字段不能为空');
            };

            // 当选择分组字段时验证是否为空
            let groupPass = true;
            if (data.chartAssignment == 1) {
                groupPass = this.formItems['chartGroup'].data.value;
                if (!groupPass) {
                    this.formItems['chartAssignment'].showErrorMsg('分组字段不能为空');
                }
            };
            if (pass && yAxispass && groupPass) {
                this.save(chart);
            }
        },

        /**
         * 编辑时填充表格配置
         * @param chart = this.data.chart
         */
        fillChart(data) {
            let chart = _.cloneDeep(data);
            this.formItems['chartName'].setValue(chart['chartName']['name']);
            this.formItems['source'].setValue(chart['source']);
            this.formItems['theme'].setValue(chart['theme']);
            this.formItems['icon'].setValue(chart['icon']);
            this.formItems['filter'].setValue(chart['filter']);
            this.formItems['sort'].setValue(chart['sort']);
            this.formItems['sortColumns'].setValue(chart['sortColumns'][0]);
            this.formItems['xAxis'].setValue(chart['xAxis']);
            this.formItems['advancedDataTemplates'].setValue(chart['advancedDataTemplates']);
            let yAxis1 = _.remove(chart['yAxis'],(item) => {
                return item.yAxisIndex != 0
            })
            this.formItems['yAxis0'].setValue(chart['yAxis']);
            this.formItems['double'].setValue(chart['double']);
            if (chart['double'] == 1) {
                this.formItems['yAxis1'].setValue(yAxis1);
            };
            this.formItems['defaultY'].setValue(chart['ySelectedGroup'] && chart['ySelectedGroup'].length > 0 ? 1 : 0);
            this.formItems['ySelectedGroup'].setList(data['yAxis'].map(y => y.field));
            this.formItems['ySelectedGroup'].setValue(chart['ySelectedGroup'].map(item => item.field));
            this.formItems['yHorizontal'].setValue(chart['yHorizontal'] ? 1 : 0);
            this.formItems['yHorizontalColumns'].setValue(chart['yHorizontalColumns']['marginBottom'] ? 1 : 0);
            this.formItems['marginBottomx'].setValue(chart['yHorizontalColumns']['marginBottom'] ? chart['yHorizontalColumns']['marginBottom'] : '');
            this.formItems['echartX'].setValue(chart['echartX']['textNum'] ? 1 : 0);
            this.formItems['marginBottom'].setValue(chart['echartX']['marginBottom'] ? chart['echartX']['marginBottom'] : '');
            this.formItems['textNum'].setValue(chart['echartX']['textNum'] ? chart['echartX']['textNum'] : '');
            this.formItems['chartAssignment'].setValue(chart['chartAssignment'].val);
            if (chart['chartAssignment'].val == 1) {
                this.formItems['chartGroup'].setValue(chart['chartGroup']);
            } else {
                this.formItems['deeps'].setValue(chart['deeps']);
            };
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
                        console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
                        console.log(this.formItems['filter'].data.value);
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
                label: 'x轴字段',
                name: 'xAxis',
                defaultValue: '',
                required: true,
                rules: [
                    {
                        errorMsg: 'x轴字段不能为空',
                        type: 'required'
                    }
                ],
                type: 'autocomplete',
                events: {}
            },
            {
                label: 'Y轴字段',
                name: 'double',
                required: true,
                defaultValue: [],
                list: [
                    {
                        value:1, name: '是否展示双Y轴'
                    }
                ],
                type: 'checkbox',
                events: {
                    onChange:function(value) {
                        if (value && value[0]) {
                            this.formItems['yAxis1'].el.show();
                        } else {
                            this.formItems['yAxis1'].el.hide();
                        };
                        this.actions.updateYSelectedGroup();
                    }
                }
            },
            {
                label: '',
                name: 'yAxis0',
                defaultValue: '',
                type: 'yAxis',
                events: {
                    onSelectY: function(value){
                        this.actions.updateYSelectedGroup();
                    }
                }
            },
            {
                label: '',
                name: 'yAxis1',
                defaultValue: '',
                type: 'yAxis',
                events: {
                    onSelectY: function(value){
                        this.actions.updateYSelectedGroup();
                    }
                }
            },
            {
                label: '选择分组或下穿',
                name: 'chartAssignment',
                class: 'chart-assignment',
                required: true,
                defaultValue: 2,
                list: [
                    {'value': 1, 'name': '分组'},
                    {'value': 2, 'name': '下穿'},
                ],
                type: 'select',
                events:{
                    onChange: function(value) {
                        this.formItems['chartAssignment'].clearErrorMsg();
                        if (value == 1) {
                            this.formItems['deeps'].el.hide();
                            this.formItems['deeps'].actions.clear();
                        } else {
                            this.formItems['deeps'].el.show();
                        };
                        this.formItems['deeps'].actions.clear();
                        this.formItems['chartGroup'].autoselect.actions.clearValue();
                    }
                }
            },
            {
                label: '',
                name: 'chartGroup',
                defaultValue: '',
                class: 'chart-group',
                type: 'autocomplete',
                events: {
                    onSelect(value) {
                        this.formItems['chartAssignment'].clearErrorMsg();
                        if (value) {
                            this.formItems['deeps'].actions.update(value);
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
                label: '高级数据',
                name: 'advancedDataTemplates',
                defaultValue: [],
                type: 'advancedCompute',
                events: {
                }
            },
            {
                label: '更多设置',
                name: 'defaultY',
                defaultValue: [],
                list: [
                    {
                        value:1, name: '是否显示某一Y轴字段'
                    }
                ],
                type: 'checkbox',
                events: {
                    onChange:function(value) {
                        if (value && value[0]) {
                            this.formItems['ySelectedGroup'].el.show()
                        } else {
                            this.formItems['ySelectedGroup'].el.hide();
                        }
                    }
                }
            },
            {
                label: '',
                name: 'ySelectedGroup',
                defaultValue: [],
                list: [],
                type: 'checkbox',
                events: {
                    onChange:function(value) {
                    }
                }
            },
            {
                label: '',
                name: 'yHorizontal',
                defaultValue: [],
                list: [
                    {
                        value:1, name: '是否横向展示y轴数据'
                    }
                ],
                type: 'checkbox',
                events: {
                    onChange:function(value) {
                        if (value) {
                            this.formItems['echartX'].data.value = [];
                            this.formItems['echartX'].el.find('input').prop('checked', false);
                            this.formItems['echartX'].trigger('onChange', []);
                        }
                    }
                }
            },
            {
                label: '',
                name: 'yHorizontalColumns',
                defaultValue: [],
                list: [
                    {
                        value:1, name: '是否展示所有x轴数据(x轴45°展示)'
                    }
                ],
                type: 'checkbox',
                events: {
                    onChange:function(value) {
                        if (value && value[0]) {
                            this.formItems['marginBottomx'].el.show();
                        } else {
                            this.formItems['marginBottomx'].el.hide();
                        }
                    }
                }
            },
            {
                label: '',
                name: 'marginBottomx',
                defaultValue: '',
                placeholder: 'x轴下边距',
                category: 'number',
                type: 'text',
                events: {}
            },
            {
                label: '',
                name: 'echartX',
                defaultValue: [],
                list: [
                    {
                        value:1, name: 'X轴竖向展示'
                    }
                ],
                type: 'checkbox',
                events: {
                    onChange:function(value) {
                        if (value && value[0]) {
                            this.formItems['yHorizontal'].el.find('input').prop('checked', false);
                            this.formItems['yHorizontal'].data.value = [];
                            this.formItems['textNum'].el.show();
                            this.formItems['marginBottom'].el.show();
                        } else {
                            this.formItems['textNum'].el.hide();
                            this.formItems['marginBottom'].el.hide();
                        }
                    }
                }
            },
            {
                label: '',
                name: 'textNum',
                defaultValue:'',
                placeholder: 'x轴每行字数',
                type: 'text',
                category: 'number',
                events: {}
            },
            {
                label: '',
                name: 'marginBottom',
                defaultValue: '',
                placeholder: 'x轴下边距',
                category: 'number',
                type: 'text',
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
            button,
        ],
        firstDo: false, // 用于在编辑模式下 第一次加载保留数据
    },
    async afterRender() {
        if(this.data.id) {
            const res = await this.actions.getChartData(this.data.id);
            if (res[0]['success'] === 1) {
                this.data.chart = res[0]['data'];
            } else {
                msgbox.alert(res[0]['error'])
            };
        };
        // 渲染图表表单字段
        this.drawForm();
        this.actions.init();

        if (this.data.id) {
            this.actions.fillChart(this.data.chart);
        };
    }
}

class LineBarEditor extends Base {
    constructor(data, event) {
        super(config, data, event);
    }
}
export {LineBarEditor}