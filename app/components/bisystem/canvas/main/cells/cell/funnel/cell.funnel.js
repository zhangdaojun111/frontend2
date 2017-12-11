/**
 * Created by birdyy on 2017/7/31.
 */
import {BiBaseComponent} from '../../../../../bi.base.component';
import template from './cell.funnel.html';
import {EchartsService} from '../../../../../../../services/bisystem/echart.server';
import Mediator from '../../../../../../../lib/mediator';


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
        },
        setChartData:function () {
            config.data.cellChart = cellChart ? cellChart : null;
        }
    },
    afterRender() {
        Mediator.subscribe(`bi:cell${this.componentId}:resize`, (data) => {
            this.myChart.resize();
        });
        this.data.id += this.componentId;
    },
    firstAfterRender() {
        this.actions.echartsInit()
    }
};

export class CellFunnelComponent extends BiBaseComponent {
    constructor(extendConfig) {
        super($.extend(true,{},config,extendConfig));
    }
}