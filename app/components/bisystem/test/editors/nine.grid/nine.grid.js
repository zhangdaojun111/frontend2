import {Base} from '../base';
import template from './nine.grid.html';

import {chartName,theme,icon} from '../form.chart.common';
import {ChartFormService} from '../../../../../services/bisystem/chart.form.service';
import msgbox from "../../../../../lib/msgbox";
import Mediator from '../../../../../lib/mediator';
import {canvasCellService} from '../../../../../services/bisystem/canvas.cell.service';

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
                filter: [],
                icon: data.icon,
                source: data.source,
                theme: data.theme,
                type: data.type == 3 ? {'name': '3*3', 'value':3} : {'name': '4*4', 'value':4},
                xAxis:xAxis,
                yAxis:yAxis,
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
                label: '请输入x轴名称1',
                name: 'x1',
                defaultValue: '',
                type: 'text'
            },
            {
                label: '请输入x轴名称2',
                name: 'x2',
                defaultValue: '',
                type: 'text'
            },
            {
                label: '请输入x轴名称3',
                name: 'x3',
                defaultValue: '',
                type: 'text'
            },
            {
                label: '请输入x轴名称4',
                name: 'x4',
                defaultValue: '',
                type: 'text'
            },
            {
                label: '请输入y轴名称1',
                name: 'y1',
                defaultValue: '',
                type: 'text'
            },
            {
                label: '请输入y轴名称2',
                name: 'y2',
                defaultValue: '',
                type: 'text'
            },
            {
                label: '请输入y轴名称3',
                name: 'y3',
                defaultValue: '',
                type: 'text'
            },
            {
                label: '请输入y轴名称4',
                name: 'y4',
                defaultValue: '',
                type: 'text'
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

class NineGridEditor extends Base {
    constructor(data) {
        config.data.chart_id = data.id ? data.id : null;
        super(config);
    }
}

export {NineGridEditor}