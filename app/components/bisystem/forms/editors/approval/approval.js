import {Base} from '../base';
import template from './approval.html';
import './approval.scss';

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
           // this.formItems['countColumn'].el.hide();
           // this.formItems['single'].trigger('onChange');
           // 获取数据来源
           //  ChartFormService.getChartSource().then(res => {
           //      if (res['success'] === 1) {
           //          this.formItems['source'].setList(res['data']);
           //      } else {
           //          msgbox.alert(res['error'])
           //      }
           //  });

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
         * 保存图表数据
         */
        async saveChart() {
            let data = this.getData();
            let chart = {
                assortment: 'approval',
                chartName:{id: this.data.chart ? this.data.chart.chartName.id : '', name: data.chartName},
                icon: data.icon,
                theme: data.theme,
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

        /**
         * 编辑时填充表格配置
         * @param chart = this.data.chart
         */
        fillChart(chart) {
            this.formItems['chartName'].setValue(chart['chartName']['name']);
            this.formItems['theme'].setValue(chart['theme']);
            this.formItems['icon'].setValue(chart['icon']);
        }
    },
    data: {
        options: [
            chartName,
            theme,
            icon,
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

let ApprovalEditor = Base.extend(config);

export {ApprovalEditor}