/**
 * Created by zhaoyan on 2017/11/15.
 */
import {CellBaseComponent} from '../base';
import template from './cell.map.html';
import {EchartsService} from '../../../../../../../services/bisystem/echart.server';
import Mediator from '../../../../../../../lib/mediator';

let config = {
    template: template,
    data: {
        id: 'map',
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

            console.log(this.data);
            let echartsService = new EchartsService(this.data);
            this.myChart = echartsService.myChart;
            let that = this;
            //设置没有值的地区为灰色且不高亮
            this.myChart.on('mouseover', function (params) {
                let dataIndex = params.dataIndex;
                if(!params.value || isNaN(params.value)){
                    that.myChart.dispatchAction({
                        type: 'downplay'
                    });
                    that.myChart.dispatchAction({
                        type: 'hideTip',
                    });
                }else{
                    that.myChart.dispatchAction({
                        type: 'showTip',
                        seriesIndex: 0,
                        dataIndex: dataIndex,
                    });
                }
            });
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
            if (this.myChart) {
                this.myChart.resize();
            }
        })
    },
    firstAfterRender() {
        this.actions.echartsInit()
    }
};

export let CellMapComponent = CellBaseComponent.extend(config);

// export class CellMapComponent extends CellBaseComponent {
//     constructor(data,event,extendConfig) {
//         data.cellChart = {
//             cell: data.cell,
//             chart: data.chart
//         };
//         super($.extend(true,{},config,extendConfig),data,event);
//
//     }
// }
