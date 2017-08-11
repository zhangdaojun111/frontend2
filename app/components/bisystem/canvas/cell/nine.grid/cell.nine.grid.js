/**
 * Created by birdyy on 2017/7/31.
 */
import {BiBaseComponent} from '../../../bi.base.component';
import template from './cell.nine.grid.html';
import "./cell.nine.grid.scss";
import handlebars from 'handlebars';

// 自定义handlebar helper
handlebars.registerHelper('enumerateyAxis', function(index, options) {
    return config.data.yAxis[index];
});

handlebars.registerHelper('enumerateLegend', function(index, options) {
    let grids = config.data.grids.join(',')
    let arr = grids.split(',');
    return arr[index]
});


let config = {
    template: template,
    data: {
        cellChart: {},
        yAxis: [], // 大盘 小盘 中盘
        xAxis: [], // 价值 核心 成长
        grids: [], // 九宫图数据
        legend: []
    },
    actions: {
        /**
         * 初始化组装九宫格数据
         * @param cellChart 画布块数据(通过父类初始化子类传递进来)
         */
        init(cellChart) {
            if (
                cellChart['chart']['data']['rows'].length === 0 ||
                cellChart['chart']['data']['xAxis'].length === 0 ||
                cellChart['chart']['data']['yAxis'].length === 0) {
                return false;
            }
            let nineType = cellChart['chart']['type'];
            let grids = cellChart['chart']['data']['rows'][0];
            let types = [];
            let xAxis = [];
            let yAxis = [];
            let legend = [];

            // 合并九宫格数据为[[],[],[]]
            new Array(nineType).fill('').forEach((val, index) => {
                val = grids.slice(index * nineType, index * nineType + nineType);
                types.push(val);
            });

            Object.keys(cellChart['chart']['yAxis']).forEach(keys => {
                yAxis.push(cellChart['chart']['yAxis'][keys])
            });

            Object.keys(cellChart['chart']['xAxis']).forEach((keys,index) => {
                xAxis.push(cellChart['chart']['xAxis'][keys]);
                yAxis.forEach((val,yAxisindex) => {
                    legend.push(val+ cellChart['chart']['xAxis'][keys])
                })
            });

            config.data.grids = types;
            config.data.xAxis = xAxis;
            config.data.yAxis = yAxis;
            config.data.legend = legend;
        }
    },
    firstAfterRender() {}
}

export class CellNineGridComponent extends BiBaseComponent {
    constructor(cellChart) {
        config.data.cellChart = cellChart ? cellChart : null;
        config.actions.init(cellChart);
        super(config);
    }
}