/**
 * Created by birdyy on 2017/7/31.
 */
import {BiBaseComponent} from '../../../../../bi.base.component';
import template from './cell.funnel.html';
import {EchartsService} from '../../../../../../../services/bisystem/echart.server';
import Mediator from '../../../../../../../lib/mediator';
import Component from "../../../../../../../lib/component";


let config = {
    template: template,
    data: {
        id: 'funnel',
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

            let echartsService = new EchartsService(this.data);
            this.myChart = echartsService.myChart;
        }
    },
    beforeRender(){
        this.data.id += this.componentId;
    },
    afterRender() {
        Mediator.subscribe(`bi:cell${this.componentId}:resize`, (data) => {
            this.myChart.resize();
        });
    },
    firstAfterRender() {
        console.log(this.data.cellChart);
        this.actions.echartsInit();
    }
};

export let CellFunnelComponent = BiBaseComponent.extend(config);


// export class CellFunnelComponent extends BiBaseComponent {
//     constructor(extendConfig) {
//         config.data.cellChart = cellChart ? cellChart : null;
//         super($.extend(true,{},config,extendConfig));
//         this.data.id += this.componentId
//     }
// }