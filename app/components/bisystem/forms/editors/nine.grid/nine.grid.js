import {Base} from '../base';
import template from './nine.grid.html';

import {chartName,theme,icon,button} from '../form.chart.common';
import {ChartFormService} from '../../../../../services/bisystem/chart.form.service';
import msgbox from "../../../../../lib/msgbox";
import Mediator from '../../../../../lib/mediator';
import {canvasCellService} from '../../../../../services/bisystem/canvas.cell.service';
import './nine.grid.scss';
let config = {
    template: template,
    actions: {
        /**
         * 初始化图表操作
         */
       async init() {
           this.formItems['type'].trigger('onChange',this.data.value);

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
            let [xAxis,yAxis] = [{},{}];
            for(let i = 1; i<=data.type;i++) {
                xAxis['x'+i] = data['x'+i];
                yAxis['y'+i] = data['y'+i];
            };
            let chart = {
                assortment: 'nineGrid',
                chartName:{id: this.data.chart ? this.data.chart.chartName.id : '', name: data.chartName},
                countColumn:'',
                icon: data.icon,
                source: data.source,
                theme: data.theme,
                type: data.type == 3 ? {'name': '3*3', 'value':3} : {'name': '4*4', 'value':4},
                xAxis:xAxis,
                yAxis:yAxis,
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
            this.formItems['type'].setValue(chart['type']);
            for(let i = 1; i<=chart.type;i++) {
                this.formItems['x'+i].setValue(chart['xAxis']['x'+i]);
                this.formItems['y'+i].setValue(chart['yAxis']['y'+i]);
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
                placeholder: '请选择数据来源',
                required: true,
                rules: [
                    {
                        errorMsg: '数据源不能为空',
                        type: 'required'
                    }
                ],
                type: 'autocomplete'
            },
            theme,
            icon,
            {
                label: '选择格子数',
                name: 'type',
                defaultValue: '3',
                list: [
                    {name:'3*3', value:'3'},
                    {name:'4*4', value:'4'}
                ],
                type: 'select',
                events: {
                    onChange:function(value) {
                        if (value == 4) {
                            this.formItems['x4'].el.show();
                            this.formItems['y4'].el.show();
                        } else {
                            this.formItems['x4'].el.hide();
                            this.formItems['y4'].el.hide();
                        }

                    }
                }
            },
            {
                label: '请输入x轴数据',
                name: 'x1',
                defaultValue: '',
                class:'fl',
                placeholder: '请输入x1',
                required: true,
                rules: [
                    {
                        errorMsg: '请填写完整的x轴数据',
                        type: 'required'
                    }
                ],
                type: 'text'
            },
            {
                label: '',
                name: 'x2',
                defaultValue: '',
                class:'fl',
                placeholder: '请输入x2',
                type: 'text'
            },
            {
                label: '',
                name: 'x3',
                defaultValue: '',
                class:'fl',
                placeholder: '请输入x3',
                type: 'text'
            },
            {
                label: '',
                name: 'x4',
                defaultValue: '',
                class:'fl',
                placeholder: '请输入x4',
                type: 'text'
            },
            {
                label: '请输入y轴数据',
                name: 'y1',
                defaultValue: '',
                class:'fl y1',
                placeholder: '请输入y1',
                required: true,
                rules: [
                    {
                        errorMsg: '请填写完整的x轴数据',
                        type: 'required'
                    }
                ],
                type: 'text'
            },
            {
                label: '',
                name: 'y2',
                defaultValue: '',
                class:'fl',
                placeholder: '请输入y2',
                type: 'text'
            },
            {
                label: '',
                name: 'y3',
                defaultValue: '',
                class:'fl',
                placeholder: '请输入y3',
                type: 'text'
            },
            {
                label: '',
                name: 'y4',
                defaultValue: '',
                class:'fl',
                placeholder: '请输入y4',
                type: 'text'
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

class NineGridEditor extends Base {
    constructor(data) {
        config.data.chart_id = data.id ? data.id : null;
        super(config);
    }
}

export {NineGridEditor}