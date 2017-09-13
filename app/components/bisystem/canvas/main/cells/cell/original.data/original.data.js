/**
 * Created by birdyy on 2017/8/30.
 * 数据源画布
 */
import Component from '../../../../../../../lib/component';
import template from './original.data.html';
import './original.data.scss';

let config = {
    template: template,
    actions: {},
    data: {
        showData:true,
        deepOriginalData: { // 通过初始化数据组装后得到的下穿数据
            titles: [],
            items: []
        }
    },
    binds:[
        {
            event:'click',
            selector:'.bi-origin-data-close',
            callback:function () {
                this.destroySelf();
            }
        }
    ],
    afterRender() {},
    firstAfterRender() {},
    beforeDestory() {}
};

export class CanvasOriginalDataComponent extends Component {
    constructor(data,events) {
        CanvasOriginalDataComponent.handleOriginalData(data);
        super(config,data,events)
    }

    /**
     * 处理初始化数据(因为饼图,折线图返回数据格式不同)
     */
    static handleOriginalData(chart) {
        console.log(chart);
        if (chart.assortment === 'pie') {
        } else {
            let items = [];
            chart.data.xAxis.forEach((val,index) => {
                console.log(val);
            });
            data.originalData.items = []
        }
    }
}
