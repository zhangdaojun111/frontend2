/**
 * Created by birdyy on 2017/8/30.
 * 数据源画布
 */
import Component from '../../../../../../../lib/component';
import template from './original.data.html';
import './original.data.scss';
import handlebars from 'handlebars';

// 自定义handlebar helper
handlebars.registerHelper('original_each_yAxis', function(data,index, options) {
    return data[index];
});

// 自定义handlebar helper
handlebars.registerHelper('original_data_title', function(data, options) {
    console.log(data);
    return data['field'] ? data['field']['name'] : data['name'];
});

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
        let originData = CanvasOriginalDataComponent.handleOriginalData(data);
        super(config,originData,events);
    }

    /**
     * 处理初始化数据(因为饼图,折线图返回数据格式不同)
     */
    static handleOriginalData(chart) {
        let data = _.cloneDeep(chart);
        if (chart.assortment === 'pie') { //如果饼图类型是多条情况
            if (chart.pieType.value == 2) {
                data.yAxis = [chart.yAxis]
            }
        };
        console.log(data);
        return data;
    }
}
