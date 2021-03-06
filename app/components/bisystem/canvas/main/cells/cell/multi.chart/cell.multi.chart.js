/**
 * Created by birdyy on 2017/7/31.
 */
import {CellBaseComponent} from '../base';
import template from './cell.multi.chart.html';
import {EchartsService} from '../../../../../../../services/bisystem/echart.server';
import Mediator from '../../../../../../../lib/mediator';

let config = {
    template: template,
    data: {
        id: 'multi-chart',
    },
    actions: {
        echartsInit() {
            this.customAccuracy(this.data.cellChart.chart);
            if(window.config.pdf){
                //设置echarts渲染容器尺寸
                let data = this.data;
                let width = data.cell.size.width - 20;
                let height = data.cell.size.height - 30;
                this.el.find('#' + data.id).css('width',width).css('height',height);
            }

            let echartsService = new EchartsService(this.data);
            this.multiChart = echartsService;
        },

        updateChart(data) {
            //重新渲染echarts
            const option = this.multiChart.multiChartOption(data);
            this.multiChart.myChart.setOption(option,true);
        },
    },
    beforeRender(){
        this.data.cellChart = {
            cell:this.data.cell,
            chart:this.data.chart
        };
        this.data.id += this.componentId;
    },
    afterRender() {
        Mediator.subscribe(`bi:cell${this.componentId}:resize`, (data) => {
            this.data.cellChart.cell.size = data;
            const option = this.multiChart.multiChartOption(this.data.cellChart);
            const myChart = this.multiChart.myChart;
            myChart.setOption(option);
            myChart.resize();
        });
    },
    firstAfterRender() {
        this.actions.echartsInit()
    }
};

export let CellMultiChartComponent = CellBaseComponent.extend(config);


// export class CellMultiChartComponent extends CellBaseComponent {
//     // constructor(cellChart) {
//     //     config.data.cellChart = cellChart ? cellChart : null;
//     //     super(config);
//     //     this.data.id += this.componentId;
//     // }
//     constructor(data,event,extendConfig) {
//         data.cellChart = {
//             cell: data.cell,
//             chart: data.chart
//         };
//         super($.extend(true,{},config,extendConfig),data,event);
//     }
// }