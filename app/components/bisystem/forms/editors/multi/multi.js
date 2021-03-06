import {Base} from '../base';
import template from './multi.html';

import {chartName, theme, icon, button} from '../form.chart.common';
import {ChartFormService} from '../../../../../services/bisystem/chart.form.service';
import msgbox from "../../../../../lib/msgbox";
import Mediator from '../../../../../lib/mediator';
import {canvasCellService} from '../../../../../services/bisystem/canvas.cell.service';
import {ChartEditor} from './chart/chart';
import './multi.scss';


let config = {
    template: template,
    actions: {
        /**
         * 初始化图表操作
         */
       async init() {
            this.formItems['customAccuracy'].trigger('onChange');
            this.formItems['customTextStyle'].trigger('onChange');
           // 获取数据来源
          // let p1 =  ChartFormService.getChartSource().then(res => {
          //       if (res['success'] === 1) {
          //           this.data.source = res['data'];
          //          // this.formItems['source'].setList(res['data']);
          //       } else {
          //           msgbox.alert(res['error'])
          //       }
          //   });
            const p1 = await ChartFormService.getChartSource();
            if (p1['success'] === 1) {
                this.data.source = p1['data'];
                // this.formItems['source'].setList(res['data']);
            } else {
                msgbox.alert(p1['error'])
            }


            // 获取图标
            let p2 = ChartFormService.getChartIcon().then(res => {
                if (res['success'] === 1) {
                    let icons = [];
                    icons = res['data'].map(icon => {
                        return {value: icon, name: `<img src=/bi/download_icon/?file_id=${icon} />`}
                    });
                    this.formItems['icon'].setList(icons)
                } else {
                    msgbox.alert(res['error'])
                }
            });
            return Promise.all([p1, p2])
        },

        /**
         * 当是编辑模式时，此时所有操作都需要等到从服务器获取渲染完成后再渲染字段
         */
        async getChartData(id) {
            let layout = {
                "chart_id": id,
                "floor": 0,
                "view_id": "",
                "layout_id": "",
                "xOld": {},
                "row_id": 0,
                "deep_info": {}
            };
            const data = {
                layouts: [JSON.stringify(layout)],
                query_type: 'deep',
                is_deep: 1,
            };
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
            let chart = {
                assortment: 'multilist',
                chartName: {id: this.data.chart ? this.data.chart.chartName.id : '', name: data.chartName},
                icon: data.icon,
                sources: sources,
                theme: data.theme,
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
            //发送状态给子组件
            Mediator.emit('bi:multi:chart', 1);
            //判断验证是否全部通过
            if (pass && config.data.succ) {
                this.save(chart);
            }
            config.data.succ = true;

        },

        /**
         * 编辑时填充表格配置
         * @param chart = this.data.chart
         */
        fillChart(chart) {
            this.formItems['chartName'].setValue(chart['chartName']['name']);
            this.formItems['theme'].setValue(chart['theme']);
            this.formItems['icon'].setValue(chart['icon']);
            this.formItems['customAccuracy'].setValue(chart['customAccuracy'] ? 1 : 0);
            this.formItems['customAccuracyNum'].setValue(chart['customAccuracy'] ? chart['customAccuracy'] : 1);
            chart['sources'].forEach(item => {
                let comp = this.actions.addChart(this.data.source);
                comp.setValue(item);
            });
            this.formItems['customTextStyle'].setValue(chart['customTextStyle'].hasOwnProperty('titleSize') ? 1 : 0);
            this.formItems['titleSize'].setValue(chart['customTextStyle'].hasOwnProperty('titleSize') ? chart['customTextStyle']['titleSize'] : 14);
            this.formItems['chartSize'].setValue(chart['customTextStyle'].hasOwnProperty('chartSize') ? chart['customTextStyle']['chartSize'] : 12);
        },

        /**
         * 添加图表
         */
         addChart(data) {
            let chart = new ChartEditor({
                data:{
                    source: data,
                },
                events:{
                    onRemoveChart: (componentId) => {
                        delete this.data.charts[componentId];
                    },
                    onChange: function (data) {
                        config.data.succ = data;
                    },
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
                label: '更多设置',
                name: 'customAccuracy',
                defaultValue: [],
                list: [
                    {
                        value: 1, name: '自定义设置精度'
                    }
                ],
                type: 'checkbox',
                class: 'customAccuracy',
                events: {
                    onChange: function (value) {
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
                textTip: '请输入自定义精度：',
                type: 'text',
                class: 'customAccuracyNum',
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
            button
        ],
        charts: {},
        succ: true,
    },
    binds: [
        {
            event: 'click',
            selector: '.add-chart-btn',
            callback: function (context) {
                this.actions.addChart(this.data.source);
            }
        }
    ],
    beforeRender(){
        this.data.chart_id = this.data.id
    },
    async afterRender() {
        this.data.charts = {};
        this.data.chart_id = this.data.id;
        if (this.data.chart_id) {
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
        } else {
            this.actions.addChart(this.data.source);
        }

    },
    firstAfterRender() {
    }
};

let MultiEditor = Base.extend(config);

// class MultiEditor extends Base {
//     constructor(data, event,extendConfig) {
//         super($.extend(true,{},config,extendConfig), data, event);
//     }
// }

export {MultiEditor};