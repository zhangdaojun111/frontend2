/**
 * Created by birdyy on 2017/11/15.
 */
import {CellBaseComponent} from '../base';
import template from './cell.gauge.html';
import {EchartsService} from '../../../../../../../services/bisystem/echart.server';
import Mediator from '../../../../../../../lib/mediator';

let config = {
    template: template,
    data: {
        id: 'gauge',
        cellChart: {}
    },
    actions: {
        echartsInit() {
            if(window.config.pdf){
                //设置echarts渲染容器尺寸
                let data = this.data;
                let width = data.cell.size.width - 20;
                let height = data.cell.size.height - 30;
                this.el.find('#' + data.id).css('width',width).css('height',height);
            }

            this.echartsService = new EchartsService(this.data);
            this.myChart = this.echartsService.myChart;
        },
        updateChart(data) {
            //重新渲染echarts
            const option = this.echartsService.mapOption(data);
            this.myChart.setOption(option,true);
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
            if (this.myChart) {
                this.myChart.resize();
            }
        })
    },
    firstAfterRender() {

        this.actions.echartsInit()
    }
};

export let CellGaugeComponent = CellBaseComponent.extend(config);

// export class CellGaugeComponent extends CellBaseComponent {
//
//     constructor(extendConfig) {
//         data.cellChart = {
//             cell: data.cell,
//             chart: data.chart
//         };
//         super($.extend(true,{},config,extendConfig),data,event);
//     }
// }
