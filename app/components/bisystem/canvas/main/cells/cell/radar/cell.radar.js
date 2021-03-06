/**
 * Created by birdyy on 2017/7/31.
 */
import {CellBaseComponent} from '../base';
import template from './cell.radar.html';
import {EchartsService} from '../../../../../../../services/bisystem/echart.server';
import Mediator from '../../../../../../../lib/mediator';

let config = {
    template: template,
    data: {
        id: 'radar',
        cellChart: {}
    },
    actions: {
        echartsInit() {
            this.customAccuracy(this.data.cellChart.chart);
            let cellChart = this.data.cellChart.chart;
            if (cellChart['data']['rows']) {
                if (cellChart['data']['rows'].length > 0) {
                    let isDraw = true;
                    for (let row of cellChart['' +
                    'data']['rows']) { // 判断雷达图是否含有非数字
                        for (let num of row) {
                            if (isNaN(Number(num))) {
                                isDraw = false;
                                break;
                            }
                        }

                    }
                    if (isDraw) {
                        if(window.config.pdf){
                            //设置echarts渲染容器尺寸
                            let data = this.data;
                            let width = data.cell.size.width - 20;
                            let height = data.cell.size.height - 30;
                            this.el.find('#' + data.id).css('width',width).css('height',height);
                        }

                        let echartsService = new EchartsService(this.data);
                        this.radarChart = echartsService;
                    } else {
                        // alert('雷达图数据不能为非数字');
                    }

                }
            }
        },

        updateChart(data) {
            //重新渲染echarts
            const option = this.radarChart.radarOption(data);
            this.radarChart.myChart.setOption(option, true);
        }
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
            if (this.radarChart.myChart) {
                this.radarChart.myChart.resize();
            }
        })
    },
    firstAfterRender() {

        this.actions.echartsInit()
    }
};

export let CellRadarComponent = CellBaseComponent.extend(config);

// export class CellRadarComponent extends CellBaseComponent {
//     // constructor(cellChart) {
//     //     config.data.cellChart = cellChart ? cellChart : null;
//     //     super(config);
//     //     this.data.id += this.componentId
//     // }
//
//     constructor(data,event,extendConfig) {
//         data.cellChart = {
//             cell: data.cell,
//             chart: data.chart
//         };
//         super($.extend(true,{},config,extendConfig),data,event);
//         this.data.id += this.componentId;
//     }
// }
