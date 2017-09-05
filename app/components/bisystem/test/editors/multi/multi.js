import {Base} from '../base';
import template from './multi.html';

import {chartName,theme,icon} from '../form.chart.common';
import {ChartFormService} from '../../../../../services/bisystem/chart.form.service';
import msgbox from "../../../../../lib/msgbox";
import Mediator from '../../../../../lib/mediator';
import {canvasCellService} from '../../../../../services/bisystem/canvas.cell.service';
import {ChartEditor} from './chart/chart';
import './multi.scss'

let config = {
    template: template,
    actions: {
        /**
         * 初始化图表操作
         */
       async init() {

           // 获取数据来源
          let p1 =  ChartFormService.getChartSource().then(res => {
                if (res['success'] === 1) {
                    this.data.source = res['data'];
                   // this.formItems['source'].setList(res['data']);
                } else {
                    msgbox.alert(res['error'])
                };
            });

            // 获取图标
          let p2 = ChartFormService.getChartIcon().then(res => {
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
          return Promise.all([p1,p2])
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
            let sources = [];
            Object.keys(this.data.charts).forEach(key => {
                sources.push(this.data.charts[key].getChartData());
            });
            console.log(sources);
            let chart = {
                assortment: 'multilist',
                chartName:{id: this.data.chart ? this.data.chart.chartName.id : '', name: data.chartName},
                icon: data.icon,
                sources: sources,
                theme: data.theme,
            };
            console.log(chart);
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
            this.formItems['chartName'].setValue(chart['chartName']['name']);
            this.formItems['theme'].setValue(chart['theme']);
            this.formItems['icon'].setValue(chart['icon']);
            chart['sources'].forEach(item => {
                let comp = this.actions.addChart(this.data.source);
                comp.setValue(item);
            });
        },

        /**
         * 添加图表
         */
        addChart(data) {
            let chart = new ChartEditor({
                source: data
            },{
                onRemoveChart: (componentId) => {
                    delete this.data.charts[componentId];
                }
            });
            this.data.charts[chart.componentId] = chart;
            this.append(chart, this.el.find('.form-group'));
            return chart;
        }
    },
    data: {
        options: [
            chartName,
            theme,
            icon,
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
        ],
        charts: {}
    },
    binds:[
        {
            event: 'click',
            selector: '.add-chart-btn',
            callback: function (context) {
                this.actions.addChart(this.data.source);
            }
        }
    ],
    async afterRender() {
        this.data.charts = {};
        this.data.chart_id = this.data.id;
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
        await this.actions.init();

        if (this.data.chart_id) {
            this.actions.fillChart(this.data.chart);
        }else {
            this.actions.addChart(this.data.source);
        }

    },
    firstAfterRender() {}
};

class MultiEditor extends Base {
    constructor(data, event) {
        super(config, data, event);
    }
}

export {MultiEditor}